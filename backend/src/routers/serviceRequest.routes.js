const express = require('express');
const router = express.Router();
const ServiceRequestService = require('../services/serviceRequest.service');

// Получение заявок пользователя
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const requests = await ServiceRequestService.getUserRequests(userId);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Создание новой заявки
router.post('/', async (req, res) => {
  try {
    const { printer_id, problem_description, user_id } = req.body;
    const request = await ServiceRequestService.create(
      printer_id, 
      problem_description, 
      user_id
    );
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Закрытие заявки
router.put('/:id/close', async (req, res) => {
  try {
    const request = await ServiceRequestService.closeRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to close request' });
  }
});
// backend/src/routers/serviceRequest.routes.js
// backend/src/routers/serviceRequest.routes.js


router.get('/', async (req, res) => {
  console.log('Получен запрос на /api/service-requests');
  
  try {
    // Проверка соединения с БД
    await query('SELECT 1');
    console.log('Соединение с БД работает');

    // Основной запрос
    const { rows } = await query(`
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

    console.log(`Успешно получено ${rows.length} заявок`);
    res.json(rows);
  } catch (error) {
    console.error('Ошибка в /api/service-requests:', {
      message: error.message,
      stack: error.stack,
      query: error.query
    });
    res.status(500).json({ 
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});
module.exports = router;