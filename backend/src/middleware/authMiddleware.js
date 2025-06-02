const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Верификация access токена
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Проверяем, что пользователь существует
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ error: 'Please authenticate' });
  }
};