const express = require("express");
const router = express.Router();
const ServiceAddPrinter = require("../services/servicesAddPrinter.service");

router.post("/registerPrinter", async (req, res) => {
  try {
    const user = await ServiceAddPrinter.registerPrinter(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Registration error:", {
      status: error.status,
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(error.status || 500).json({
      error: error.message || "Ошибка регистрации",
    });
  }
});
module.exports = router;
