import express from 'express';
import pool from '../config/database.js';
import router from './auth.js';

const app = express();
app.use(express.json());

// Роут для получения данных
app.get('/src/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows); // Отправка данных в JSON формате
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
export default router;