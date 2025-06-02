const { query } = require('../config/database');

class ServiceRequestService {
   static async create(printerId, problemDescription) {
    const { rows } = await query(
      'INSERT INTO service_requests (printer_id, problem_description) VALUES ($1, $2) RETURNING *',
      [printerId, problemDescription]
    );
    return rows[0];
  
  }
 static async getRequests() {
    const queryText = `
        SELECT 
        id,  // Добавляем id для ключей
        printer_id AS "printerId",
        problem_description AS "problemDescription",
        created_at AS "createdAt",
        status
        FROM service_requests
        ORDER BY created_at DESC
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
      `SELECT sr.*, p.model as printer_model 
       FROM service_requests sr
       LEFT JOIN printers p ON sr.printer_id = p.id
       WHERE sr.user_id = $1
       ORDER BY sr.created_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = ServiceRequestService;