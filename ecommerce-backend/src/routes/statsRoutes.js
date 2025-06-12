const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: API para estatísticas e dashboard
 */

/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     summary: Obter dados do dashboard
 *     tags: [Stats]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *         description: Período para as estatísticas
 *     responses:
 *       200:
 *         description: Dados do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 dashboardData:
 *                   type: object
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Dados simulados para demonstração
    // Em uma implementação real, você consultaria o banco de dados
    const dashboardData = {
      metrics: {
        totalRevenue: '125000.00',
        averageOrderValue: '250.00',
        returnRate: '3.2',
        customerSatisfaction: '4.5'
      },
      dailySales: [
        { date: '2025-06-04', amount: 5000 },
        { date: '2025-06-05', amount: 7500 },
        { date: '2025-06-06', amount: 6200 },
        { date: '2025-06-07', amount: 8100 },
        { date: '2025-06-08', amount: 9300 },
        { date: '2025-06-09', amount: 7800 },
        { date: '2025-06-10', amount: 8500 },
        { date: '2025-06-11', amount: 9200 }
      ],
      salesByCategory: [
        { category: 'Eletrônicos', sales: 45000 },
        { category: 'Roupas', sales: 32000 },
        { category: 'Casa & Jardim', sales: 28000 },
        { category: 'Esportes', sales: 20000 }
      ],
      deviceUsage: [
        { device: 'Desktop', percentage: 45 },
        { device: 'Mobile', percentage: 40 },
        { device: 'Tablet', percentage: 15 }
      ],
      popularCustomizations: [
        { type: 'Cor', value: 'Azul', count: 156 },
        { type: 'Tamanho', value: 'M', count: 134 },
        { type: 'Material', value: 'Algodão', count: 98 },
        { type: 'Cor', value: 'Preto', count: 87 },
        { type: 'Tamanho', value: 'G', count: 76 }
      ]
    };
    
    // Ajustar dados baseado no período (simulação)
    if (period === '7d') {
      dashboardData.dailySales = dashboardData.dailySales.slice(-7);
      dashboardData.metrics.totalRevenue = '45000.00';
    } else if (period === '90d') {
      dashboardData.metrics.totalRevenue = '350000.00';
    } else if (period === '1y') {
      dashboardData.metrics.totalRevenue = '1500000.00';
    }
    
    res.json({
      success: true,
      dashboardData,
      period
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar os dados do dashboard'
    });
  }
});

/**
 * @swagger
 * /api/stats/summary:
 *   get:
 *     summary: Obter resumo de estatísticas
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Resumo de estatísticas
 */
router.get('/summary', async (req, res) => {
  try {
    const summary = {
      totalUsers: 1250,
      totalOrders: 3420,
      totalProducts: 156,
      totalRevenue: 125000.00,
      averageOrderValue: 250.00,
      conversionRate: 3.2,
      returnRate: 2.1,
      customerSatisfaction: 4.5
    };
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Erro ao buscar resumo de estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar o resumo de estatísticas'
    });
  }
});

module.exports = router;

