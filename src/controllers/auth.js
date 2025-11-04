const { pool } = require("../config/db.js");
const argon2 = require('@node-rs/argon2');
const { signJwt } = require('../utils/jwt.js');

/**
 * GET /api/auth/password/:raw
 * (ใช้ test hash)
 */
async function hashPassword(req, res) {
  try {
    const raw = req.params.raw;
    const hash = await argon2.hash(raw);
    res.send(hash);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error hashing password" });
  }
}

/**
 * POST /api/auth/signup
 */
async function signup(req, res) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const conn = await pool.getConnection();
  try {
    // ดึง user ที่มี email หรือ username ซ้ำ
    const [existing] = await conn.query(
      "SELECT email, username FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      const existingUser = existing[0];
      const emailExists = existingUser.email === email;
      const usernameExists = existingUser.username === username;

      let message = "";
      if (emailExists && usernameExists) {
        message = "Email and username already exists";
      } else if (emailExists) {
        message = "Email already exists";
      } else if (usernameExists) {
        message = "Username already exists";
      }

      return res.status(400).json({ message });
    }

    const hashedPassword = await argon2.hash(password);
    await conn.query(
      "INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, 'user')",
      [email, username, hashedPassword]
    );

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  } finally {
    conn.release();
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(400).json({ message: "Missing email/username or password" });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email || null, username || null]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // ✅ สร้าง JWT token
    const token = signJwt(payload);

    res.status(200).json({
      message: "Login successful",
      payload,
      token, // ← เพิ่ม token กลับไปด้วย
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  } finally {
    conn.release();
  }
}

module.exports = { signup, login, hashPassword };
