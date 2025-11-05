const { Router } = require('express');
const { auth } = require('../middlewares/auth.js');
const { allowRoles } = require('../middlewares/roles.js');
const {
  history,
  listMine,
  approve,
  reject,
  createReservation,
  listReservations,
  createReservationRequest
} = require('../controllers/reservations.js');

const router = Router();

// ===================== History ตามบทบาท =====================
// user: เห็นของตัวเอง (requested_by = me)
// approver: เห็นเฉพาะที่ตัวเองเป็นคนพิจารณา (approved_by = me)
// staff: เห็นของ approver ทุกคน (approved_by IS NOT NULL)
router.get('/reservations/history', auth, history);

// user: เห็นของตัวเองทั้งหมด (ไม่ว่าจะอนุมัติหรือไม่)
router.get('/reservations/mine', auth, listMine);
// user สร้างคำขอจอง
router.post('/reservations', auth, createReservation);

router.post('/reservations/request', createReservationRequest);

// approver เห็นคำขอจองทั้งหมด
router.get('/reservations', auth, listReservations);
// approver อนุมัติ/ปฏิเสธ
router.put('/reservations/:id/approve', auth, allowRoles('approver'), approve);
router.put('/reservations/:id/reject', auth, allowRoles('approver'), reject);

module.exports = router;
