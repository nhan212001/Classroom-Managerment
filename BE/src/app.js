const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const userRoutes = require('./routes/userRoutes');
const enrollmentRoutes = require('./routes/enrollmentsRoutes');

const middlewares = require('./middlewares/authMiddlewares');

app.use(cors({
    origin: process.env.FE_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(morgan("combined"));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/lesson', middlewares.checkToken, middlewares.checkInstructor, lessonRoutes);
app.use('/user', middlewares.checkToken, userRoutes);
app.use('/enrollment', middlewares.checkToken, enrollmentRoutes);


module.exports = app;