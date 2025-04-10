const { Product } = require('../models');
const logger = require('../utils/logger');

// Obtener todos los productos
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ where: { active: true } });
    return res.status(200).json(products);
  } catch (error) {
    logger.error(`Error al obtener productos: ${error.message}`);
    next(error);
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ 
      where: { 
        id,
        active: true 
      } 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    logger.error(`Error al obtener el producto: ${error.message}`);
    next(error);
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category
    });
    
    return res.status(201).json(newProduct);
  } catch (error) {
    logger.error(`Error al crear el producto: ${error.message}`);
    next(error);
  }
};

// Actualizar un producto existente
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, active } = req.body;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    await product.update({
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock,
      category: category || product.category,
      active: active !== undefined ? active : product.active
    });
    
    return res.status(200).json(product);
  } catch (error) {
    logger.error(`Error al actualizar el producto: ${error.message}`);
    next(error);
  }
};

// Eliminar un producto (borrado lógico)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Borrado lógico
    await product.update({ active: false });
    
    return res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    logger.error(`Error al eliminar el producto: ${error.message}`);
    next(error);
  }
};