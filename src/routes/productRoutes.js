const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Obtener todos los productos
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Obtener un producto por ID
router.get('/:id', productController.getProductById);

// POST /api/products - Crear un nuevo producto
router.post('/', productController.createProduct);

// PUT /api/products/:id - Actualizar un producto existente
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Eliminar un producto (borrado lógico)
router.delete('/:id', productController.deleteProduct);

module.exports = router;