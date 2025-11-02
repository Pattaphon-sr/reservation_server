const { pool } = require('../config/db.js');

// helper: label ของ slot
const SLOT_LABEL = { S1: '08:00-10:00', S2: '10:00-12:00', S3: '13:00-15:00', S4: '15:00-17:00' };

// GET /floors/:floor/cells?slotId=S1
exports.getCellsForFloorSlot = async (req, res) => {
};

// PATCH /cells/:id  (แก้ชนิด/สถานะเบส/ชื่อห้องแบบตรง ๆ)
exports.patchCell = async (req, res) => {
};

// POST /cells/:id/hide   (ซ่อนห้อง → แสดงเป็น empty แต่เก็บข้อมูลไว้)
exports.hideCell = async (req, res) => {
};

// POST /cells/add-room  { floor, x, y }
exports.addRoomAt = async (req, res) => {
};

// POST /cells/:id/rename  { newRoomNo }
exports.renameRoom = async (req, res) => {
};
