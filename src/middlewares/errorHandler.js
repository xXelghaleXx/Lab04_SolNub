const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Errores de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: errors
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Error de duplicado',
      details: errors
    });
  }

  // Error genérico
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Error del servidor'
  });
};

module.exports = errorHandler;
