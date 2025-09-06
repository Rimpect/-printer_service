const { query } = require('../config/database');

class Printer {
  static async getAll() {
    const { rows } = await query('SELECT * FROM printers ORDER BY id');
    return rows;
  }

  static async getById(id) {
    const { rows } = await query('SELECT * FROM printers WHERE id = $1', [id]);
    return rows[0];
  }
}

module.exports = Printer;