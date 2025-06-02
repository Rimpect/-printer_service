require('dotenv').config();
const express = require('express');
const cors = require('cors');
const printerRoutes = require('./src/routers/printer.routes');
const serviceRequestRoutes = require('./src/routers/serviceRequest.routes');

const app = express();

// Middleware
app.use(cors());
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Укажите адрес вашего фронта
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/printers', printerRoutes);
// После других middleware
app.use('/api/service-requests', serviceRequestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Проверка подключения к БД
  require('./src/config/database').query('SELECT NOW()')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));
});