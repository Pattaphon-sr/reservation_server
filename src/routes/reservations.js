const { Router } = require('express');
// const { auth } = require('../middlewares/auth.js');
// const { allowRoles } = require('../middlewares/roles.js');

const {
  history,
  listMine,
  approve,
  reject,
  createReservation,
  listReservations,
} = require('../controllers/reservations.js');

const router = Router();

// ===================== History ตามบทบาท =====================
// user: เห็นของตัวเอง (requested_by = me)
// approver: เห็นเฉพาะที่ตัวเองเป็นคนพิจารณา (approved_by = me) // filter จาก  user
// staff: เห็นของ approver ทุกคน (approved_by IS NOT NULL)
router.get('/reservations/history',history);

// user: เห็นของตัวเองทั้งหมด (ไม่ว่าจะอนุมัติหรือไม่)
router.get('/reservations/mine',listMine);
// user สร้างคำขอจอง
router.post('/reservations', createReservation);

// approver เห็นคำขอจองทั้งหมด
router.get('/reservations',listReservations);
// approver อนุมัติ/ปฏิเสธ
router.put('/reservations/:id/approve', approve);
router.put('/reservations/:id/reject',reject);

module.exports = router;
