const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reservation_db', // ลบ .sql ออก
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ทดสอบการเชื่อมต่อ
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('Check your .env file:');
    console.error(`  DB_HOST: ${process.env.DB_HOST}`);
    console.error(`  DB_USER: ${process.env.DB_USER}`);
    console.error(`  DB_NAME: ${process.env.DB_NAME}`);
    console.error(`  DB_PORT: ${process.env.DB_PORT}`);
  });

module.exports = { pool };