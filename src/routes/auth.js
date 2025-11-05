/* const { Router } = require('express');
const { signup, login, hashPassword } = require('../controllers/auth.js');

const router = Router();

router.get('/password/:raw', hashPassword);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router; */

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
// ลบ auth ออกชั่วคราว
router.get('/reservations/history', history); // ลบ auth

// user: เห็นของตัวเองทั้งหมด (ไม่ว่าจะอนุมัติหรือไม่)
router.get('/reservations/mine', listMine); // ลบ auth ถ้าต้องการ

// user สร้างคำขอจอง
router.post('/reservations', createReservation); // ลบ auth ถ้าต้องการ

// approver เห็นคำขอจองทั้งหมด
router.get('/reservations', listReservations); // ลบ auth ถ้าต้องการ

// approver อนุมัติ/ปฏิเสธ
router.put('/reservations/:id/approve', approve); // ลบ auth และ allowRoles ถ้าต้องการ
router.put('/reservations/:id/reject', reject); // ลบ auth และ allowRoles ถ้าต้องการ

module.exports = router;