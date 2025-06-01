const { query } = require('../config/database');

// backend/src/services/serviceRequest.service.js
class ServiceRequestService {
  static async getAllRequests() {
    const { rows } = await pool.query(`
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