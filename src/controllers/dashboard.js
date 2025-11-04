const { pool } = require('../config/db');

exports.getDashboardSummary = async (req, res) => {
  try {
    console.log('Fetching dashboard summary...');

    // ------------------- ตั้ง timezone -------------------
    await pool.query("SET time_zone = '+07:00'");

    // เวลาปัจจุบัน
    const now = new Date();
    const [dbTimeResult] = await pool.query(`
      SELECT 
        TIME_TO_SEC(CURRENT_TIME()) AS total_seconds_in_day, 
        HOUR(CURRENT_TIME()) AS current_hour
    `);

    const currentTotalMinutes = Math.floor(dbTimeResult[0].total_seconds_in_day / 60);
    const currentHour = dbTimeResult[0].current_hour;

    const START_HOUR_MINUTES = 8 * 60;  // 08:00
    const END_HOUR_MINUTES = 17 * 60;   // 17:00
    const isOutOfOperatingHours =
      currentTotalMinutes < START_HOUR_MINUTES || currentTotalMinutes >= END_HOUR_MINUTES;

    // ------------------- 1️⃣ ห้องว่างแต่ละชั้น/slot -------------------
    const [availableByFloorSlot] = await pool.query(`
      SELECT 
        c.floor,
        t.id AS slot_id,
        t.label AS slot_label,
        COUNT(DISTINCT c.id) AS total_rooms,
        COUNT(DISTINCT r.id) AS reserved_rooms,
        (COUNT(DISTINCT c.id) - COUNT(DISTINCT r.id)) AS available_rooms
      FROM cells c
      CROSS JOIN time_slots t
      LEFT JOIN reservations r
        ON r.cell_id = c.id
        AND r.slot_id = t.id
        AND r.status IN ('pending','reserved')
      WHERE c.type='room' AND c.is_hidden=0 AND c.base_status='free'
      GROUP BY c.floor, t.id
      ORDER BY t.id, c.floor
    `);

    // ตัด slot ที่หมดเวลา หรืออยู่นอกเวลาทำการ
    const adjustedAvailability = availableByFloorSlot.map(item => {
      // 1️⃣ อยู่นอกช่วงเวลาทำการทั้งหมด
      if (isOutOfOperatingHours) {
        return {
          ...item,
          available_rooms: 0 // เซ็ตเป็น 0 ทุก Slot
        };
      }

      // 2️⃣ อยู่ในช่วงเวลาทำการ ให้ตัด Slot ที่หมดเวลาแล้ว
      const [startH, startM, endH, endM] = item.slot_label.match(/\d+/g).map(Number);
      const slotEndMinutes = endH * 60 + endM;

      return {
        ...item,
        available_rooms: currentTotalMinutes >= slotEndMinutes
          ? 0 // หมดเวลาแล้ว
          : item.available_rooms // ยังไม่หมดเวลา
      };
    });

    // ------------------- 2️⃣ จำนวนห้อง free วันนี้ -------------------
    const [overallFreeRooms] = await pool.query(`
      SELECT COUNT(*) AS total_free_rooms
      FROM cells c
      WHERE c.type='room' AND c.is_hidden=0 AND c.base_status='free'
        AND c.id NOT IN (
          SELECT DISTINCT cell_id
          FROM reservations
          WHERE status IN ('pending','reserved')
        )
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

    // ------------------- ส่งข้อมูล JSON -------------------
    res.json({
      available_by_floor_slot: adjustedAvailability,
      overall_free_rooms: overallFreeRooms[0].total_free_rooms,
      floor_summary: floorSummary,
      overall_summary: overallSummary[0],
      current_hour: currentHour
    });

  } catch (err) {
    console.error('❌ Dashboard Error:', err.message, err.stack);
    res.status(500).json({
      message: 'Error generating dashboard',
      error: err.message || err.toString(),
    });
  }
};


exports.getDailyReservation = async (req, res) => {
  try {
    const { userId } = req.query;

    let baseQuery = `
      SELECT 
        r.id,
        c.floor,
        c.room_no AS room_name,
        t.label AS slot_label,
        r.status,
        DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
        DATE_FORMAT(r.created_at, '%d %b %Y %H:%i') AS full_datetime
      FROM reservations r
      JOIN cells c ON r.cell_id = c.id
      JOIN time_slots t ON r.slot_id = t.id
      WHERE DATE(r.created_at) = CURDATE()
        AND r.status = 'Pending'
    `;

    const params = [];

    if (userId) {
      baseQuery += ` AND r.requested_by = ?`;
      params.push(userId);
    }

    baseQuery += ` ORDER BY r.created_at DESC`;

    const [rows] = await pool.query(baseQuery, params);

    return res.json({
      message: 'success',
      total: rows.length,
      data: rows,
    });

  } catch (error) {
    console.error('Error fetching daily reservation:', error);
    return res.status(500).json({
      message: 'Error fetching daily reservation',
      error: error.message,
    });
  }
};






// exports.getDailyRequest = async (req, res) => {

// };