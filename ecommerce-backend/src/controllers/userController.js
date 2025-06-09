const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_dev_key', {
    expiresIn: '30d'
  });
};

// @desc    Registrar um novo usuário
// @route   POST /api/users
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'Usuário já existe'
      });
    }

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Dados de usuário inválidos'
      });
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar usuário',
      message: error.message
    });
  }
};

// @desc    Autenticar usuário e gerar token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    // Verificar se a senha está correta
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao autenticar usuário',
      message: error.message
    });
  }
};

// @desc    Obter perfil do usuário
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        paymentMethods: user.paymentMethods,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter perfil do usuário',
      message: error.message
    });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Atualizar campos
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.avatar) user.avatar = req.body.avatar;

    // Salvar alterações
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id)
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar perfil do usuário',
      message: error.message
    });
  }
};

// @desc    Adicionar endereço
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Se o novo endereço for definido como padrão, remover o padrão dos outros
    if (req.body.isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    // Adicionar novo endereço
    user.addresses.push(req.body);

    // Se for o primeiro endereço, definir como padrão
    if (user.addresses.length === 1) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(201).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Erro ao adicionar endereço:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar endereço',
      message: error.message
    });
  }
};

// @desc    Atualizar endereço
// @route   PUT /api/users/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Encontrar o endereço a ser atualizado
    const addressIndex = user.addresses.findIndex(
      address => address._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Endereço não encontrado'
      });
    }

    // Se o endereço atualizado for definido como padrão, remover o padrão dos outros
    if (req.body.isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    // Atualizar endereço
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...req.body
    };

    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar endereço',
      message: error.message
    });
  }
};

// @desc    Remover endereço
// @route   DELETE /api/users/addresses/:id
// @access  Private
exports.removeAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Encontrar o endereço a ser removido
    const addressIndex = user.addresses.findIndex(
      address => address._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Endereço não encontrado'
      });
    }

    // Verificar se o endereço a ser removido é o padrão
    const isDefault = user.addresses[addressIndex].isDefault;

    // Remover endereço
    user.addresses.splice(addressIndex, 1);

    // Se o endereço removido era o padrão e ainda existem endereços, definir o primeiro como padrão
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Erro ao remover endereço:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover endereço',
      message: error.message
    });
  }
};

// @desc    Adicionar método de pagamento
// @route   POST /api/users/payment-methods
// @access  Private
exports.addPaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Se o novo método for definido como padrão, remover o padrão dos outros
    if (req.body.isDefault) {
      user.paymentMethods.forEach(method => {
        method.isDefault = false;
      });
    }

    // Adicionar novo método de pagamento
    user.paymentMethods.push(req.body);

    // Se for o primeiro método, definir como padrão
    if (user.paymentMethods.length === 1) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();

    res.status(201).json({
      success: true,
      paymentMethods: user.paymentMethods
    });
  } catch (error) {
    console.error('Erro ao adicionar método de pagamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar método de pagamento',
      message: error.message
    });
  }
};

// @desc    Remover método de pagamento
// @route   DELETE /api/users/payment-methods/:id
// @access  Private
exports.removePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Encontrar o método a ser removido
    const methodIndex = user.paymentMethods.findIndex(
      method => method._id.toString() === req.params.id
    );

    if (methodIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Método de pagamento não encontrado'
      });
    }

    // Verificar se o método a ser removido é o padrão
    const isDefault = user.paymentMethods[methodIndex].isDefault;

    // Remover método
    user.paymentMethods.splice(methodIndex, 1);

    // Se o método removido era o padrão e ainda existem métodos, definir o primeiro como padrão
    if (isDefault && user.paymentMethods.length > 0) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      paymentMethods: user.paymentMethods
    });
  } catch (error) {
    console.error('Erro ao remover método de pagamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover método de pagamento',
      message: error.message
    });
  }
};

// @desc    Adicionar produto ao histórico de visualização
// @route   POST /api/users/view-history
// @access  Private
exports.addToViewHistory = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto é obrigatório'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    await user.addToViewHistory(productId);

    res.status(200).json({
      success: true,
      viewHistory: user.preferences.viewHistory
    });
  } catch (error) {
    console.error('Erro ao adicionar ao histórico de visualização:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar ao histórico de visualização',
      message: error.message
    });
  }
};

// @desc    Atualizar preferências de notificação
// @route   PUT /api/users/notification-preferences
// @access  Private
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Atualizar preferências
    user.preferences.notifications = {
      ...user.preferences.notifications,
      ...req.body
    };

    await user.save();

    res.status(200).json({
      success: true,
      notifications: user.preferences.notifications
    });
  } catch (error) {
    console.error('Erro ao atualizar preferências de notificação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar preferências de notificação',
      message: error.message
    });
  }
};
