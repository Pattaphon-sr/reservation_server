const { Router } = require('express');
const { auth } = require('../middlewares/auth.js');
const { allowRoles } = require('../middlewares/roles.js');
const {
  history,
  approve,
  reject,
  listReservations,
  createReservationRequest
} = require('../controllers/reservations.js');

const router = Router();

// ===================== History ตามบทบาท =====================
// user: เห็นของตัวเอง (requested_by = me)
// approver: เห็นเฉพาะที่ตัวเองเป็นคนพิจารณา (approved_by = me)
// staff: เห็นของ approver ทุกคน (approved_by IS NOT NULL)

//router.get('/reservations/history/user', auth, allowRoles('user'), history);
router.get('/reservations/history/staff', auth, allowRoles('staff'), history);
// router.get('/reservations/history/approver', auth, allowRoles('approver'), history);

router.get('/reservations/history', history);


// user สร้างคำขอจอง
router.post('/reservations/request', auth, createReservationRequest);

// approver เห็นคำขอจองทั้งหมด
router.get('/reservations', auth, allowRoles('approver', 'staff'), listReservations);
// approver อนุมัติ/ปฏิเสธ
router.put('/reservations/:id/approve', auth, allowRoles('approver'), approve);
router.put('/reservations/:id/reject', auth, allowRoles('approver'), reject);

module.exports = router;
