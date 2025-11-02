const { Router } = require('express');
const { auth } = require('../middlewares/auth.js');
const { allowRoles } = require('../middlewares/roles.js');
const {
  createReservation,
  listReservations,
  updateReservationStatus
} = require('../controllers/reservations.js');

const router = Router();

// user สร้างคำขอจอง
router.post('/reservations', auth, createReservation);

// view
router.get('/reservations', auth, listReservations);

// approver อนุมัติ/ปฏิเสธ
router.patch('/reservations/:id/status', auth, allowRoles('approver'), updateReservationStatus);

module.exports = router;
