const { pool } = require('../config/db');

exports.history = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id,
        r.status,
        r.note,
        r.created_at,
        r.updated_at,
        CONCAT('Floor ', c.floor) as floor,
        c.room_no as room_code,
        ts.label as slot,
        u.username as requested_by,
        approver.username as approved_by
      FROM reservations r
      JOIN cells c ON r.cell_id = c.id
      JOIN time_slots ts ON r.slot_id = ts.id
      JOIN users u ON r.requested_by = u.id
      LEFT JOIN users approver ON r.approver_id = approver.id
      ORDER BY r.created_at DESC
    `;

    const [rows] = await pool.query(query);

    const formattedRows = rows.map(row => ({
      status: row.status,
      floor: row.floor,
      room_code: row.room_code,
      slot: row.slot,
      date_time: row.created_at,
      requested_by: row.requested_by,
      approved_by: row.approved_by,
      note: row.note,
    }));

    console.log('History data:', formattedRows);
    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createReservationRequest = async (req, res) => {
  const { cell_id, slot_id, requested_by } = req.body;

  if (!cell_id || !slot_id || !requested_by) {
    return res.status(400).json({ message: "missing body" });
  }

  try {
    const sqlDate = "DATE(created_at) = CURDATE()";

    // ====== check cell validation ======
    const [cellCheck] = await pool.query(
      `SELECT type, is_hidden FROM cells WHERE id=? LIMIT 1`,
      [cell_id]
    );

    if (cellCheck.length === 0) {
      return res.status(404).json({ message: "cell_id นี้ไม่มีอยู่ในระบบ" });
    }

    if (cellCheck[0].type === 'empty') {
      return res.status(409).json({ message: "ตำแหน่งนี้ไม่ใช่ห้อง จองไม่ได้" });
    }

    if (cellCheck[0].is_hidden == 1) {
      return res.status(409).json({ message: "ห้องนี้ถูกซ่อนอยู่ ไม่สามารถจองได้" });
    }

    // ====== ห้องนี้เวลานี้มีคนจองไปรึยัง (pending / reserved) ======
    const [roomUsed] = await pool.query(
      `SELECT id, requested_by, status FROM reservations
       WHERE cell_id=? AND slot_id=?
       AND status IN ('pending','reserved')
       AND ${sqlDate}
       LIMIT 1`,
      [cell_id, slot_id]
    );

    if (roomUsed.length > 0) {
      if (roomUsed[0].requested_by != requested_by) {
        return res.status(409).json({ message: "ห้องนี้เวลานี้มีคนจองไปแล้ว" });
      }
    }

    // ====== user วันนี้เคยจองอะไรไปแล้วมั้ย ======
    const [userToday] = await pool.query(
      `SELECT status FROM reservations
       WHERE requested_by=? AND ${sqlDate}`,
      [requested_by]
    );

    const hasPending = userToday.some(r => r.status === 'pending');
    const hasReserved = userToday.some(r => r.status === 'reserved');

    if (hasPending) return res.status(409).json({ message: "You already have a pending request today." });
    if (hasReserved) return res.status(409).json({ message: "You already have a reservation today." });

    // ====== insert request ======
    await pool.query(
      `INSERT INTO reservations (cell_id, slot_id, requested_by)
       VALUES (?,?,?)`,
      [cell_id, slot_id, requested_by]
    );

    return res.json({ message: "ส่งคำขอสำเร็จ" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};

// ===================== Approver =====================

/**
 * (Approver Only)
 * GET /reservations
 * ดึงรายการคำขอจองที่ "รออนุมัติ" (pending) ทั้งหมด
 * (อิงตาม UI ที่คุณส่งมา ว่าหน้านี้ต้องแสดงรายการที่รอการตัดสินใจ)
 */
exports.listReservations = async (req, res) => {
    // Middleware `allowRoles('approver')` ควรถูกเพิ่มใน routes
    // แต่ถ้า route นี้ใช้สำหรับหลาย role เราอาจต้องเช็ค role ที่นี่
    // *** แต่จากไฟล์ routes ของคุณ path นี้ไม่ได้ป้องกัน role... 
    // *** ผมจะเขียนโดยยึดตาม UI ว่าจะดึง 'pending'
    
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT
                r.id AS reservation_id,
                r.created_at,
                c.floor,
                c.room_no,
                ts.label AS slot,
                u.username AS requested_by_username
            FROM reservations AS r
            JOIN cells AS c ON r.cell_id = c.id
            JOIN time_slots AS ts ON r.slot_id = ts.id
            JOIN users AS u ON r.requested_by = u.id
            WHERE r.status = 'pending'
            ORDER BY r.created_at ASC`
        );
        
        res.status(200).json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching pending reservations" });
    } finally {
        conn.release();
    }
};

/**
 * (Approver Only)
 * PUT /reservations/:id/approve
 * อนุมัติคำขอจอง
 */
exports.approve = async (req, res) => {
    const { id: reservation_id } = req.params;
    const { id: approver_id } = req.user; // ได้มาจาก auth middleware

    if (!reservation_id) {
        return res.status(400).json({ message: "Reservation ID is required" });
    }

    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `UPDATE reservations
             SET status = 'reserved', approver_id = ?
             WHERE id = ? AND status = 'pending'`,
            [approver_id, reservation_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reservation not found or already processed" });
        }

        res.status(200).json({ message: "Reservation approved successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error approving reservation" });
    } finally {
        conn.release();
    }
};

/**
 * (Approver Only)
 * PUT /reservations/:id/reject
 * ปฏิเสธคำขอจอง
 */
exports.reject = async (req, res) => {
    const { id: reservation_id } = req.params;
    const { id: approver_id } = req.user; // ได้มาจาก auth middleware
    const { note } = req.body; // Frontend อาจจะส่งเหตุผลมาใน body

    if (!reservation_id) {
        return res.status(400).json({ message: "Reservation ID is required" });
    }

    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `UPDATE reservations
             SET status = 'rejected', approver_id = ?, note = ?
             WHERE id = ? AND status = 'pending'`,
            [approver_id, note || null, reservation_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reservation not found or already processed" });
        }

        res.status(200).json({ message: "Reservation rejected successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error rejecting reservation" });
    } finally {
        conn.release();
    }
};