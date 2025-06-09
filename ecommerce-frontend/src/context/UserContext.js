/**
 * Contexto de Usuário para o E-commerce Imersivo
 * 
 * Este contexto é responsável por:
 * 1. Gerenciar dados e estado do usuário
 * 2. Fornecer métodos para autenticação e perfil
 * 3. Armazenar histórico de pedidos e preferências
 * 4. Gerenciar endereços e métodos de pagamento
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Gerenciamento de estado de usuário em aplicações React
 * - Simulação de autenticação e persistência de sessão
 * - Armazenamento seguro de dados sensíveis
 * - Personalização baseada em preferências do usuário
 */

import React, { createContext, useState, useEffect } from 'react';

// Criação do contexto
export const UserContext = createContext();

/**
 * Provedor do contexto de usuário
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 */
export const UserProvider = ({ children }) => {
  // Estados principais
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    viewHistory: [],
    favoriteCategories: []
  });
  
  // Efeito para carregar dados do usuário na inicialização
  useEffect(() => {
    // Simulação de verificação de autenticação
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Em um ambiente real, aqui verificaríamos tokens de autenticação
        const savedUser = localStorage.getItem('ecommerce_user');
        const savedOrderHistory = localStorage.getItem('ecommerce_order_history');
        const savedAddresses = localStorage.getItem('ecommerce_addresses');
        const savedPaymentMethods = localStorage.getItem('ecommerce_payment_methods');
        const savedPreferences = localStorage.getItem('ecommerce_preferences');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Carrega dados relacionados
          if (savedOrderHistory) {
            setOrderHistory(JSON.parse(savedOrderHistory));
          }
          
          if (savedAddresses) {
            setAddresses(JSON.parse(savedAddresses));
          }
          
          if (savedPaymentMethods) {
            setPaymentMethods(JSON.parse(savedPaymentMethods));
          }
          
          if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        logout(); // Limpa dados em caso de erro
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Efeito para salvar dados quando atualizados
  useEffect(() => {
    if (user) {
      localStorage.setItem('ecommerce_user', JSON.stringify(user));
    }
  }, [user]);
  
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('ecommerce_order_history', JSON.stringify(orderHistory));
    }
  }, [isAuthenticated, orderHistory]);
  
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('ecommerce_addresses', JSON.stringify(addresses));
    }
  }, [isAuthenticated, addresses]);
  
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('ecommerce_payment_methods', JSON.stringify(paymentMethods));
    }
  }, [isAuthenticated, paymentMethods]);
  
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('ecommerce_preferences', JSON.stringify(preferences));
    }
  }, [isAuthenticated, preferences]);
  
  /**
   * Realiza login do usuário
   * 
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} - Resultado do login
   */
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Simulação de autenticação
      // Em um ambiente real, aqui faríamos uma chamada de API
      
      // Validação básica
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulação de usuário para demonstração
      // Em produção, esses dados viriam do backend
      if (email === 'demo@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Usuário Demo',
          email: 'demo@example.com',
          avatar: '/assets/images/avatar.jpg'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Carrega dados de exemplo
        setOrderHistory(sampleOrderHistory);
        setAddresses(sampleAddresses);
        setPaymentMethods(samplePaymentMethods);
        
        setIsLoading(false);
        return { success: true, user: userData };
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Realiza logout do usuário
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setOrderHistory([]);
    setAddresses([]);
    setPaymentMethods([]);
    setPreferences({
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      viewHistory: [],
      favoriteCategories: []
    });
    
    // Limpa dados do localStorage
    localStorage.removeItem('ecommerce_user');
    localStorage.removeItem('ecommerce_order_history');
    localStorage.removeItem('ecommerce_addresses');
    localStorage.removeItem('ecommerce_payment_methods');
    localStorage.removeItem('ecommerce_preferences');
  };
  
  /**
   * Registra um novo usuário
   * 
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} - Resultado do registro
   */
  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simulação de registro
      // Em um ambiente real, aqui faríamos uma chamada de API
      
      // Validação básica
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Nome, email e senha são obrigatórios');
      }
      
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulação de sucesso
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        avatar: null
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Atualiza dados do perfil do usuário
   * 
   * @param {Object} profileData - Novos dados de perfil
   * @returns {Promise<Object>} - Resultado da atualização
   */
  const updateProfile = async (profileData) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    
    try {
      // Simulação de atualização
      // Em um ambiente real, aqui faríamos uma chamada de API
      
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualiza dados do usuário
      setUser(prevUser => ({
        ...prevUser,
        ...profileData
      }));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  /**
   * Adiciona um endereço à lista de endereços do usuário
   * 
   * @param {Object} address - Dados do endereço
   */
  const addAddress = (address) => {
    if (!isAuthenticated) return;
    
    const newAddress = {
      id: Math.random().toString(36).substr(2, 9),
      ...address
    };
    
    setAddresses(prevAddresses => [...prevAddresses, newAddress]);
  };
  
  /**
   * Atualiza um endereço existente
   * 
   * @param {string} id - ID do endereço
   * @param {Object} addressData - Novos dados do endereço
   */
  const updateAddress = (id, addressData) => {
    if (!isAuthenticated) return;
    
    setAddresses(prevAddresses => 
      prevAddresses.map(address => 
        address.id === id ? { ...address, ...addressData } : address
      )
    );
  };
  
  /**
   * Remove um endereço
   * 
   * @param {string} id - ID do endereço
   */
  const removeAddress = (id) => {
    if (!isAuthenticated) return;
    
    setAddresses(prevAddresses => 
      prevAddresses.filter(address => address.id !== id)
    );
  };
  
  /**
   * Adiciona um método de pagamento
   * 
   * @param {Object} paymentMethod - Dados do método de pagamento
   */
  const addPaymentMethod = (paymentMethod) => {
    if (!isAuthenticated) return;
    
    const newPaymentMethod = {
      id: Math.random().toString(36).substr(2, 9),
      ...paymentMethod
    };
    
    setPaymentMethods(prevMethods => [...prevMethods, newPaymentMethod]);
  };
  
  /**
   * Remove um método de pagamento
   * 
   * @param {string} id - ID do método de pagamento
   */
  const removePaymentMethod = (id) => {
    if (!isAuthenticated) return;
    
    setPaymentMethods(prevMethods => 
      prevMethods.filter(method => method.id !== id)
    );
  };
  
  /**
   * Salva um pedido no histórico
   * 
   * @param {Object} order - Dados do pedido
   */
  const saveOrderToHistory = (order) => {
    const newOrder = {
      ...order,
      id: order.id || Math.random().toString(36).substr(2, 9),
      date: order.date || new Date().toISOString()
    };
    
    setOrderHistory(prevHistory => [newOrder, ...prevHistory]);
  };
  
  /**
   * Obtém um pedido pelo ID
   * 
   * @param {string} orderId - ID do pedido
   * @returns {Object|null} - Pedido encontrado ou null
   */
  const getOrderById = (orderId) => {
    return orderHistory.find(order => order.orderId === orderId) || null;
  };
  
  /**
   * Obtém pedidos recentes
   * 
   * @param {number} limit - Número máximo de pedidos a retornar
   * @returns {Array} - Lista de pedidos recentes
   */
  const getRecentOrders = (limit = 5) => {
    return orderHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };
  
  /**
   * Adiciona um produto ao histórico de visualização
   * 
   * @param {Object} product - Produto visualizado
   */
  const addToViewHistory = (product) => {
    if (!product) return;
    
    setPreferences(prevPreferences => {
      // Remove o produto se já existir no histórico
      const filteredHistory = prevPreferences.viewHistory.filter(
        item => item.id !== product.id
      );
      
      // Adiciona o produto no início do histórico
      const newViewHistory = [
        { id: product.id, timestamp: new Date().toISOString() },
        ...filteredHistory
      ].slice(0, 20); // Limita a 20 itens
      
      return {
        ...prevPreferences,
        viewHistory: newViewHistory
      };
    });
  };
  
  /**
   * Atualiza preferências de notificação
   * 
   * @param {Object} notificationSettings - Novas configurações
   */
  const updateNotificationPreferences = (notificationSettings) => {
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      notifications: {
        ...prevPreferences.notifications,
        ...notificationSettings
      }
    }));
  };
  
  /**
   * Adiciona uma categoria às favoritas
   * 
   * @param {string} categoryId - ID da categoria
   */
  const addFavoriteCategory = (categoryId) => {
    setPreferences(prevPreferences => {
      if (prevPreferences.favoriteCategories.includes(categoryId)) {
        return prevPreferences;
      }
      
      return {
        ...prevPreferences,
        favoriteCategories: [...prevPreferences.favoriteCategories, categoryId]
      };
    });
  };
  
  /**
   * Remove uma categoria das favoritas
   * 
   * @param {string} categoryId - ID da categoria
   */
  const removeFavoriteCategory = (categoryId) => {
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      favoriteCategories: prevPreferences.favoriteCategories.filter(
        id => id !== categoryId
      )
    }));
  };
  
  // Valores e métodos expostos pelo contexto
  const value = {
    user,
    isAuthenticated,
    isLoading,
    orderHistory,
    addresses,
    paymentMethods,
    preferences,
    login,
    logout,
    register,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    addPaymentMethod,
    removePaymentMethod,
    saveOrderToHistory,
    getOrderById,
    getRecentOrders,
    addToViewHistory,
    updateNotificationPreferences,
    addFavoriteCategory,
    removeFavoriteCategory
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Dados de exemplo para demonstração
const sampleOrderHistory = [
  {
    orderId: 'ORD12345',
    date: '2025-05-15T10:30:00Z',
    status: 'delivered',
    items: [
      {
        id: 1,
        name: 'Tênis Runner Pro',
        price: 299.90,
        quantity: 1,
        size: '42',
        image: '/assets/images/products/shoes-1.jpg',
        customization: {
          colors: {
            body: '#3498db',
            sole: '#2c3e50',
            laces: '#ecf0f1'
          }
        }
      },
      {
        id: 3,
        name: 'Meia Esportiva Premium',
        price: 39.90,
        quantity: 2,
        size: 'M',
        image: '/assets/images/products/socks-1.jpg'
      }
    ],
    shipping: {
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      method: 'express'
    },
    payment: {
      method: 'credit',
      cardLastFour: '4321'
    },
    summary: {
      subtotal: 379.70,
      discount: 0,
      shipping: 15.90,
      tax: 38.00,
      total: 433.60
    }
  },
  {
    orderId: 'ORD12346',
    date: '2025-04-28T14:45:00Z',
    status: 'shipped',
    items: [
      {
        id: 5,
        name: 'Camiseta Esportiva Dry-Fit',
        price: 89.90,
        quantity: 1,
        size: 'M',
        image: '/assets/images/products/shirt-1.jpg'
      }
    ],
    shipping: {
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      method: 'standard'
    },
    payment: {
      method: 'pix'
    },
    summary: {
      subtotal: 89.90,
      discount: 0,
      shipping: 12.50,
      tax: 9.00,
      total: 111.40
    }
  }
];

const sampleAddresses = [
  {
    id: 'addr1',
    name: 'Casa',
    recipient: 'Usuário Demo',
    address: 'Rua das Flores, 123',
    complement: 'Apto 101',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    isDefault: true
  },
  {
    id: 'addr2',
    name: 'Trabalho',
    recipient: 'Usuário Demo',
    address: 'Av. Paulista, 1000',
    complement: 'Sala 500',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isDefault: false
  }
];

const samplePaymentMethods = [
  {
    id: 'pay1',
    type: 'credit',
    brand: 'visa',
    lastFour: '4321',
    expiryMonth: 12,
    expiryYear: 2028,
    holderName: 'USUARIO DEMO',
    isDefault: true
  },
  {
    id: 'pay2',
    type: 'credit',
    brand: 'mastercard',
    lastFour: '8765',
    expiryMonth: 10,
    expiryYear: 2026,
    holderName: 'USUARIO DEMO',
    isDefault: false
  }
];

export default UserProvider;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como os dados do usuário são gerenciados e persistidos
 * 2. Observe como a autenticação é simulada para fins de demonstração
 * 3. Estude como o histórico de pedidos e preferências são armazenados
 * 4. Analise como o contexto é utilizado para personalização da experiência
 */
