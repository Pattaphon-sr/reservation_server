const { pool } = require('../config/db.js');

exports.getDashboardSummary = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard summary...');

    // 1️⃣ ห้องว่างต่อชั้นและช่วงเวลา
    const [availableByFloorSlot] = await pool.query(`
      SELECT
        c.floor,
        t.id AS slot_id,
        t.label AS slot_label,
        COUNT(DISTINCT c.id) AS total_rooms,
        COUNT(DISTINCT r.cell_id) AS reserved_rooms,
        (COUNT(DISTINCT c.id) - COUNT(DISTINCT r.cell_id)) AS available_rooms
      FROM time_slots t
      CROSS JOIN (
        SELECT id, floor
        FROM cells
        WHERE type = 'room' AND is_hidden = 0 AND base_status = 'free'
      ) c
      LEFT JOIN reservations r
        ON r.cell_id = c.id
        AND r.slot_id = t.id
        AND r.status IN ('pending', 'reserved')
        AND DATE(r.created_at) = CURDATE()
      GROUP BY c.floor, t.id
      ORDER BY c.floor, t.id;
    `);

    console.log('✅ availableByFloorSlot count:', availableByFloorSlot.length);

    // 2️⃣ รวมทุกชั้นและเวลา
    const [overallAvailable] = await pool.query(`
      SELECT
        COUNT(DISTINCT c.id) AS total_rooms,
        COUNT(DISTINCT r.cell_id) AS reserved_rooms,
        (COUNT(DISTINCT c.id) - COUNT(DISTINCT r.cell_id)) AS available_rooms
      FROM time_slots t
      CROSS JOIN (
        SELECT id
        FROM cells
        WHERE type = 'room' AND is_hidden = 0 AND base_status = 'free'
      ) c
      LEFT JOIN reservations r
        ON r.cell_id = c.id
        AND r.slot_id = t.id
        AND r.status IN ('pending', 'reserved')
        AND DATE(r.created_at) = CURDATE();
    `);

    // 3️⃣ สรุปจำนวนห้องตามสถานะ
    const [statusSummaryRows] = await pool.query(`
      SELECT 'free' AS status, COUNT(*) AS count
      FROM cells
      WHERE type = 'room' AND is_hidden = 0 AND base_status = 'free'
      UNION ALL
      SELECT 'disabled', COUNT(*)
      FROM cells
      WHERE type = 'room' AND is_hidden = 0 AND base_status = 'disabled'
      UNION ALL
      SELECT 'pending', COUNT(DISTINCT cell_id)
      FROM reservations
      WHERE status = 'pending' AND DATE(created_at) = CURDATE()
      UNION ALL
      SELECT 'booked', COUNT(DISTINCT cell_id)
      FROM reservations
      WHERE status = 'reserved' AND DATE(created_at) = CURDATE();
    `);

    const statusSummary = statusSummaryRows.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    res.json({
      available_by_floor_slot: availableByFloorSlot,
      overall_available: overallAvailable[0],
      status_summary: statusSummary,
    });

  } catch (err) {
    console.error('❌ Dashboard Error:', err.message, err.stack);
    res.status(500).json({
      message: 'Error generating dashboard',
      error: err.message || err.toString(),
    });
  }
};
