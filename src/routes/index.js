const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');

// Ruta de bienvenida a la API
router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de CRUD',
    version: '1.0.0'
  });
});

// Rutas de usuarios
router.use('/users', userRoutes);

// Aquí puedes agregar más rutas para otros recursos

module.exports = router;
