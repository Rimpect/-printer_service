// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/database');
// require('dotenv').config();

// module.exports = {
//   login: async (req, res) => {
//     try {
//       const { username, password } = req.body;
//       const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//       if (!user.rows.length) return res.status(401).json({ error: 'User not found' });

//       const isValid = await bcrypt.compare(password, user.rows[0].password);
//       if (!isValid) return res.status(401).json({ error: 'Invalid password' });

//       // Генерация токенов
//       const accessToken = jwt.sign({ userId: user.rows[0].id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
//       const refreshToken = jwt.sign({ userId: user.rows[0].id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

//       res.json({ accessToken, refreshToken });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   refreshToken: async (req, res) => {
//     try {
//       const { refreshToken } = req.body;
//       if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

//       const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
//       const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_SECRET, { expiresIn: '15m' });

//       res.json({ accessToken: newAccessToken });
//     } catch (err) {
//       res.status(401).json({ error: 'Invalid refresh token' });
//     }
//   }
// };