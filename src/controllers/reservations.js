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

exports.listMine = async () => {};
exports.createReservation = async () => {};
exports.listReservations = async () => {};
exports.approve = async () => {};
exports.reject = async () => {};