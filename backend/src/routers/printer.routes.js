const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printer.controller');

router.get('/', printerController.getAllPrinters);
router.get('/:id', printerController.getPrinterById);

module.exports = router;