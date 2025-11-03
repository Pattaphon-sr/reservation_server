const { pool } = require('../config/db.js');

exports.getDashboardSummary = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard summary...');

    const now = new Date();
    const currentHour = now.getHours();

    // 1️⃣ รวมจำนวนห้องว่างของแต่ละเวลาและแต่ละชั้น
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
        WHERE type = 'room'
          AND is_hidden = 0
          AND base_status = 'free'
      ) c
      LEFT JOIN reservations r
        ON r.cell_id = c.id
        AND r.slot_id = t.id
        AND r.status IN ('pending', 'reserved')
        AND DATE(r.created_at) = CURDATE()
      GROUP BY c.floor, t.id
      ORDER BY c.floor, t.id;
    `);

    // 🕓 ฟังก์ชันช่วยตีความช่วงเวลา
    const parseTimeRange = (label) => {
      const match = label.match(/(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);
      if (!match) return null;
      const startHour = parseInt(match[1]);
      const endHour = parseInt(match[2]);
      return [startHour, endHour];
    };

    // 🕔 ปรับช่วงเวลาที่ผ่านไปแล้ว = ไม่ว่าง
    const adjustedAvailability = availableByFloorSlot.map((item) => {
      const range = parseTimeRange(item.slot_label);
      if (!range) return item;
      const [, endHour] = range;
      if (currentHour >= endHour) {
        return { ...item, available_rooms: 0 };
      }
      return item;
    });

    // 2️⃣ รวมจำนวนห้องทั้งหมดทุกชั้นและทุกเวลา (เฉพาะห้อง free)
    const [overallFreeRooms] = await pool.query(`
      SELECT 
        COUNT(DISTINCT c.id) AS total_free_rooms
      FROM cells c
      WHERE 
        c.type = 'room'
        AND c.is_hidden = 0
        AND c.base_status = 'free'
        AND c.id NOT IN (
          SELECT r.cell_id
          FROM reservations r
          WHERE r.status IN ('pending', 'reserved')
            AND DATE(r.created_at) = CURDATE()
        );
    `);

    // 3️⃣ รวมจำนวนห้องของแต่ละ status (free, disabled, pending, booked)
    const [floorSummary] = await pool.query(`
      SELECT 
        c.floor,
        SUM(CASE 
              WHEN c.base_status = 'free'
                AND c.id NOT IN (
                  SELECT r.cell_id 
                  FROM reservations r 
                  WHERE r.status IN ('pending','reserved')
                    AND DATE(r.created_at) = CURDATE()
                )
              THEN 1 ELSE 0 END) AS free,
        SUM(CASE 
              WHEN c.base_status = 'disabled'
              THEN 1 ELSE 0 END) AS disabled,
        SUM(CASE 
              WHEN c.id IN (
                SELECT r.cell_id 
                FROM reservations r 
                WHERE r.status = 'pending'
                  AND DATE(r.created_at) = CURDATE()
              )
              THEN 1 ELSE 0 END) AS pending,
        SUM(CASE 
              WHEN c.id IN (
                SELECT r.cell_id 
                FROM reservations r 
                WHERE r.status = 'reserved'
                  AND DATE(r.created_at) = CURDATE()
              )
              THEN 1 ELSE 0 END) AS booked
      FROM cells c
      WHERE 
        c.type = 'room'
        AND c.is_hidden = 0
      GROUP BY c.floor
      ORDER BY c.floor;
    `);

    // รวมสรุปรวมทั้งหมด (รวมทุกชั้น)
    const [overallSummary] = await pool.query(`
      SELECT 
        SUM(CASE 
              WHEN c.base_status = 'free'
                AND c.id NOT IN (
                  SELECT r.cell_id 
                  FROM reservations r 
                  WHERE r.status IN ('pending','reserved')
                    AND DATE(r.created_at) = CURDATE()
                )
              THEN 1 ELSE 0 END) AS free,
        SUM(CASE 
              WHEN c.base_status = 'disabled'
              THEN 1 ELSE 0 END) AS disabled,
        SUM(CASE 
              WHEN c.id IN (
                SELECT r.cell_id 
                FROM reservations r 
                WHERE r.status = 'pending'
                  AND DATE(r.created_at) = CURDATE()
              )
              THEN 1 ELSE 0 END) AS pending,
        SUM(CASE 
              WHEN c.id IN (
                SELECT r.cell_id 
                FROM reservations r 
                WHERE r.status = 'reserved'
                  AND DATE(r.created_at) = CURDATE()
              )
              THEN 1 ELSE 0 END) AS booked
      FROM cells c
      WHERE 
        c.type = 'room'
        AND c.is_hidden = 0;
    `);

    // ✅ ส่งข้อมูลทั้งหมดไปให้ frontend
    res.json({
      available_by_floor_slot: adjustedAvailability,
      overall_free_rooms: overallFreeRooms[0].total_free_rooms,
      floor_summary: floorSummary,
      overall_summary: overallSummary[0],
      current_hour: currentHour,
    });

  } catch (err) {
    console.error('❌ Dashboard Error:', err.message, err.stack);
    res.status(500).json({
      message: 'Error generating dashboard',
      error: err.message || err.toString(),
    });
  }
};
