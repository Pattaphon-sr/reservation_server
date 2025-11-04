const { Router } = require('express');
const { auth } = require('../middlewares/auth'); 
const { getDashboardSummary, getDailyReservation } = require('../controllers/dashboard');

const router = Router();

router.get('/dashboard', getDashboardSummary);
router.get('/reservations/daily', getDailyReservation);

// router.get('/dailyRequest', getDailyRequest);

module.exports = router;