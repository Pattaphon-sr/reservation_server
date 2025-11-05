const { pool } = require('../config/db.js');

// ===================== ยังไม่ได้ implement =====================

exports.history = async (req, res) => {
    // Logic สำหรับดึงประวัติ (ตาม role ที่อธิบายใน routes)
    res.status(501).json({ message: 'History endpoint not implemented' });
};

exports.listMine = async (req, res) => {
    // Logic สำหรับ User ดึงประวัติการจอง "ของฉัน"
    res.status(501).json({ message: 'ListMine endpoint not implemented' });
};

exports.createReservation = async (req, res) => {
    // Logic สำหรับ User สร้างคำขอจอง
    res.status(501).json({ message: 'CreateReservation endpoint not implemented' });
};

// ===================== ส่วนของ Approver (Implement แล้ว) =====================

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