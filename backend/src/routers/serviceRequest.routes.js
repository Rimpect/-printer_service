const express = require("express");
const router = express.Router();
const ServiceRequestService = require("../services/serviceRequest.service");
const authMiddleware = require("../middleware/authMiddleware");
const { query } = require("../config/database"); // Добавьте эту строку\
query("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error", err));
// Получение всех заявок
router.get("/", authMiddleware, async (req, res) => {
  try {
    const requests = await ServiceRequestService.getRequests();
    res.json(requests);
  } catch (error) {
    console.error("Error in GET /service-requests:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});

// Получение открытых заявок
router.get("/open", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching open requests..."); // Логирование
    const { rows } = await query(
      "SELECT * FROM service_requests WHERE status = 'open'"
    );
    console.log(`Found ${rows.length} open requests`); // Логирование количества
    res.json(rows);
  } catch (error) {
    console.error("Error in /open endpoint:", error);
    res.status(500).json({
      error: "Failed to fetch open requests",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});

// Получение заявок текущего пользователя
router.get("/my", authMiddleware, async (req, res) => {
  try {
    console.log("Authenticated user ID:", req.user.id);
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
    const user_id = req.user.id;

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
router.put("/:id/close", authMiddleware, async (req, res) => {
  try {
    const { repair_cost, work_description } = req.body;
    const request = await ServiceRequestService.closeRequest(
      req.params.id,
      repair_cost,
      work_description
    );
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to close request" });
  }
});
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { rows } = await query(
      "UPDATE service_requests SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update request status" });
  }
});
// Назначение заявки сервисному центру
router.put("/:id/assign", authMiddleware, async (req, res) => {
  try {
    const { service_center_id } = req.body;

    if (!service_center_id) {
      return res.status(400).json({ error: "Service center ID is required" });
    }

    const { rows } = await query(
      `UPDATE service_requests 
       SET service_center_id = $1, 
           status = 'in_progress' 
       WHERE id = $2 
       RETURNING *`,
      [service_center_id, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Assign error:", error);
    res.status(500).json({
      error: "Failed to assign request",
      details: error.message,
    });
  }
});

module.exports = router;
