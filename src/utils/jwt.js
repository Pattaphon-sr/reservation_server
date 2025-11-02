const jwt = require('jsonwebtoken');

const signJwt = (payload, opts = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
    ...opts,
  });

const verifyJwt = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signJwt, verifyJwt };