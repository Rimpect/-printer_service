const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  generateAccessToken: (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: '10m' });
  },
  generateRefreshToken: (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
  },
  verifyAccessToken: (token) => {
    return jwt.verify(token, process.env.ACCESS_SECRET);
  },
  verifyRefreshToken: (token) => {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  }
};