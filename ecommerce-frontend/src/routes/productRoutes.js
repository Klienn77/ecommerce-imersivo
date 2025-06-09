const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// Middleware de autenticação será adicionado posteriormente
// const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para gerenciamento de produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obter todos os produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filtrar por marca
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Preço máximo
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, newest, rating]
 *         description: Ordenação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *     responses:
 *       200:
 *         description: Lista de produtos
 *       500:
 *         description: Erro no servidor
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Obter produtos em destaque
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Número máximo de produtos
 *     responses:
 *       200:
 *         description: Lista de produtos em destaque
 *       500:
 *         description: Erro no servidor
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Buscar produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Resultados da busca
 *       400:
 *         description: Termo de busca não fornecido
 *       500:
 *         description: Erro no servidor
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obter um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products/{id}/related:
 *   get:
 *     summary: Obter produtos relacionados
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Número máximo de produtos relacionados
 *     responses:
 *       200:
 *         description: Lista de produtos relacionados
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id/related', productController.getRelatedProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - shortDescription
 *               - price
 *               - category
 *               - brand
 *               - sizes
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               stock:
 *                 type: number
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               has3DModel:
 *                 type: boolean
 *               modelPath:
 *                 type: string
 *               customizable:
 *                 type: boolean
 *               defaultColors:
 *                 type: object
 *               defaultMaterials:
 *                 type: object
 *               featured:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/', /* protect, admin, */ productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', /* protect, admin, */ productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Excluir um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', /* protect, admin, */ productController.deleteProduct);

module.exports = router;
