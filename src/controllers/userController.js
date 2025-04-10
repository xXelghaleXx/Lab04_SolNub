const { User } = require('../models');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${req.params.id} no encontrado`
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    
    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${req.params.id} no encontrado`
      });
    }

    await user.update(req.body);
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${req.params.id} no encontrado`
      });
    }

    await user.destroy();
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
