import express from 'express';
import pool from './src/config/database.js';
import cookieParser from 'cookie-parser';
import authRouter from './src/routers/auth.js';
import dataBaseRouter from './src/routers/dataBaseRouter.js';
import authMiddleWare from './src/middleware/auth.js';



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/database', dataBaseRouter)
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