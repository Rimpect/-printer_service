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
  static async getUserRequests(userId) {
    const { rows } = await query(
      `SELECT 
      sr.id,
      p.model as printer_model,
      sr.problem_description,
      sr.created_at,
      sr.status,
      sr.service_center_id
    FROM service_requests sr
    JOIN printers p ON sr.printer_id = p.id
    WHERE sr.user_id = $1
    ORDER BY sr.created_at DESC`,
      [userId]
    );
    return rows;
  }
  // serviceRequest.service.js
  static async getOpenRequests() {
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
    WHERE sr.status = 'open'
    ORDER BY sr.created_at DESC`
    );
    return rows;
  }

  static async closeRequest(requestId, repairCost, workDescription) {
    try {
      const { rows } = await query(
        `UPDATE service_requests 
       SET 
         status = 'closed', 
         closed_at = NOW(),
         repair_cost = $2,
         work_description = $3
       WHERE id = $1 
       RETURNING *`,
        [requestId, repairCost, workDescription]
      );

      if (rows.length === 0) {
        throw new Error("Request not found");
      }

      return rows[0];
    } catch (error) {
      console.error("Error closing request:", error);
      throw error;
    }
  }
  static async updateRequestStatus(requestId, status) {
    const { rows } = await query(
      "UPDATE service_requests SET status = $1 WHERE id = $2 RETURNING *",
      [status, requestId]
    );
    return rows[0];
  }
  static async getAssignedRequests(serviceCenterId) {
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
      [serviceCenterId]
    );
    return rows;
  }
}

module.exports = ServiceRequestService;
