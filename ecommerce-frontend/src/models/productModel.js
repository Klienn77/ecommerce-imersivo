const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição do produto é obrigatória']
  },
  shortDescription: {
    type: String,
    required: [true, 'Descrição curta é obrigatória'],
    maxlength: [200, 'Descrição curta não pode ter mais de 200 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Preço do produto é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  discountPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Categoria do produto é obrigatória'],
    enum: ['calçados', 'roupas', 'acessórios', 'esportes', 'casual']
  },
  brand: {
    type: String,
    required: [true, 'Marca do produto é obrigatória']
  },
  stock: {
    type: Number,
    required: [true, 'Estoque do produto é obrigatório'],
    min: [0, 'Estoque não pode ser negativo'],
    default: 0
  },
  sizes: {
    type: [String],
    required: [true, 'Tamanhos disponíveis são obrigatórios']
  },
  images: {
    type: [String],
    required: [true, 'Pelo menos uma imagem é obrigatória']
  },
  has3DModel: {
    type: Boolean,
    default: false
  },
  modelPath: {
    type: String,
    default: null
  },
  customizable: {
    type: Boolean,
    default: false
  },
  defaultColors: {
    body: { type: String, default: '#3498db' },
    sole: { type: String, default: '#2c3e50' },
    laces: { type: String, default: '#ecf0f1' },
    logo: { type: String, default: '#e74c3c' }
  },
  defaultMaterials: {
    body: { type: String, default: 'leather' },
    sole: { type: String, default: 'rubber' }
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Avaliação mínima é 0'],
    max: [5, 'Avaliação máxima é 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
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
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Método para calcular desconto
productSchema.methods.getDiscountPercentage = function() {
  if (!this.discountPrice) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
};

// Método estático para encontrar produtos relacionados
productSchema.statics.findRelated = async function(productId, limit = 4) {
  const product = await this.findById(productId);
  if (!product) return [];

  // Encontrar produtos da mesma categoria
  const relatedProducts = await this.find({
    _id: { $ne: productId },
    category: product.category
  }).limit(limit);

  // Se não houver produtos suficientes, adicionar da mesma marca
  if (relatedProducts.length < limit) {
    const brandProducts = await this.find({
      _id: { $ne: productId },
      category: { $ne: product.category },
      brand: product.brand
    }).limit(limit - relatedProducts.length);

    return [...relatedProducts, ...brandProducts];
  }

  return relatedProducts;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
