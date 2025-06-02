import { pool } from './config/database.js';

export const getPrinters = async () => {
    const query = 'SELECT * FROM printers';
    const { rows } = await pool.query(query);
    return rows;
};

export const getUsers = async () => {
    const query = 'SELECT id, username, role, full_name as "fullName", is_banned as "isBanned" FROM users';
    const { rows } = await pool.query(query);
    return rows;
};

export const getRequests = async () => {
    const query = `
        SELECT 
            r.id, 
            r.printer_id as "printerId",
            r.user_id as "userId",
            r.user_name as "userName",
            r.request_date as "date",
            p.model as "printerModel",
            p.location as "printerLocation"
        FROM requests r
        JOIN printers p ON r.printer_id = p.id
    `;
    const { rows } = await pool.query(query);
    return rows;
};