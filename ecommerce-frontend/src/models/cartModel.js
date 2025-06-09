const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantidade mínima é 1'],
    default: 1
  },
  size: {
    type: String,
    required: true
  },
  customization: {
    colors: {
      body: String,
      sole: String,
      laces: String,
      logo: String
    },
    materials: {
      body: String,
      sole: String
    },
    components: {
      laces: Boolean,
      logo: Boolean
    }
  },
  price: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar o campo updatedAt antes de salvar
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calcular totais
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
