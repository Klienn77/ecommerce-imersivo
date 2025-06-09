const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API para gerenciamento do carrinho de compras
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obter carrinho do usuário
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho obtido com sucesso
 *       500:
 *         description: Erro no servidor
 *   post:
 *     summary: Adicionar item ao carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - size
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 default: 1
 *               size:
 *                 type: string
 *               customization:
 *                 type: object
 *     responses:
 *       200:
 *         description: Item adicionado com sucesso
 *       400:
 *         description: Dados inválidos ou produto sem estoque
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro no servidor
 *   delete:
 *     summary: Limpar carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho limpo com sucesso
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.route('/')
  .get(protect, cartController.getCart)
  .post(protect, cartController.addToCart)
  .delete(protect, cartController.clearCart);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   put:
 *     summary: Atualizar quantidade de item no carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do item no carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       400:
 *         description: Quantidade inválida ou produto sem estoque
 *       404:
 *         description: Carrinho ou item não encontrado
 *       500:
 *         description: Erro no servidor
 *   delete:
 *     summary: Remover item do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do item no carrinho
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       404:
 *         description: Carrinho ou item não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.route('/:itemId')
  .put(protect, cartController.updateCartItem)
  .delete(protect, cartController.removeCartItem);

module.exports = router;
