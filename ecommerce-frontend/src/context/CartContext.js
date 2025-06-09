/**
 * Contexto de Carrinho para o E-commerce Imersivo
 * 
 * Este contexto é responsável por:
 * 1. Gerenciar o estado do carrinho de compras
 * 2. Fornecer métodos para adicionar, atualizar e remover itens
 * 3. Calcular valores (subtotal, frete, total)
 * 4. Persistir dados do carrinho no localStorage
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Context API do React para gerenciamento de estado global
 * - Persistência de dados no navegador
 * - Operações de CRUD em estruturas de dados complexas
 * - Cálculos dinâmicos baseados no estado
 */

import React, { createContext, useState, useEffect } from 'react';

// Criação do contexto
export const CartContext = createContext();

/**
 * Provedor do contexto de carrinho
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 */
export const CartProvider = ({ children }) => {
  // Estado principal do carrinho
  const [cart, setCart] = useState([]);
  
  // Efeito para carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('ecommerce_cart');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho do localStorage:', error);
        setCart([]);
      }
    }
  }, []);
  
  // Efeito para salvar carrinho no localStorage quando atualizado
  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
  }, [cart]);
  
  /**
   * Adiciona um item ao carrinho
   * 
   * @param {Object} item - Item a ser adicionado
   */
  const addToCart = (item) => {
    setCart(currentCart => {
      // Verifica se o item já existe no carrinho (mesmo ID e tamanho)
      const existingItemIndex = currentCart.findIndex(
        cartItem => cartItem.id === item.id && cartItem.size === item.size
      );
      
      if (existingItemIndex >= 0) {
        // Se o item já existe, atualiza a quantidade
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Se o item não existe, adiciona ao carrinho
        return [...currentCart, item];
      }
    });
  };
  
  /**
   * Atualiza a quantidade de um item no carrinho
   * 
   * @param {number|string} id - ID do item
   * @param {string} size - Tamanho do item
   * @param {number} quantity - Nova quantidade
   */
  const updateQuantity = (id, size, quantity) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.id === id && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  /**
   * Remove um item do carrinho
   * 
   * @param {number|string} id - ID do item
   * @param {string} size - Tamanho do item
   */
  const removeItem = (id, size) => {
    setCart(currentCart => {
      return currentCart.filter(item => !(item.id === id && item.size === size));
    });
  };
  
  /**
   * Limpa o carrinho
   */
  const clearCart = () => {
    setCart([]);
  };
  
  /**
   * Calcula o subtotal do carrinho
   * 
   * @returns {number} - Valor do subtotal
   */
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  /**
   * Calcula o valor do frete
   * 
   * @returns {number} - Valor do frete
   */
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    
    // Frete grátis para compras acima de R$ 200
    if (subtotal >= 200) {
      return 0;
    }
    
    // Frete básico de R$ 15 + R$ 0,50 por item
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    return 15 + (itemCount * 0.5);
  };
  
  /**
   * Calcula o valor total do carrinho
   * 
   * @returns {number} - Valor total
   */
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };
  
  /**
   * Verifica se um item está no carrinho
   * 
   * @param {number|string} id - ID do item
   * @param {string} size - Tamanho do item
   * @returns {boolean} - Verdadeiro se o item estiver no carrinho
   */
  const isInCart = (id, size) => {
    return cart.some(item => item.id === id && item.size === size);
  };
  
  /**
   * Obtém a quantidade de um item no carrinho
   * 
   * @param {number|string} id - ID do item
   * @param {string} size - Tamanho do item
   * @returns {number} - Quantidade do item
   */
  const getItemQuantity = (id, size) => {
    const item = cart.find(item => item.id === id && item.size === size);
    return item ? item.quantity : 0;
  };
  
  /**
   * Obtém o número total de itens no carrinho
   * 
   * @returns {number} - Número total de itens
   */
  const getTotalItems = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Valores e métodos expostos pelo contexto
  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    calculateSubtotal,
    calculateShipping,
    calculateTotal,
    isInCart,
    getItemQuantity,
    getTotalItems
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o estado do carrinho é gerenciado e persistido
 * 2. Observe como os métodos de manipulação do carrinho são implementados
 * 3. Estude como os cálculos de valores são realizados
 * 4. Analise como o contexto é utilizado em diferentes componentes
 */
