const { query } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class ServiceAuthService {
  static async register(userData) {
    const { login, email } = userData;

    // Проверка доступности логина и email
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

    // Остальная логика регистрации
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

    // 3. Проверить существование пользователя в БД (доп. проверка)
    const userExists = await query("SELECT id FROM users WHERE id = $1", [
      user.id,
    ]);
    if (userExists.rows.length === 0) {
      console.error(
        `Критическая ошибка: пользователь ${user.id} не найден при проверке`
      );
      throw new Error("Ошибка системы аутентификации");
    }

    // 4. Генерация токенов

    const accessToken = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // 5. Сохранение refresh token

    try {
      await query(
        "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)",
        [refreshToken, user.id, expiresAt]
      );
    } catch (err) {
      console.error("Ошибка сохранения refresh токена:", err);
      throw new Error("Ошибка создания сессии");
    }

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
    const userData = await query("SELECT * FROM users  WHERE id = $1", [
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
