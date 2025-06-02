import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: '10m' });
};

// Генерация refresh токена (7 дней жизни)
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};

// Верификация access токена
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_SECRET);
};

// Верификация refresh токена
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_SECRET);
};

// Или можно экспортировать все функции как объект
export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};