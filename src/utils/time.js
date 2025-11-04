// src/utils/time.js
const SLOT_WINDOWS = {
  S1: { start: '08:00', end: '10:00' },
  S2: { start: '10:00', end: '12:00' },
  S3: { start: '13:00', end: '15:00' },
  S4: { start: '15:00', end: '17:00' },
};

function ymdInTz(date = new Date()) {
  // คืน YYYY-MM-DD ของโซนเวลาที่ระบุ (ค่าเริ่มต้น: เวลาไทย)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: process.env.TZ || 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(date)
    .reduce((acc, p) => ((acc[p.type] = p.value), acc), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function nowMinutesInTz(tz = 'Asia/Bangkok') {
  // นาทีตั้งแต่ 00:00 ของวันนี้ในโซนเวลาที่ระบุ
  const hhmm = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
  const [hh, mm] = hhmm.split(':').map(Number);
  return hh * 60 + mm;
}

function slotEndMinutes(slotId) {
  const slot = SLOT_WINDOWS[slotId];
  if (!slot) return null;
  const [eh, em] = slot.end.split(':').map(Number);
  return eh * 60 + em;
}

module.exports = {
  SLOT_WINDOWS,
  ymdInTz,
  nowMinutesInTz,
  slotEndMinutes,
};
