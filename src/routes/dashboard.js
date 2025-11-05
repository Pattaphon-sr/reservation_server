const { Router } = require('express');
const { auth } = require('../middlewares/auth'); 
const { getDashboardSummary, getDailyReservation, getDailyRequest } = require('../controllers/dashboard');

const router = Router();

router.get('/dashboard', getDashboardSummary);
router.get('/reservations/daily', getDailyReservation);

router.get('/dailyRequest', getDailyRequest);
// router.get('/reservations/daily', getDailyRequest);

module.exports = router;