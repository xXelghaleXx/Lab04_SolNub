const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');

// Ruta de bienvenida a la API
router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de CRUD',
    version: '1.0.0'
  });
});

// Rutas de usuarios
router.use('/users', userRoutes);

// Rutas de productos
router.use('/products', productRoutes);

// Aquí puedes agregar más rutas para otros recursos

module.exports = router;
