const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false
  },
  avatar: {
    type: String,
    default: '/uploads/default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  addresses: [{
    name: String,
    recipient: String,
    address: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  paymentMethods: [{
    type: String,
    brand: String,
    lastFour: String,
    expiryMonth: Number,
    expiryYear: Number,
    holderName: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: false
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    viewHistory: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    favoriteCategories: [String]
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar senha
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para adicionar produto ao histórico de visualização
userSchema.methods.addToViewHistory = function(productId) {
  // Remover o produto se já existir no histórico
  const filteredHistory = this.preferences.viewHistory.filter(
    item => !item.productId.equals(productId)
  );
  
  // Adicionar o produto no início do histórico
  this.preferences.viewHistory = [
    { productId, timestamp: new Date() },
    ...filteredHistory
  ].slice(0, 20); // Limitar a 20 itens
  
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
