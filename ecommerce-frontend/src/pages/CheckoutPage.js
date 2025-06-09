/**
 * Página de Checkout do E-commerce Imersivo
 * 
 * Esta página é responsável por:
 * 1. Guiar o usuário pelo processo de finalização da compra
 * 2. Coletar informações de entrega e pagamento
 * 3. Validar dados em tempo real
 * 4. Processar o pedido e redirecionar para confirmação
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Formulários em múltiplas etapas
 * - Validação de dados em tempo real
 * - Gerenciamento de estado em fluxos complexos
 * - Integração com métodos de pagamento
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Importação de contextos
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

// Importação de componentes
import { Container, Section } from '../components/UI/Layout';
import { Button } from '../components/UI/Button';
import Checkout from '../components/Checkout/Checkout';

/**
 * Componente principal CheckoutPage
 */
const CheckoutPage = () => {
  // Contextos
  const { cart, calculateTotal, clearCart } = useContext(CartContext);
  const { user, saveOrderToHistory } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  
  // Navegação
  const navigate = useNavigate();
  
  // Estado para controlar processamento do pedido
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Efeito para atualizar título da página
  useEffect(() => {
    document.title = 'Finalizar Compra | E-commerce Imersivo';
  }, []);
  
  // Efeito para verificar se o carrinho está vazio
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  /**
   * Manipula finalização do pedido
   * 
   * @param {Object} orderData - Dados do pedido finalizado
   */
  const handleOrderComplete = (orderData) => {
    setIsProcessing(true);
    
    // Simulação de processamento de pedido
    setTimeout(() => {
      // Salva o pedido no histórico do usuário
      saveOrderToHistory({
        ...orderData,
        date: new Date().toISOString(),
        status: 'processing'
      });
      
      // Limpa o carrinho
      clearCart();
      
      // Redireciona para página de confirmação
      navigate(`/confirmation/${orderData.orderId}`);
      
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <main>
      <Section>
        <Container>
          <CheckoutContainer>
            <Checkout 
              onOrderComplete={handleOrderComplete}
              cartItems={cart}
            />
          </CheckoutContainer>
        </Container>
      </Section>
    </main>
  );
};

/**
 * Componentes estilizados
 */
const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export default CheckoutPage;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o componente Checkout é utilizado na página
 * 2. Observe como os dados do pedido são processados
 * 3. Estude como o histórico de pedidos é gerenciado
 * 4. Analise o fluxo de redirecionamento após a finalização do pedido
 */
