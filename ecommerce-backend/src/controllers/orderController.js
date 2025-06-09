const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Criar novo pedido
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { 
      shippingAddress, 
      paymentMethod,
      shippingPrice = 0,
      taxPrice = 0
    } = req.body;

    // Validar dados
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Endereço de entrega e método de pagamento são obrigatórios'
      });
    }

    // Buscar carrinho do usuário
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Carrinho vazio'
      });
    }

    // Verificar estoque
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Produto ${product.name} não tem estoque suficiente`
        });
      }
    }

    // Preparar itens do pedido
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      size: item.size,
      customization: item.customization,
      image: item.product.images[0],
      price: item.price
    }));

    // Calcular preços
    const itemsPrice = cart.totalPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Criar pedido
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    // Atualizar estoque dos produtos
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Limpar carrinho
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar pedido',
      message: error.message
    });
  }
};

// @desc    Obter pedido por ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }

    // Verificar se o pedido pertence ao usuário ou se é admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter pedido',
      message: error.message
    });
  }
};

// @desc    Obter pedidos do usuário
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Erro ao obter pedidos do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter pedidos do usuário',
      message: error.message
    });
  }
};

// @desc    Atualizar status do pedido para pago
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const { paymentResult } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }

    // Verificar se o pedido pertence ao usuário
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    // Atualizar status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentResult = paymentResult;

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status do pedido',
      message: error.message
    });
  }
};

// @desc    Atualizar status do pedido para entregue
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }

    // Verificar se o pedido está pago
    if (!order.isPaid) {
      return res.status(400).json({
        success: false,
        error: 'Pedido não está pago'
      });
    }

    // Atualizar status
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status do pedido',
      message: error.message
    });
  }
};

// @desc    Atualizar status do pedido para enviado
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
exports.updateOrderToShipped = async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        error: 'Número de rastreamento é obrigatório'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }

    // Verificar se o pedido está pago
    if (!order.isPaid) {
      return res.status(400).json({
        success: false,
        error: 'Pedido não está pago'
      });
    }

    // Atualizar status
    order.status = 'shipped';
    order.trackingNumber = trackingNumber;

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status do pedido',
      message: error.message
    });
  }
};

// @desc    Cancelar pedido
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }

    // Verificar se o pedido pertence ao usuário
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    // Verificar se o pedido já foi enviado
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        error: 'Pedido já foi enviado ou entregue e não pode ser cancelado'
      });
    }

    // Atualizar status
    order.status = 'cancelled';

    // Restaurar estoque
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao cancelar pedido',
      message: error.message
    });
  }
};
