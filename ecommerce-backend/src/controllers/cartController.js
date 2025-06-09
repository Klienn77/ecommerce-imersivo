const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Obter carrinho do usuário
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name images category brand'
    });

    if (!cart) {
      // Se o carrinho não existir, criar um novo
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Erro ao obter carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter carrinho',
      message: error.message
    });
  }
};

// @desc    Adicionar item ao carrinho
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, customization } = req.body;

    // Validar dados
    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto e tamanho são obrigatórios'
      });
    }

    // Verificar se o produto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    // Verificar se o tamanho é válido
    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        error: 'Tamanho inválido'
      });
    }

    // Verificar estoque
    if (product.stock < (quantity || 1)) {
      return res.status(400).json({
        success: false,
        error: 'Produto sem estoque suficiente'
      });
    }

    // Buscar ou criar carrinho
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    // Verificar se o produto já está no carrinho com o mesmo tamanho e customização
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      item.size === size && 
      JSON.stringify(item.customization || {}) === JSON.stringify(customization || {})
    );

    // Preço a ser usado (com desconto, se disponível)
    const price = product.discountPrice || product.price;

    if (itemIndex > -1) {
      // Atualizar quantidade se o item já existir
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // Adicionar novo item
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        size,
        customization,
        price
      });
    }

    // Salvar carrinho
    await cart.save();

    // Retornar carrinho atualizado com produtos populados
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name images category brand'
    });

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar ao carrinho',
      message: error.message
    });
  }
};

// @desc    Atualizar quantidade de item no carrinho
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    // Validar dados
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade deve ser pelo menos 1'
      });
    }

    // Buscar carrinho
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Carrinho não encontrado'
      });
    }

    // Encontrar item
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item não encontrado no carrinho'
      });
    }

    // Verificar estoque
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Produto sem estoque suficiente'
      });
    }

    // Atualizar quantidade
    cart.items[itemIndex].quantity = quantity;

    // Salvar carrinho
    await cart.save();

    // Retornar carrinho atualizado com produtos populados
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name images category brand'
    });

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar item do carrinho',
      message: error.message
    });
  }
};

// @desc    Remover item do carrinho
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Buscar carrinho
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Carrinho não encontrado'
      });
    }

    // Encontrar item
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item não encontrado no carrinho'
      });
    }

    // Remover item
    cart.items.splice(itemIndex, 1);

    // Salvar carrinho
    await cart.save();

    // Retornar carrinho atualizado com produtos populados
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name images category brand'
    });

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover item do carrinho',
      message: error.message
    });
  }
};

// @desc    Limpar carrinho
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Buscar carrinho
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Carrinho não encontrado'
      });
    }

    // Limpar itens
    cart.items = [];

    // Salvar carrinho
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Carrinho limpo com sucesso',
      cart
    });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao limpar carrinho',
      message: error.message
    });
  }
};
