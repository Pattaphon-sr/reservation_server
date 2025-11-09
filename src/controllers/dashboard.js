const { pool } = require('../config/db');

exports.getDashboardSummary = async (req, res) => {
  try {
    console.log('Fetching dashboard summary...');

    // ------------------- ตั้ง timezone -------------------
    await pool.query("SET time_zone = '+07:00'");

    // เวลาปัจจุบัน
    const now = new Date();
    const [dbTimeResult] = await pool.query(
      ` SELECT 
          TIME_TO_SEC(CURRENT_TIME()) AS total_seconds_in_day, 
          HOUR(CURRENT_TIME()) AS current_hour
      `
    );

    const currentTotalMinutes = Math.floor(
      dbTimeResult[0].total_seconds_in_day / 60
    );
    const currentHour = dbTimeResult[0].current_hour;

    const START_HOUR_MINUTES = 8 * 60; // 08:00
    const END_HOUR_MINUTES = 17 * 60; // 17:00
    const isOutOfOperatingHours =
      currentTotalMinutes < START_HOUR_MINUTES ||
      currentTotalMinutes >= END_HOUR_MINUTES;

    // ------------------- 1 ห้องว่าง/จอง/รอ/ปิด แยกตามชั้นและ slot (ปรับปรุงใหม่) -------------------
    const [availableByFloorSlot] = await pool.query(
      ` SELECT 
          c.floor,
          t.id AS slot_id,
          t.label AS slot_label,

          SUM(CASE 
              WHEN c.base_status = 'free' AND r.id IS NULL THEN 1 
              ELSE 0 
          END) AS available_rooms,
          
          SUM(CASE 
              WHEN r.status = 'pending' THEN 1 
              ELSE 0 
          END) AS pending_rooms,
          
          SUM(CASE 
              WHEN r.status = 'reserved' THEN 1 
              ELSE 0 
          END) AS booked_rooms,
          
          SUM(CASE 
              WHEN c.base_status = 'disabled' THEN 1 
              ELSE 0 
          END) AS disabled_rooms,
              
          SUM(CASE WHEN c.base_status = 'free' THEN 1 ELSE 0 END) AS total_operable_rooms

        FROM cells c
        CROSS JOIN time_slots t
        LEFT JOIN reservations r
          ON r.cell_id = c.id
          AND r.slot_id = t.id
          AND r.status IN ('pending', 'reserved')
          AND DATE(r.created_at) = CURDATE() 
        WHERE 
          c.type = 'room' 
          AND c.is_hidden = 0
        GROUP BY 
          c.floor, t.id
        ORDER BY 
          t.id, c.floor;
      `
    );

    const adjustedAvailability = availableByFloorSlot.map((item) => {
      if (isOutOfOperatingHours) {
        return {
          ...item,
          available_rooms: 0,
        };
      }

      const [startH, startM, endH, endM] = item.slot_label
        .match(/\d+/g)
        .map(Number);
      const slotEndMinutes = endH * 60 + endM;

      return {
        ...item,
        available_rooms:
          currentTotalMinutes >= slotEndMinutes ? 0 : item.available_rooms,
      };
    });

    // ------------------- 2 & 3 สรุปสถานะรายวัน (Optimized) -------------------
    const summaryCTE = `
      WITH TodaysReservations AS (
        SELECT
          cell_id,
          -- ถ้ามี 'reserved' แม้แต่ 1 slot ในวันนี้ = 1, ถ้าไม่ = 0
          MAX(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) AS has_reserved,
          -- ถ้ามี 'pending' แม้แต่ 1 slot ในวันนี้ = 1, ถ้าไม่ = 0
          MAX(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS has_pending
        FROM reservations
        WHERE DATE(created_at) = CURDATE()
          AND status IN ('pending', 'reserved')
        GROUP BY cell_id
      )
    `;

    // 3. รวมจำนวนห้องของแต่ละ status (free, disabled, pending, booked) (Optimized)
    const [floorSummary] = await pool.query(
      ` ${summaryCTE}
        SELECT 
          c.floor,
          SUM(CASE 
              WHEN c.base_status = 'disabled' THEN 1 
              ELSE 0 
          END) AS disabled,
          SUM(CASE 
              WHEN c.base_status = 'free' AND tr.has_reserved = 1 THEN 1 
              ELSE 0 
          END) AS booked,
          SUM(CASE 
              WHEN c.base_status = 'free' AND (tr.has_reserved = 0 OR tr.has_reserved IS NULL) AND tr.has_pending = 1 THEN 1 
              ELSE 0 
          END) AS pending,
          SUM(CASE 
              WHEN c.base_status = 'free' AND (tr.cell_id IS NULL OR (tr.has_reserved = 0 AND tr.has_pending = 0)) THEN 1 
              ELSE 0 
          END) AS free
        FROM cells c
        LEFT JOIN TodaysReservations tr ON c.id = tr.cell_id
        WHERE 
          c.type = 'room' 
          AND c.is_hidden = 0
        GROUP BY c.floor
        ORDER BY c.floor;
      `
    );

    // 4. รวมสรุปรวมทั้งหมด (รวมทุกชั้น) (Optimized)
    const [overallSummary] = await pool.query(
      ` ${summaryCTE}
        SELECT 
          SUM(CASE 
              WHEN c.base_status = 'disabled' THEN 1 
              ELSE 0 
          END) AS disabled,
          SUM(CASE 
              WHEN c.base_status = 'free' AND tr.has_reserved = 1 THEN 1 
              ELSE 0 
          END) AS booked,
          SUM(CASE 
              WHEN c.base_status = 'free' AND (tr.has_reserved = 0 OR tr.has_reserved IS NULL) AND tr.has_pending = 1 THEN 1 
              ELSE 0 
          END) AS pending,
          SUM(CASE 
              WHEN c.base_status = 'free' AND (tr.cell_id IS NULL OR (tr.has_reserved = 0 AND tr.has_pending = 0)) THEN 1 
              ELSE 0 
          END) AS free
        FROM cells c
        LEFT JOIN TodaysReservations tr ON c.id = tr.cell_id
        WHERE 
          c.type = 'room' 
          AND c.is_hidden = 0;
      `
    );

    res.json({
      available_by_floor_slot: adjustedAvailability,
      overall_free_rooms: overallSummary[0].free,
      floor_summary: floorSummary,
      overall_summary: overallSummary[0],
      current_hour: currentHour,
    });
  } catch (err) {
    console.error('Dashboard Error:', err.message, err.stack);
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
        -- // ! BUG FIX: แก้ 'Pending' (ตัวใหญ่) เป็น 'pending' (ตัวเล็ก) ให้ตรงกับ Enum
        AND r.status = 'pending' 
    `;

    const params = [];

    if (userId) {
      baseQuery += ` AND r.requested_by = ?`;
      params.push(userId);
    }

    baseQuery += ` ORDER BY r.created_at DESC;`;

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

exports.getDailyRequest = async (req, res) => {
  try {
    const baseQuery = `
      SELECT 
        r.id,
        c.floor,
        c.room_no AS room_name,
        t.label AS slot_label,
        r.status,
        u.username AS requested_by,
        DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
        DATE_FORMAT(r.created_at, '%d %b %Y %H:%i') AS full_datetime
      FROM reservations r
      JOIN cells c ON r.cell_id = c.id
      JOIN time_slots t ON r.slot_id = t.id
      JOIN users u ON r.requested_by = u.id
      WHERE DATE(r.created_at) = CURDATE()
        AND r.status = 'pending'
      ORDER BY r.created_at DESC;
    `;

    const [rows] = await pool.query(baseQuery);

    return res.json({
      message: 'success',
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching daily requests:', error);
    return res.status(500).json({
      message: 'Error fetching daily requests',
      error: error.message,
    });
  }
};