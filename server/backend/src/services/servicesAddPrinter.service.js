const { query } = require("../config/database");
class ServiceAddPrinter {
  static async registerPrinter(userData) {
    const { rows } = await query(
      `INSERT INTO printers (
      model, location
    ) VALUES ($1, $2)
    RETURNING id, model, location`,
      [userData.model, userData.location]
    );

    return rows[0];
  }
}

module.exports = ServiceAddPrinter;
