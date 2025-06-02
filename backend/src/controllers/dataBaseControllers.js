import pool from '../config/database.js';

export const getPrinters = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM printers';
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching printers:', error);
        res.status(500).json({ error: 'Failed to fetch printers' });
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const query = 'SELECT id, username, role, full_name as "fullName", is_banned as "isBanned" FROM users';
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getRequests = async (req, res, next) => {
    try {
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
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};
