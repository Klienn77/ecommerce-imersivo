/**
 * Configuração correta de conexão com MongoDB para o E-commerce Imersivo
 * 
 * Este arquivo demonstra a forma segura e recomendada de conectar ao MongoDB
 * usando variáveis de ambiente para proteger credenciais sensíveis.
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Importação de rotas
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const logRoutes = require('./src/routes/logRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

// Configuração do app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce Imersivo',
      version: '1.0.0',
      description: 'API para o projeto de E-commerce Imersivo',
      contact: {
        name: 'Suporte',
        email: 'suporte@ecommerceimersivo.com'
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Servidor de Desenvolvimento'
        }
      ]
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/stats', statsRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API do Sistema de Pós-Vendas',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart',
      orders: '/api/orders',
      logs: '/api/logs',
      stats: '/api/stats',
      documentation: '/api-docs'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro no servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Verificação da variável de ambiente MONGODB_URI
if (!process.env.MONGODB_URI) {
  console.error('ERRO: Variável de ambiente MONGODB_URI não definida!');
  console.error('Por favor, crie um arquivo .env na raiz do projeto com sua string de conexão MongoDB.');
  console.error('Exemplo: MONGODB_URI=mongodb+srv://usuario:senha@cluster0.exemplo.mongodb.net/database');
  process.exit(1);
}

// Opções de conexão com MongoDB
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Configurações adicionais recomendadas
  serverSelectionTimeoutMS: 5000, // Timeout após 5 segundos
  socketTimeoutMS: 45000, // Timeout após 45 segundos
  family: 4 // Use IPv4, pule tentativa de IPv6
};

// Conexão com o MongoDB usando apenas variável de ambiente
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso');
    // Iniciar o servidor após conectar ao banco de dados
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 Documentação da API disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:');
    console.error(err);
    // Informações adicionais para ajudar na depuração
    if (err.name === 'MongoServerSelectionError') {
      console.error('Não foi possível conectar ao servidor MongoDB. Verifique:');
      console.error('1. Se a string de conexão está correta');
      console.error('2. Se o servidor MongoDB está acessível');
      console.error('3. Se as credenciais estão corretas');
      console.error('4. Se há regras de firewall bloqueando a conexão');
    }
    process.exit(1);
  });

// Tratamento de sinais para encerramento gracioso
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Conexão MongoDB encerrada devido ao encerramento da aplicação');
    process.exit(0);
  });
});

module.exports = app; // Para testes
