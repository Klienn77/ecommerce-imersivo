const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token está no header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Obter token do header
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado, token não fornecido'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_dev_key');

      // Adicionar usuário ao request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado, token inválido'
      });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// Middleware para verificar se o usuário é admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Não autorizado, acesso de administrador necessário'
    });
  }
};
