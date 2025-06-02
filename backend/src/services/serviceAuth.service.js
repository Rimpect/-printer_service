const { query } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class ServiceAuthService {
  static async register(login, password, name, role = "user") {
    // Проверяем уникальность логина
    const existingUser = await query(
      "SELECT * FROM users1111 WHERE login = $1",
      [login]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("User with this login already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await query(
      "INSERT INTO users1111 (login, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, login, name, role",
      [login, hashedPassword, name, role]
    );

    return rows[0];
  }

  static async login(login, password) {
    console.log("Trying to login with:", login); // Добавьте это
    const { rows } = await query("SELECT * FROM users1111 WHERE login = $1", [
      login,
    ]);
    console.log("Found users:", rows); // И это
    if (rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = rows[0];
    console.log('Input password:', password);
console.log('Stored hash:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Генерация токена с логином
    const accessToken = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await query(
      "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)",
      [refreshToken, user.id, expiresAt]
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async logout(refreshToken) {
    // Удаляем refresh токен из БД
    await query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken]);
    return { success: true };
  }

  static async refreshTokens(refreshToken) {
    // Проверяем refresh токен в БД
    const tokenData = await query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
      [refreshToken]
    );

    if (tokenData.rows.length === 0) {
      throw new Error("Invalid refresh token");
    }

    const tokenRecord = tokenData.rows[0];

    // Получаем данные пользователя
    const userData = await query("SELECT * FROM users1111 WHERE id = $1", [
      tokenRecord.user_id,
    ]);
    if (userData.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = userData.rows[0];

    // Генерация нового access токена
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // Генерация нового refresh токена (ротация токенов)
    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 дней

    // Обновляем refresh токен в БД
    await query(
      "UPDATE refresh_tokens SET token = $1, expires_at = $2, updated_at = NOW() WHERE id = $3",
      [newRefreshToken, expiresAt, tokenRecord.id]
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }
}

module.exports = ServiceAuthService;
