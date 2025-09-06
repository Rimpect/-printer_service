const Printer = require('../models/printer.model');

exports.getAllPrinters = async (req, res) => {
  try {
    const printers = await Printer.getAll();
    res.json(printers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch printers' });
  }
};

exports.getPrinterById = async (req, res) => {
  try {
    const printer = await Printer.getById(req.params.id);
    if (!printer) {
      return res.status(404).json({ error: 'Printer not found' });
    }
    res.json(printer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch printer' });
  }
};