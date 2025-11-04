const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z' // ให้ส่ง/รับเป็น UTC แล้วเราจะ set session +07:00 ด้านล่าง
});

// ตั้งค่า session time_zone เป็น Thailand ทุกครั้งที่มี connection ใหม่
pool.on('connection', async (conn) => {
  try {
    await conn.promise().query(`SET time_zone = '+07:00'`);
  } catch (e) {
    console.error('Cannot set session time_zone:', e.message);
  }
});


module.exports = { pool };