const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.js');
const cellsRoutes = require('./src/routes/cells.js');
const reservationsRoutes = require('./src/routes/reservations.js');

const dashboardRouter = require('./src/routes/dashboard.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api', cellsRoutes);         // /floors/:floor/cells, /cells/..
app.use('/api', reservationsRoutes);  // /reservations

app.use('/api', dashboardRouter);

module.exports = app;