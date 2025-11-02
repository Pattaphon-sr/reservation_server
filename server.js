require('dotenv').config();
process.env.TZ = process.env.TZ || 'Asia/Bangkok';

const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});