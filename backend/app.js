import express from 'express';
import pool from './src/config/database.js';
import cookieParser from 'cookie-parser';
import authRouter from './src/routers/auth.js';
import userRouter from './src/routers/userRouter.js';
import authMiddleWare from './src/middleware/auth.js';
import cors from 'cors';


const app = express();
app.use(cors());
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Укажите адрес вашего фронта
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/users', userRouter);



pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});

app.get('/profile', authMiddleWare, (req, res) => {
  res.json({ message: `User ID: ${req.userId}` });
});


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});