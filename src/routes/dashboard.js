const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const { getDashboardSummary } = require('../controllers/dashboard');

const router = Router();

// router.get('/dashboard', auth, getDashboardSummary);
router.get('/dashboard', getDashboardSummary);


module.exports = router;