const { verifyJwt } = require('../utils/jwt');
const { pool } = require('../config/db.js');

async function auth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = verifyJwt(token);
    // fetch role เผื่อมีการเปลี่ยนบทบาท
    const [rows] = await pool.query(
      `SELECT id, username, email, role FROM users WHERE id=?`,
      [payload.sub]
    );
    if (!rows.length) return res.status(401).json({ message: 'Unauthorized' });

    req.user = rows[0];
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { auth };
