const { pool } = require("../config/db.js");
const { ymdInTz } = require("../utils/time");

// ---------- Utilities ----------
const ALLOWED_TYPES = new Set([
  "empty",
  "corridor",
  "stair",
  "decoration",
  "room",
]);
const ALLOWED_BASE = new Set(["free", "disabled"]);

// แปลง slotId -> label (ถ้าไม่มีตาราง slots)
async function getSlotLabel(slotId) {
  try {
    const [rows] = await pool.query(
      `SELECT label FROM time_slots WHERE id = ? LIMIT 1`,
      [slotId]
    );
    if (rows.length) return rows[0].label;
  } catch (_) {}
  // fallback (เผื่อยังไม่ได้มีตาราง slots)
  const map = {
    S1: "08:00-10:00",
    S2: "10:00-12:00",
    S3: "13:00-15:00",
    S4: "15:00-17:00",
  };
  return map[slotId] || slotId;
}

// /**
//  * GET /api/cells/map?floor=5&slotId=S1&date=2025-11-03
//  * - overlay เฉพาะ reservations ของ "date" นั้น
//  * - ถ้าไม่ส่ง date → ใช้วันนี้ตามเวลาไทย
//  */
exports.mapByFloorAndSlot = async (req, res) => {
  try {
    const floor = parseInt(req.query.floor, 10);
    const slotId = (req.query.slotId || "").trim();
    const dateStr = (req.query.date || ymdInTz()).slice(0, 10); // YYYY-MM-DD

    if (!Number.isFinite(floor) || !slotId) {
      return res.status(400).json({ message: "floor and slotId are required" });
    }

    const [rows] = await pool.query(
      `
      SELECT
        c.id,
        c.floor,
        c.x, c.y,
        c.type,
        c.room_no,
        c.base_status,
        c.is_hidden,
        r.status AS booking_status
      FROM cells c
      LEFT JOIN reservations r
        ON r.cell_id = c.id
       AND r.slot_id = ?
       AND r.status IN ('pending','reserved')
       AND DATE(r.created_at) = ?
      WHERE c.floor = ?
       AND c.x IS NOT NULL
       AND c.y IS NOT NULL
      ORDER BY c.y, c.x
      `,
      [slotId, dateStr, floor]
    );

    const slotLabel = await getSlotLabel(slotId);

    const data = rows.map((row) => {
      const isHidden = !!row.is_hidden;
      // type สำหรับ UI
      const uiType = isHidden ? "empty" : row.type;

      // status สำหรับ UI
      let uiStatus = "disabled";
      if (!isHidden && row.type === "room") {
        uiStatus = row.booking_status || row.base_status || "disabled";
      }

      return {
        id: row.id,
        floor: row.floor,
        slotId,
        slotLabel,
        date: dateStr,
        x: row.x,
        y: row.y,
        type: uiType,
        roomNo: row.room_no || null,
        baseStatus: row.base_status,
        bookingStatus: row.booking_status || null,
        status: uiStatus,
        hidden: isHidden,
      };
    });

    return res.json(data);
  } catch (err) {
    console.error("mapByFloorAndSlot error:", err);
    return res.status(500).json({ message: "server error" });
  }
};

/**
 * PUT /api/cells/:id/type
 * body: { type: 'empty'|'corridor'|'stair'|'decoration'}
 */
// controllers/cells.js
exports.updateType = async (req, res) => {
  const id = +req.params.id;
  const { type } = req.body || {};
  try {
    if (!ALLOWED_TYPES.has(type)) {
      return res.status(400).json({ message: "invalid type" });
    }

    // ✅ ปิดทาง: ห้ามใช้ endpoint นี้เพื่อสร้างห้องใหม่
    if (type === "room") {
      return res.status(400).json({
        message: "use POST /api/cells/provision-room to create/convert to room",
      });
    }

    // ตรวจว่ามี cell นี้ไหม
    const [cells] = await pool.query(
      `SELECT id, type FROM cells WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!cells.length)
      return res.status(404).json({ message: "cell not found" });

    // ถ้าเปลี่ยนเป็น non-room → ล้างชื่อห้อง + ปิดสถานะฐาน
    await pool.query(
      `UPDATE cells
         SET type = ?,
             room_no = NULL,
             base_status = 'disabled',
             updated_at = NOW()
       WHERE id = ?`,
      [type, id]
    );

    const [updated] = await pool.query(`SELECT * FROM cells WHERE id = ?`, [
      id,
    ]);
    return res.json(updated[0]);
  } catch (err) {
    console.error("updateType error:", err);
    return res.status(500).json({ message: "server error" });
  }
};

/**
 * PUT /api/cells/:id/base-status
 * body: { base_status: 'free'|'disabled' }
 * - ใช้ได้เฉพาะกับ type = 'room'
 */
exports.updateBaseStatus = async (req, res) => {
  const id = +req.params.id;
  const { base_status } = req.body || {};
  try {
    if (!ALLOWED_BASE.has(base_status)) {
      return res.status(400).json({ message: "invalid base_status" });
    }

    const [cells] = await pool.query(
      `SELECT id, type FROM cells WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!cells.length)
      return res.status(404).json({ message: "cell not found" });
    if (cells[0].type !== "room") {
      return res
        .status(400)
        .json({ message: 'base_status is only applicable to type "room"' });
    }

    await pool.query(
      `UPDATE cells
         SET base_status = ?,
             updated_at = NOW()
       WHERE id = ?`,
      [base_status, id]
    );

    const [updated] = await pool.query(`SELECT * FROM cells WHERE id = ?`, [
      id,
    ]);
    return res.json(updated[0]);
  } catch (err) {
    console.error("updateBaseStatus error:", err);
    return res.status(500).json({ message: "server error" });
  }
};

// PUT /api/cells/:id/hide
// body: { hidden: true|false, detach: boolean }  // detach=true = ปล่อยพิกัดและสร้าง empty แทน
exports.setHidden = async (req, res) => {
  const id = +req.params.id;
  const { hidden, detach } = req.body || {};
  const conn = await pool.getConnection();
  try {
    if (typeof hidden !== "boolean") {
      return res.status(400).json({ message: "hidden must be boolean" });
    }

    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT id, floor, x, y, is_hidden FROM cells WHERE id = ? FOR UPDATE`,
      [id]
    );
    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ message: "cell not found" });
    }
    const row = rows[0];

    if (hidden && detach && row.x != null && row.y != null) {
      const { floor, x, y } = row;

      // 1) ย้าย cell เดิมออกนอกกริด
      await conn.query(
        `UPDATE cells
           SET is_hidden = 1,
               x = NULL,
               y = NULL,
               base_status = 'disabled',
               updated_at = NOW()
         WHERE id = ?`,
        [id]
      );

      // 2) เติม cell ว่างไปครองพิกัดเดิม
      await conn.query(
        `INSERT INTO cells (floor, x, y, type, room_no, is_hidden, base_status)
         VALUES (?, ?, ?, 'empty', NULL, 0, 'disabled')`,
        [floor, x, y]
      );
    } else {
      // toggle ธรรมดา (ไม่ปล่อยพิกัด)
      await conn.query(
        `UPDATE cells SET is_hidden = ?, updated_at = NOW() WHERE id = ?`,
        [hidden ? 1 : 0, id]
      );
    }

    await conn.commit();

    const [updated] = await pool.query(`SELECT * FROM cells WHERE id = ?`, [
      id,
    ]);
    return res.json(updated[0] || { id, is_hidden: 1 });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {}
    console.error("setHidden error:", err);
    return res.status(500).json({ message: "server error" });
  } finally {
    conn.release();
  }
};

/**
 * PUT /api/cells/:id/room
 * body: { room_no: string }
 * - เปลี่ยนชื่อห้อง (กันซ้ำกับห้องที่เปิดใช้งาน hidden=0)
 * - ถ้าซ้ำกับห้องที่เปิดอยู่ → 409
 * - ถ้าซ้ำกับห้องที่ซ่อนอยู่ → 409 พร้อมบอกว่า duplicate_hidden = true (ให้ frontend ตัดสินใจ flow swap เอง)
 */
exports.updateRoomNo = async (req, res) => {
  const id = +req.params.id;
  const { room_no } = req.body || {};
  try {
    if (!room_no || typeof room_no !== "string") {
      return res.status(400).json({ message: "room_no is required" });
    }

    // ต้องเป็น room และรู้ floor
    const [[cell]] = await pool.query(
      `SELECT id, type, floor FROM cells WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!cell) return res.status(404).json({ message: "cell not found" });
    if (cell.type !== "room") {
      return res
        .status(400)
        .json({ message: 'only type "room" can have room_no' });
    }

    // ชื่อซ้ำกับห้องที่เปิดอยู่ "ในชั้นเดียวกัน"?
    const [dupOpen] = await pool.query(
      `SELECT id FROM cells
        WHERE floor = ? AND room_no = ? AND is_hidden = 0 AND id <> ?
        LIMIT 1`,
      [cell.floor, room_no, id]
    );
    if (dupOpen.length) {
      return res.status(409).json({
        message: "room_no already in use by visible room on this floor",
      });
    }

    // ชน hidden ในชั้นเดียวกัน? → แจ้งให้ front เลือก swap
    const [dupHidden] = await pool.query(
      `SELECT id FROM cells
        WHERE floor = ? AND room_no = ? AND is_hidden = 1
        LIMIT 1`,
      [cell.floor, room_no]
    );
    if (dupHidden.length) {
      return res.status(409).json({
        message: "room_no already exists in hidden room on this floor",
        duplicate_hidden: true,
        hidden_cell_id: dupHidden[0].id,
      });
    }

    // ผ่าน → อัปเดตชื่อ
    await pool.query(
      `UPDATE cells
          SET room_no = ?,
              updated_at = NOW()
        WHERE id = ?`,
      [room_no, id]
    );

    const [updated] = await pool.query(`SELECT * FROM cells WHERE id = ?`, [
      id,
    ]);
    return res.json(updated[0]);
  } catch (err) {
    console.error("updateRoomNo error:", err);
    return res.status(500).json({ message: "server error" });
  }
};

// POST /api/cells/provision-room
// body: { floor, x, y, room_no?: string }
// กติกา: ใช้ห้องที่ซ่อน (hidden) ก่อน, ถ้าไม่มีค่อย autogen room_no
exports.provisionRoom = async (req, res) => {
  const { floor, x, y, room_no } = req.body || {};
  const conn = await pool.getConnection();
  try {
    if (
      !Number.isFinite(+floor) ||
      !Number.isFinite(+x) ||
      !Number.isFinite(+y)
    ) {
      return res.status(400).json({ message: "floor, x, y are required" });
    }

    await conn.beginTransaction();

    // ล็อค cell เป้าหมาย (ต้องยังมองเห็น และยังไม่เป็น room)
    const [[cellAt]] = await conn.query(
      `SELECT id, type, is_hidden
         FROM cells
        WHERE floor = ? AND x = ? AND y = ?
        FOR UPDATE`,
      [floor, x, y]
    );
    if (!cellAt) {
      await conn.rollback();
      return res.status(404).json({ message: "target coordinate not found" });
    }
    if (cellAt.is_hidden !== 0) {
      await conn.rollback();
      return res.status(400).json({ message: "target coordinate is hidden" });
    }
    if (cellAt.type === "room") {
      await conn.rollback();
      return res.status(400).json({ message: "target is already a room" });
    }

    // -----------------------------
    // 1) ถ้าไม่ได้ส่ง room_no → "ดึง hidden ของชั้นนี้ก่อน" (เลขน้อย→มาก)
    // -----------------------------
    if (!room_no) {
      const [cand] = await conn.query(
        `SELECT c.id, c.room_no
           FROM cells c
          WHERE c.floor = ?
            AND c.is_hidden = 1
            AND c.type = 'room'
            AND c.room_no IS NOT NULL
            AND NOT EXISTS (
                  SELECT 1
                    FROM cells v
                   WHERE v.floor = c.floor
                     AND v.room_no = c.room_no
                     AND v.is_hidden = 0
            )
          ORDER BY
            CASE WHEN c.room_no REGEXP '^[0-9]+$' THEN 0 ELSE 1 END ASC,
            CAST(c.room_no AS UNSIGNED) ASC,
            c.room_no ASC
          LIMIT 1
          FOR UPDATE`,
        [floor]
      );

      if (cand.length) {
        const hiddenId = cand[0].id;

        // ลบ cell ปัจจุบัน (ปล่อยพิกัด)
        await conn.query(`DELETE FROM cells WHERE id = ? AND type <> 'room'`, [
          cellAt.id,
        ]);

        // ปลุก hidden มาใส่พิกัดนี้
        await conn.query(
          `UPDATE cells
              SET is_hidden = 0,
                  floor = ?,
                  x = ?,
                  y = ?,
                  type = 'room',
                  base_status = IFNULL(base_status, 'disabled'),
                  updated_at = NOW()
            WHERE id = ?`,
          [floor, x, y, hiddenId]
        );

        await conn.commit();
        const [[activated]] = await pool.query(
          `SELECT * FROM cells WHERE id = ?`,
          [hiddenId]
        );
        const [[detached]] = await pool.query(
          `SELECT * FROM cells WHERE id = ?`,
          [cellAt.id]
        );
        return res.json({
          activatedRoom: activated,
          detachedCell: detached,
          reusedHidden: true,
        });
      }
    }

    // -----------------------------
    // 2) ไม่มี hidden ให้ใช้ หรือ "ส่ง room_no มา"
    //    → ตรวจซ้ำเฉพาะใน "ชั้นเดียวกัน"
    // -----------------------------
    let targetRoomNo = room_no;

    if (!targetRoomNo) {
      // autogen จากเลขสูงสุดของ "ชั้นเดียวกัน" เฉพาะเลขล้วนของห้องที่มองเห็นอยู่
      const [[maxRow]] = await conn.query(
        `SELECT MAX(CAST(room_no AS UNSIGNED)) AS max_no
           FROM cells
          WHERE floor = ?
            AND is_hidden = 0
            AND type = 'room'
            AND room_no REGEXP '^[0-9]+$'`,
        [floor]
      );
      const maxNo = maxRow?.max_no || 0;
      targetRoomNo = String(maxNo + 1);
    }

    // visible ซ้ำในชั้นเดียวกัน?
    const [dupOpen] = await conn.query(
      `SELECT id
         FROM cells
        WHERE floor = ? AND room_no = ? AND is_hidden = 0
        LIMIT 1`,
      [floor, targetRoomNo]
    );
    if (dupOpen.length) {
      await conn.rollback();
      return res
        .status(409)
        .json({
          message: "room_no already in use by visible room on this floor",
        });
    }

    // hidden ซ้ำในชั้นเดียวกัน? → ปลุก hidden มาใช้แทน
    const [[dupHidden]] = await conn.query(
      `SELECT id
         FROM cells
        WHERE floor = ? AND room_no = ? AND is_hidden = 1
        LIMIT 1
        FOR UPDATE`,
      [floor, targetRoomNo]
    );

    if (dupHidden) {
      await conn.query(`DELETE FROM cells WHERE id = ? AND type <> 'room'`, [
        cellAt.id,
      ]);

      await conn.query(
        `UPDATE cells
            SET is_hidden = 0,
                floor = ?,
                x = ?,
                y = ?,
                type = 'room',
                base_status = IFNULL(base_status, 'free'),
                updated_at = NOW()
          WHERE id = ?`,
        [floor, x, y, dupHidden.id]
      );

      await conn.commit();
      const [[activated]] = await pool.query(
        `SELECT * FROM cells WHERE id = ?`,
        [dupHidden.id]
      );
      const [[detached]] = await pool.query(
        `SELECT * FROM cells WHERE id = ?`,
        [cellAt.id]
      );
      return res.json({
        activatedRoom: activated,
        detachedCell: detached,
        reusedHidden: true,
      });
    }

    // 3) ไม่ชน → เปลี่ยน cell ปัจจุบันให้เป็นห้องใหม่
    await conn.query(
      `UPDATE cells
          SET type = 'room',
              room_no = ?,
              base_status = 'disabled',
              updated_at = NOW()
        WHERE id = ?`,
      [targetRoomNo, cellAt.id]
    );

    await conn.commit();
    const [[u]] = await pool.query(`SELECT * FROM cells WHERE id = ?`, [
      cellAt.id,
    ]);
    return res.json({ newRoom: u, reusedHidden: false });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {}
    console.error("provisionRoom error:", err);
    return res.status(500).json({ message: "server error" });
  } finally {
    conn.release();
  }
};

// POST /api/cells/swap-with-hidden
// body: { visibleId, hiddenId }
// ใช้ตอน rename แล้วชน visible↔hidden และ visible↔visible → swap
exports.swapWithHidden = async (req, res) => {
  const { visibleId, hiddenId } = req.body || {};
  const conn = await pool.getConnection();

  try {
    if (!Number.isFinite(+visibleId) || !Number.isFinite(+hiddenId)) {
      return res
        .status(400)
        .json({ message: "visibleId and hiddenId are required" });
    }

    await conn.beginTransaction();

    const [[vis]] = await conn.query(
      `SELECT id, room_no, floor, x, y, type, is_hidden
         FROM cells
        WHERE id = ?
        FOR UPDATE`,
      [visibleId]
    );
    const [[other]] = await conn.query(
      `SELECT id, room_no, floor, x, y, type, is_hidden
         FROM cells
        WHERE id = ?
        FOR UPDATE`,
      [hiddenId]
    );

    if (!vis || !other) {
      await conn.rollback();
      return res.status(404).json({ message: "cell not found" });
    }
    if (vis.type !== "room" || other.type !== "room") {
      await conn.rollback();
      return res.status(400).json({ message: "both cells must be type 'room'" });
    }
    if (vis.x == null || vis.y == null) {
      await conn.rollback();
      return res
        .status(400)
        .json({ message: "visible room has no coordinates" });
    }

    // กรณี A: visible ↔ hidden (เดิม)
    if (vis.is_hidden === 0 && other.is_hidden === 1) {
        // ซ่อนห้องเดิม + ปล่อยพิกัด
        await conn.query(
            `UPDATE cells
                SET is_hidden = 1,
                    x = NULL,
                    y = NULL,
                updated_at = NOW()
            WHERE id = ?`,
        [vis.id]
      );

      // ปลุก hidden มาใส่พิกัด
      await conn.query(
        `UPDATE cells
           SET is_hidden = 0,
               floor = ?,
               x = ?,
               y = ?,
               updated_at = NOW()
         WHERE id = ?`,
        [vis.floor, vis.x, vis.y, other.id]
      );

      await conn.commit();
      return res.json({
        action: "swap-hidden",
        from: { id: vis.id, room_no: vis.room_no },
        to: { id: other.id, room_no: other.room_no },
      });
    }

    // กรณี B: visible ↔ visible
    if (vis.is_hidden === 0 && other.is_hidden === 0) {
      if (other.x == null || other.y == null) {
        await conn.rollback();
        return res
          .status(400)
          .json({ message: "both visible rooms must have coordinates" });
      }

      const vPos = { floor: vis.floor, x: vis.x, y: vis.y };
      const oPos = { floor: other.floor, x: other.x, y: other.y };

      // 1) ถอด vis ออกจากกริดชั่วคราว (ป้องกัน unique (floor,x,y) ชน)
      await conn.query(
        `UPDATE cells
           SET x = NULL,
               y = NULL,
               updated_at = NOW()
         WHERE id = ?`,
        [vis.id]
      );

      // 2) ย้าย other ไปพิกัดเดิมของ vis
      await conn.query(
        `UPDATE cells
           SET floor = ?, x = ?, y = ?, updated_at = NOW()
         WHERE id = ?`,
        [vPos.floor, vPos.x, vPos.y, other.id]
      );
      
      // 3) ย้าย vis ไปพิกัดเดิมของ other
      await conn.query(
        `UPDATE cells
           SET floor = ?, x = ?, y = ?, updated_at = NOW()
         WHERE id = ?`,
        [oPos.floor, oPos.x, oPos.y, vis.id]
      );

      await conn.commit();
      return res.json({
        action: "swap-visible",
        from: { id: vis.id, room_no: vis.room_no },
        to: { id: other.id, room_no: other.room_no },
      });
    }

    // ถ้าผู้ใช้ส่งสลับพารามิเตอร์ (visibleId เป็น hidden, hiddenId เป็น visible)
    if (vis.is_hidden === 1 && other.is_hidden === 0) {
      // สลับบทบาทแล้วเรียกตัวเอง (ป้องกันพลาดพารามิเตอร์)
      await conn.rollback();
      req.body = { visibleId: other.id, hiddenId: vis.id };
      return exports.swapWithHidden(req, res);
    }

    await conn.rollback();
    return res.status(400).json({ message: "unsupported swap state" });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {}
    console.error("swapWithHidden error:", err);
    return res.status(500).json({ message: "server error" });
  } finally {
    conn.release();
  }
};
