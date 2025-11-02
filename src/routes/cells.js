const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/roles');

const router = Router();

const {
  getCellsForFloorSlot,
  patchCell,
  hideCell,
  addRoomAt,
  renameRoom
} = require('../controllers/cells.js');

// Overlay slice สำหรับ Map (user, staff ใช้เหมือนกัน)
router.get('/floors/:floor/cells', auth, getCellsForFloorSlot);

// Staff only
router.patch('/cells/:id', auth, allowRoles('staff'), patchCell);
router.post('/cells/:id/hide', auth, allowRoles('staff'), hideCell);
router.post('/cells/add-room', auth, allowRoles('staff'), addRoomAt);
router.post('/cells/:id/rename', auth, allowRoles('staff'), renameRoom);

module.exports = router;
