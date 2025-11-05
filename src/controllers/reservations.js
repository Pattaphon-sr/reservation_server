const { pool } = require('../config/db.js');

exports.history = async () => {
};

exports.listMine = async () => {
};

exports.createReservation = async () => {
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

    if (hasPending) return res.status(409).json({ message: "วันนี้คุณมีคำขอ Pending อยู่แล้ว" });
    if (hasReserved) return res.status(409).json({ message: "วันนี้คุณมีการจอง Reserved แล้ว" });

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

exports.listReservations = async () => {
};

exports.approve = async () => {
};

exports.reject = async () => {
};