const express = require("express");
const router = express.Router();
const ServiceRequestService = require("../services/serviceRequest.service");
const authMiddleware = require("../middleware/authMiddleware");

// Получение заявок пользователя
router.get("/", async (req, res) => {
  try {
    const requests = await ServiceRequestService.getRequests(
      (printerId = null),
      (problemDescription = null)
    );
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});
router.get("/my", authMiddleware, async (req, res) => {
  try {
    console.log("Authenticated user ID:", req.user.id); // Логируем ID пользователя

    const requests = await ServiceRequestService.getUserRequests(req.user.id);
    res.json(requests);
  } catch (error) {
    console.error("Error in /my endpoint:", error);
    res.status(500).json({
      error: "Failed to fetch user requests",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});
// Создание новой заявки
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Полученные данные:", req.body);

    const { printer_id, problem_description } = req.body;
    const user_id = req.user.id; // ID из аутентификации

    if (!printer_id || !problem_description) {
      return res
        .status(400)
        .json({ error: "Необходимо указать принтер и описание проблемы" });
    }

    const request = await ServiceRequestService.create(
      Number(printer_id),
      problem_description,
      Number(user_id)
    );

    res.status(201).json(request);
  } catch (error) {
    console.error("Ошибка создания заявки:", error);
    res.status(500).json({
      error: "Ошибка сервера",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});
// Закрытие заявки
router.put("/:id/close", async (req, res) => {
  try {
    const request = await ServiceRequestService.closeRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to close request" });
  }
});
// backend/src/routers/serviceRequest.routes.js
// backend/src/routers/serviceRequest.routes.js

router.get("/my", async (req, res) => {
  try {
    // Получаем ID пользователя из токена (нужно добавить middleware для извлечения user_id)
    const userId = req.user.id;
    const requests = await ServiceRequestService.getUserRequests(userId);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user requests" });
  }
});

router.get("/", async (req, res) => {
  console.log("Получен запрос на /api/service-requests");

  try {
    // Проверка соединения с БД
    await query("SELECT 1");
    console.log("Соединение с БД работает");

    // Основной запрос
    const { rows } = await query(`
      SELECT 
        sr.id,
        sr.printer_id,
        sr.problem_description,
        sr.status,
        sr.created_at,
        p.model as printer_model,
        p.location as printer_location
      FROM service_requests sr
      JOIN printers p ON sr.printer_id = p.id
      ORDER BY sr.created_at DESC
    `);

    console.log(`Успешно получено ${rows.length} заявок`);
    res.json(rows);
  } catch (error) {
    console.error("Ошибка в /api/service-requests:", {
      message: error.message,
      stack: error.stack,
      query: error.query,
    });
    res.status(500).json({
      error: "Database error",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});
module.exports = router;
