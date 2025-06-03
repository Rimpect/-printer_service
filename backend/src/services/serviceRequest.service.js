const { query } = require("../config/database");

class ServiceRequestService {
  static async create(printerId, problemDescription, userId) {
    try {
      const { rows } = await query(
        "INSERT INTO service_requests (printer_id, problem_description, user_id) VALUES ($1, $2, $3) RETURNING *",
        [printerId, problemDescription, userId]
      );
      return rows[0];
    } catch (error) {
      console.error("Ошибка в Service.create:", error);
      throw error;
    }
  }
  // В ServiceRequestService.getRequests()
  static async getRequests() {
    const queryText = `
SELECT 
      sr.id,
      p.model AS "printerModel",  
      sr.printer_id AS "printerId",
      sr.problem_description AS "problemDescription",
      sr.created_at AS "createdAt",
      sr.status
    FROM service_requests sr
    LEFT JOIN printers p ON sr.printer_id = p.id  
  `;

    const { rows } = await query(queryText);
    return rows;
  }

  static async closeRequest(requestId) {
    const { rows } = await query(
      `UPDATE service_requests 
       SET status = 'closed', closed_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [requestId]
    );
    return rows[0];
  }

  // serviceRequest.service.js
  static async getUserRequests(userId) {
    try {
      console.log("Executing query for user ID:", userId); // Добавьте логирование

      const { rows } = await query(
        `SELECT 
         sr.id,
         p.model as printer_model,
         sr.problem_description,
         sr.status,
         sr.created_at,
         sr.closed_at
       FROM service_requests sr
       JOIN printers p ON sr.printer_id = p.id
       WHERE sr.user_id = $1
       ORDER BY sr.created_at DESC`,
        [userId]
      );

      console.log("Query results:", rows); // Логируем результаты
      return rows;
    } catch (error) {
      console.error("Database error in getUserRequests:", {
        message: error.message,
        query: error.query, // Если ваш драйвер БД предоставляет это
        stack: error.stack,
      });
      throw error; // Пробрасываем ошибку дальше
    }
  }
}

module.exports = ServiceRequestService;
