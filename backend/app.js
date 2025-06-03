require("dotenv").config();
const express = require("express");
const cors = require("cors");
const printerRoutes = require("./src/routers/printer.routes");
const serviceRequestRoutes = require("./src/routers/serviceRequest.routes");
const authRouter = require("./src/routers/serviceAuth.routers");
const app = express();

// Middleware
app.use(cors());
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Добавили OPTIONS
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // Если используете куки/сессии
  optionsSuccessStatus: 200, // Для старых браузеров
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/printers", printerRoutes);
// После других middleware
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/auth", authRouter);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Проверка подключения к БД
  require("./src/config/database")
    .query("SELECT NOW()")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));
});
