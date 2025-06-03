const express = require("express");
const router = express.Router();
const ServiceAuthService = require("../services/serviceAuth.service");
const authMiddleware = require("../middleware/authMiddleware");
const { query } = require("../config/database"); // Добавьте эту строку\
// Регистрация
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request body:", req.body);
    const user = await ServiceAuthService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Registration error:", {
      status: error.status,
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(error.status || 500).json({
      error: error.message || "Ошибка регистрации",
    });
  }
});
// Проверка доступности логина/почты
router.get("/check-availability", async (req, res) => {
  try {
    const { login, email } = req.query;

    if (!login && !email) {
      return res.status(400).json({
        error: "Укажите login или email для проверки",
      });
    }

    const availability = await ServiceAuthService.checkAvailability({
      login,
      email,
    });
    res.json(availability);
  } catch (error) {
    console.error("Check availability error:", error);
    res.status(500).json({
      error: error.message || "Ошибка при проверке доступности",
    });
  }
});

// Вход
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: "login and password are required" });
    }

    const result = await ServiceAuthService.login(login, password);
    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
});

// Выход
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const result = await ServiceAuthService.logout(refreshToken);
    res.json(result);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Обновление токенов
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const tokens = await ServiceAuthService.refreshTokens(refreshToken);
    res.json(tokens);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: error.message });
  }
});

// Проверка access токена
router.get("/validate", authMiddleware, async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await ServiceAuthService.validateAccessToken(token);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

// Получение информации о текущем пользователе
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, login, role FROM users WHERE id = $1",
      [req.user.id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error in /me:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});
router.get("/auth/check-availability", async (req, res) => {
  try {
    const { login, email } = req.query;
    const result = await ServiceAuthService.checkAvailability({ login, email });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
