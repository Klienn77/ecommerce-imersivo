require('dotenv').config();

// Arquivo de teste para verificar a integração básica entre frontend e backend
// Este script simula chamadas que o frontend faria para o backend

const axios = require('axios');
const mongoose = require('mongoose');
const Product = require('./src/models/productModel');
const User = require('./src/models/userModel');
const Cart = require('./src/models/cartModel');
const Order = require('./src/models/orderModel');

// URL base da API
const API_URL = 'http://localhost:5000/api';

// Função para testar os endpoints
async function testEndpoints() {
  try {
    console.log('Iniciando testes de integração...');
    
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-imersivo', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');
    
    // Limpar dados de teste anteriores
    await cleanupTestData();
    
    // Criar dados de teste
    const userData = await createTestUser();
    const productData = await createTestProducts();
    
    // Testar fluxo de autenticação
    console.log('\n--- Testando Autenticação ---');
    const authToken = await testAuthentication(userData);
    
    // Testar endpoints de produtos
    console.log('\n--- Testando Endpoints de Produtos ---');
    await testProductEndpoints(authToken, productData);
    
    // Testar endpoints de carrinho
    console.log('\n--- Testando Endpoints de Carrinho ---');
    const cartData = await testCartEndpoints(authToken, productData);
    
    // Testar endpoints de pedidos
    console.log('\n--- Testando Endpoints de Pedidos ---');
    await testOrderEndpoints(authToken, cartData);
    
    console.log('\n✅ Todos os testes concluídos com sucesso!');
    
    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    
    // Desconectar do MongoDB em caso de erro
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
    
    process.exit(1);
  }
}

// Função para limpar dados de teste anteriores
async function cleanupTestData() {
  console.log('Limpando dados de teste anteriores...');
  
  // Remover usuário de teste
  await User.deleteOne({ email: 'teste@exemplo.com' });
  
  // Remover produtos de teste
  await Product.deleteMany({ name: { $regex: 'Produto de Teste' } });
  
  // Remover carrinho e pedidos de teste
  const testUser = await User.findOne({ email: 'teste@exemplo.com' });
  if (testUser) {
    await Cart.deleteMany({ user: testUser._id });
    await Order.deleteMany({ user: testUser._id });
  }
  
  console.log('Dados de teste anteriores removidos');
}

// Função para criar usuário de teste
async function createTestUser() {
  console.log('Criando usuário de teste...');
  
  const userData = {
    name: 'Usuário de Teste',
    email: 'teste@exemplo.com',
    password: 'senha123'
  };
  
  // Verificar se o usuário já existe
  let user = await User.findOne({ email: userData.email });
  
  if (!user) {
    // Criar novo usuário
    user = await User.create(userData);
    console.log('Usuário de teste criado:', user.email);
  } else {
    console.log('Usuário de teste já existe:', user.email);
  }
  
  return userData;
}

// Função para criar produtos de teste
async function createTestProducts() {
  console.log('Criando produtos de teste...');
  
  const productsData = [
    {
      name: 'Produto de Teste 1 - Tênis',
      description: 'Descrição detalhada do tênis de teste',
      shortDescription: 'Tênis para testes',
      price: 199.99,
      category: 'calçados',
      brand: 'TestBrand',
      stock: 50,
      sizes: ['38', '39', '40', '41', '42'],
      images: ['/uploads/test-product-1.jpg', '/uploads/test-product-1-2.jpg'],
      has3DModel: true,
      modelPath: '/models/test-shoe.glb',
      customizable: true,
      defaultColors: {
        body: '#3498db',
        sole: '#2c3e50',
        laces: '#ecf0f1',
        logo: '#e74c3c'
      },
      defaultMaterials: {
        body: 'leather',
        sole: 'rubber'
      },
      rating: 4.5,
      reviewCount: 10,
      tags: ['tênis', 'esporte', 'corrida', 'teste']
    },
    {
      name: 'Produto de Teste 2 - Camiseta',
      description: 'Descrição detalhada da camiseta de teste',
      shortDescription: 'Camiseta para testes',
      price: 89.99,
      category: 'roupas',
      brand: 'TestBrand',
      stock: 100,
      sizes: ['P', 'M', 'G', 'GG'],
      images: ['/uploads/test-product-2.jpg', '/uploads/test-product-2-2.jpg'],
      has3DModel: false,
      customizable: false,
      rating: 4.0,
      reviewCount: 5,
      tags: ['camiseta', 'casual', 'algodão', 'teste']
    }
  ];
  
  const products = [];
  
  for (const productData of productsData) {
    // Verificar se o produto já existe
    let product = await Product.findOne({ name: productData.name });
    
    if (!product) {
      // Criar novo produto
      product = await Product.create(productData);
      console.log('Produto de teste criado:', product.name);
    } else {
      console.log('Produto de teste já existe:', product.name);
    }
    
    products.push(product);
  }
  
  return products;
}

// Função para testar autenticação
async function testAuthentication(userData) {
  console.log('Testando login...');
  
  try {
    // Tentar fazer login
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      email: userData.email,
      password: userData.password
    });
    
    console.log('✅ Login bem-sucedido');
    
    // Retornar token para uso em outros testes
    return loginResponse.data.user.token;
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar endpoints de produtos
async function testProductEndpoints(authToken, products) {
  try {
    // Testar listagem de produtos
    console.log('Testando listagem de produtos...');
    const productsResponse = await axios.get(`${API_URL}/products`);
    console.log(`✅ Listagem de produtos: ${productsResponse.data.count} produtos encontrados`);
    
    // Testar busca de produto por ID
    const productId = products[0]._id;
    console.log(`Testando busca de produto por ID: ${productId}...`);
    const productResponse = await axios.get(`${API_URL}/products/${productId}`);
    console.log(`✅ Busca de produto: ${productResponse.data.product.name}`);
    
    // Testar busca de produtos
    console.log('Testando busca de produtos...');
    const searchResponse = await axios.get(`${API_URL}/products/search?q=teste`);
    console.log(`✅ Busca de produtos: ${searchResponse.data.count} produtos encontrados`);
    
    // Testar produtos relacionados
    console.log('Testando produtos relacionados...');
    const relatedResponse = await axios.get(`${API_URL}/products/${productId}/related`);
    console.log(`✅ Produtos relacionados: ${relatedResponse.data.count} produtos encontrados`);
    
    return true;
  } catch (error) {
    console.error('❌ Erro nos endpoints de produtos:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar endpoints de carrinho
async function testCartEndpoints(authToken, products) {
  try {
    // Configurar headers com token
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    };
    
    // Testar obtenção do carrinho
    console.log('Testando obtenção do carrinho...');
    const cartResponse = await axios.get(`${API_URL}/cart`, config);
    console.log('✅ Obtenção do carrinho bem-sucedida');
    
    // Testar adição de item ao carrinho
    console.log('Testando adição de item ao carrinho...');
    const addToCartResponse = await axios.post(`${API_URL}/cart`, {
      productId: products[0]._id,
      quantity: 1,
      size: '40',
      customization: {
        colors: {
          body: '#3498db',
          sole: '#2c3e50',
          laces: '#ecf0f1',
          logo: '#e74c3c'
        }
      }
    }, config);
    console.log('✅ Adição de item ao carrinho bem-sucedida');
    
    // Testar atualização de item do carrinho
    if (addToCartResponse.data.cart.items.length > 0) {
      const itemId = addToCartResponse.data.cart.items[0]._id;
      console.log(`Testando atualização de item do carrinho: ${itemId}...`);
      const updateCartResponse = await axios.put(`${API_URL}/cart/${itemId}`, {
        quantity: 2
      }, config);
      console.log('✅ Atualização de item do carrinho bem-sucedida');
    }
    
    // Retornar dados do carrinho para uso em outros testes
    return addToCartResponse.data.cart;
  } catch (error) {
    console.error('❌ Erro nos endpoints de carrinho:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar endpoints de pedidos
async function testOrderEndpoints(authToken, cartData) {
  try {
    // Configurar headers com token
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    };
    
    // Testar criação de pedido
    console.log('Testando criação de pedido...');
    const createOrderResponse = await axios.post(`${API_URL}/orders`, {
      shippingAddress: {
        name: 'Casa',
        recipient: 'Usuário de Teste',
        address: 'Rua de Teste, 123',
        city: 'Cidade de Teste',
        state: 'TE',
        zipCode: '12345-678'
      },
      paymentMethod: {
        type: 'credit_card',
        details: {
          brand: 'Visa',
          lastFour: '1234',
          holderName: 'USUARIO TESTE'
        }
      },
      shippingPrice: 15.00,
      taxPrice: 20.00
    }, config);
    console.log('✅ Criação de pedido bem-sucedida');
    
    // Testar obtenção de pedidos do usuário
    console.log('Testando obtenção de pedidos do usuário...');
    const ordersResponse = await axios.get(`${API_URL}/orders`, config);
    console.log(`✅ Obtenção de pedidos: ${ordersResponse.data.count} pedidos encontrados`);
    
    // Testar obtenção de pedido por ID
    if (ordersResponse.data.orders.length > 0) {
      const orderId = ordersResponse.data.orders[0]._id;
      console.log(`Testando obtenção de pedido por ID: ${orderId}...`);
      const orderResponse = await axios.get(`${API_URL}/orders/${orderId}`, config);
      console.log('✅ Obtenção de pedido por ID bem-sucedida');
      
      // Testar atualização de status do pedido para pago
      console.log('Testando atualização de status do pedido para pago...');
      const payOrderResponse = await axios.put(`${API_URL}/orders/${orderId}/pay`, {
        paymentResult: {
          id: 'TEST123456',
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: 'teste@exemplo.com'
        }
      }, config);
      console.log('✅ Atualização de status do pedido para pago bem-sucedida');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro nos endpoints de pedidos:', error.response?.data || error.message);
    throw error;
  }
}

// Executar testes
testEndpoints();
