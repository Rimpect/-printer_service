const express = require('express');
const pool = require('./src/config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/routers/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);

pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});
app.get('/profile', require('./src/middleware/auth.js'), (req, res) => {
  res.json({ message: `User ID: ${req.userId}` });
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});