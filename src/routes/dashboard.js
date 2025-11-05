const { Router } = require('express');
const { auth } = require('../middlewares/auth'); 
const { getDashboardSummary, getDailyReservation, getDailyRequest } = require('../controllers/dashboard');

const router = Router();

router.get('/dashboard', auth, getDashboardSummary);
router.get('/reservations/daily', auth, getDailyReservation);
router.get('/dailyRequest', auth, getDailyRequest);

module.exports = router;