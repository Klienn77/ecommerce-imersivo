const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gerenciamento de usuários
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Usuário já existe ou dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/', userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Autenticar usuário e gerar token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       401:
 *         description: Email ou senha inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obter perfil do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.route('/profile')
  .get(protect, userController.getUserProfile)
  .put(protect, userController.updateUserProfile);

/**
 * @swagger
 * /api/users/addresses:
 *   post:
 *     summary: Adicionar endereço
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - recipient
 *               - address
 *               - city
 *               - state
 *               - zipCode
 *             properties:
 *               name:
 *                 type: string
 *               recipient:
 *                 type: string
 *               address:
 *                 type: string
 *               complement:
 *                 type: string
 *               neighborhood:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Endereço adicionado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post('/addresses', protect, userController.addAddress);

/**
 * @swagger
 * /api/users/addresses/{id}:
 *   put:
 *     summary: Atualizar endereço
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do endereço
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *       404:
 *         description: Usuário ou endereço não encontrado
 *       500:
 *         description: Erro no servidor
 *   delete:
 *     summary: Remover endereço
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço removido com sucesso
 *       404:
 *         description: Usuário ou endereço não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.route('/addresses/:id')
  .put(protect, userController.updateAddress)
  .delete(protect, userController.removeAddress);

/**
 * @swagger
 * /api/users/payment-methods:
 *   post:
 *     summary: Adicionar método de pagamento
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - brand
 *               - lastFour
 *               - expiryMonth
 *               - expiryYear
 *               - holderName
 *             properties:
 *               type:
 *                 type: string
 *               brand:
 *                 type: string
 *               lastFour:
 *                 type: string
 *               expiryMonth:
 *                 type: number
 *               expiryYear:
 *                 type: number
 *               holderName:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Método de pagamento adicionado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post('/payment-methods', protect, userController.addPaymentMethod);

/**
 * @swagger
 * /api/users/payment-methods/{id}:
 *   delete:
 *     summary: Remover método de pagamento
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do método de pagamento
 *     responses:
 *       200:
 *         description: Método de pagamento removido com sucesso
 *       404:
 *         description: Usuário ou método de pagamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/payment-methods/:id', protect, userController.removePaymentMethod);

/**
 * @swagger
 * /api/users/view-history:
 *   post:
 *     summary: Adicionar produto ao histórico de visualização
 *     tags: [Users]
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
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto adicionado ao histórico com sucesso
 *       400:
 *         description: ID do produto é obrigatório
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post('/view-history', protect, userController.addToViewHistory);

/**
 * @swagger
 * /api/users/notification-preferences:
 *   put:
 *     summary: Atualizar preferências de notificação
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               push:
 *                 type: boolean
 *               sms:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferências atualizadas com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/notification-preferences', protect, userController.updateNotificationPreferences);

module.exports = router;
