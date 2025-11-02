const { Router } = require('express');
const { signup, login, hashPassword } = require('../controllers/auth.js');

const router = Router();

router.get('/password/:raw', hashPassword);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;