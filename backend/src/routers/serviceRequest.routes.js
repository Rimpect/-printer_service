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

    const { rows } = await query(
      `UPDATE service_requests 
       SET service_center_id = $1, 
           status = 'in_progress',
           updated_at = NOW()
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
    res.status(500).json({ error: "Failed to assign request" });
  }
});
// Получение назначенных заявок для сервисного центра
router.get("/assigned", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching assigned requests for service center:", req.user.id);

    const { rows } = await query(
      `SELECT 
        sr.id,
        p.model as printer_model,
        u.login as user_login,
        sr.problem_description,
        sr.created_at,
        sr.status
      FROM service_requests sr
      JOIN printers p ON sr.printer_id = p.id
      JOIN users u ON sr.user_id = u.id
      WHERE sr.status = 'in_progress'
      AND sr.service_center_id = $1
      ORDER BY sr.created_at DESC`,
      [req.user.id]
    );

    console.log(`Found ${rows.length} assigned requests`);
    res.json(rows);
  } catch (error) {
    console.error("Error in /assigned endpoint:", error);
    res.status(500).json({
      error: "Failed to fetch assigned requests",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});
router.put("/:id/close", authMiddleware, async (req, res) => {
  try {
    const { repair_cost, work_description } = req.body;

    if (!repair_cost || !work_description) {
      return res.status(400).json({
        error: "Необходимо указать стоимость ремонта и описание работ",
      });
    }

    const request = await ServiceRequestService.closeRequest(
      req.params.id,
      repair_cost,
      work_description
    );

    if (!request) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }

    res.json(request);
  } catch (error) {
    console.error("Ошибка закрытия заявки:", error);
    res.status(500).json({
      error: "Ошибка сервера при закрытии заявки",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});
module.exports = router;
