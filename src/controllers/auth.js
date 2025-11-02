const { pool } = require("../config/db.js");
const argon2 = require('@node-rs/argon2');
const { signJwt } = require('../utils/jwt.js');

async function hashPassword(req, res) {
   const raw = req.params.raw;
   const hash = argon2.hashSync(raw);
    // console.log(hash.length);
   res.send(hash);
}


async function signup() {
}

async function login() {
}

module.exports = { signup, login, hashPassword };