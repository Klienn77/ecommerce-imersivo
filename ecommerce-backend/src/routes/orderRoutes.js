const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API para gerenciamento de pedidos
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obter pedidos do usuário
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 *       500:
 *         description: Erro no servidor
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - name
 *                   - recipient
 *                   - address
 *                   - city
 *                   - state
 *                   - zipCode
 *                 properties:
 *                   name:
 *                     type: string
 *                   recipient:
 *                     type: string
 *                   address:
 *                     type: string
 *                   complement:
 *                     type: string
 *                   neighborhood:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               paymentMethod:
 *                 type: object
 *                 required:
 *                   - type
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [credit_card, debit_card, pix, boleto]
 *                   details:
 *                     type: object
 *               shippingPrice:
 *                 type: number
 *               taxPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos ou carrinho vazio
 *       500:
 *         description: Erro no servidor
 */
router.route('/')
  .get(protect, orderController.getUserOrders)
  .post(protect, orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obter pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', protect, orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Atualizar status do pedido para pago
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentResult:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   status:
 *                     type: string
 *                   update_time:
 *                     type: string
 *                   email_address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id/pay', protect, orderController.updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/ship:
 *   put:
 *     summary: Atualizar status do pedido para enviado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trackingNumber
 *             properties:
 *               trackingNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *       400:
 *         description: Número de rastreamento é obrigatório ou pedido não está pago
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id/ship', protect, admin, orderController.updateOrderToShipped);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Atualizar status do pedido para entregue
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trackingNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *       400:
 *         description: Pedido não está pago
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id/deliver', protect, admin, orderController.updateOrderToDelivered);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancelar pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *       400:
 *         description: Pedido já foi enviado ou entregue e não pode ser cancelado
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router;
