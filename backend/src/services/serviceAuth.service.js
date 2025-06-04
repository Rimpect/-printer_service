const { query } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class ServiceAuthService {
  static async register(userData) {
    const { login, email } = userData;

    const { loginAvailable, emailAvailable } = await this.checkAvailability({
      login,
      email,
    });

    if (!loginAvailable) {
      throw {
        status: 400,
        message: "Пользователь с таким логином уже существует",
      };
    }

    if (!emailAvailable) {
      throw {
        status: 400,
        message: "Пользователь с таким email уже существует",
      };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const { rows } = await query(
      `INSERT INTO users (
      name, surname, patronymic, login, email, phone,
      role, post, place_of_work, password
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, name, login, role`,
      [
        userData.name,
        userData.surname,
        userData.patronymic,
        userData.login,
        userData.email,
        userData.phone,
        userData.role,
        userData.post,
        userData.placeOfWork,
        hashedPassword,
      ]
    );

    return rows[0];
  }

  static async login(login, password) {
    // 1. Найти пользователя
    const { rows } = await query("SELECT * FROM users WHERE login = $1", [
      login,
    ]);
    if (rows.length === 0) {
      throw new Error("Неверные учетные данные");
    }

    const user = rows[0];

    // 2. Проверить пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Неверные учетные данные");
    }

    // 3. Генерация токенов
    const accessToken = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1m" }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней

    // 4. Сохранение refresh token
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
  static async logout(userId) {
    // Удаляем все refresh токены пользователя из БД
    await query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);
    return { success: true };
  }
  static async checkAvailability({ login, email }) {
    const result = {
      loginAvailable: true,
      emailAvailable: true,
    };

    try {
      if (login) {
        const existingUser = await query(
          "SELECT id FROM users WHERE login = $1",
          [login]
        );
        result.loginAvailable = existingUser.rows.length === 0;
      }

      if (email) {
        const existingUser = await query(
          "SELECT id FROM users WHERE email = $1",
          [email]
        );
        result.emailAvailable = existingUser.rows.length === 0;
      }

      return result;
    } catch (error) {
      console.error("Database check error:", error);
      throw new Error("Ошибка проверки базы данных");
    }
  }
  static async refreshTokens(oldAccessToken) {
    try {
      // Верифицируем старый accessToken
      const decoded = jwt.verify(
        oldAccessToken,
        process.env.JWT_ACCESS_SECRET,
        { ignoreExpiration: true }
      );

      // Находим refreshToken в БД по user_id
      const { rows } = await query(
        "SELECT * FROM refresh_tokens WHERE user_id = $1 ORDER BY expires_at DESC LIMIT 1",
        [decoded.id]
      );

      if (rows.length === 0) {
        throw new Error("Refresh token not found");
      }

      const tokenRecord = rows[0];

      // Проверяем срок действия refreshToken
      if (new Date(tokenRecord.expires_at) < new Date()) {
        throw new Error("Refresh token expired");
      }

      // Генерация новых токенов
      const newAccessToken = jwt.sign(
        { id: decoded.id, login: decoded.login, role: decoded.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      // Возвращаем только новый accessToken
      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      console.error("Refresh token error:", error);
      throw new Error("Failed to refresh tokens");
    }
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
