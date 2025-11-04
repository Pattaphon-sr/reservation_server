const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/roles');

const router = Router();

const {
  mapByFloorAndSlot,
  updateType,
  updateBaseStatus,
  setHidden,
  updateRoomNo,
  provisionRoom,
  swapWithHidden
} = require('../controllers/cells.js');

// ============== Public/Authenticated (ทุกบทบาท) ==============
router.get('/cells/map', mapByFloorAndSlot);

// ============== Staff/Admin (แก้ผัง) ==============
// router.put('/cells/:id/type', auth, allowRoles('staff'), updateType);
// router.put('/cells/:id/base-status', auth, allowRoles('staff'), updateBaseStatus);
// router.put('/cells/:id/hide', auth, allowRoles('staff'), setHidden);
// router.put('/cells/:id/room', auth, allowRoles('staff'), updateRoomNo);
// router.post('/cells/provision-room',  auth, allowRoles('staff'), provisionRoom);
// router.post('/cells/swap-with-hidden', auth, allowRoles('staff'), swapWithHidden);

router.put('/cells/:id/type', updateType);
router.put('/cells/:id/base-status', updateBaseStatus);
router.put('/cells/:id/hide', setHidden);
router.put('/cells/:id/room', updateRoomNo);
router.post('/cells/provision-room', provisionRoom);
router.post('/cells/swap-with-hidden', swapWithHidden);

module.exports = router;
