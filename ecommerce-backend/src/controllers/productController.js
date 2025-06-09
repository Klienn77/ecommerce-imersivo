const Product = require('../models/productModel');

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort, limit = 10, page = 1 } = req.query;
    
    // Construir query de filtro
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (brand) {
      filter.brand = brand;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    
    // Opções de ordenação
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }
    
    // Calcular paginação
    const skip = (Number(page) - 1) * Number(limit);
    
    // Executar consulta
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    
    // Contar total de produtos para paginação
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter produtos',
      message: error.message
    });
  }
};

// @desc    Obter um produto pelo ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter produto',
      message: error.message
    });
  }
};

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar produto',
      message: error.message
    });
  }
};

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar produto',
      message: error.message
    });
  }
};

// @desc    Excluir um produto
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Produto excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir produto',
      message: error.message
    });
  }
};

// @desc    Obter produtos relacionados
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const relatedProducts = await Product.findRelated(req.params.id, req.query.limit || 4);
    
    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts
    });
  } catch (error) {
    console.error('Erro ao obter produtos relacionados:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter produtos relacionados',
      message: error.message
    });
  }
};

// @desc    Obter produtos em destaque
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = req.query.limit || 8;
    const products = await Product.find({ featured: true }).limit(Number(limit));
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Erro ao obter produtos em destaque:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter produtos em destaque',
      message: error.message
    });
  }
};

// @desc    Buscar produtos
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Termo de busca não fornecido'
      });
    }
    
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos',
      message: error.message
    });
  }
};
