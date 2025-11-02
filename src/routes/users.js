const { Router } = require('express');
const { auth } = require('../middlewares/auth.js');
const { getme } = require('../controllers/users.js');

const router = Router();

router.get('/me', auth, getme);

module.exports = router;