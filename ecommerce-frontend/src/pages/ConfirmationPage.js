/**
 * Página de Confirmação de Pedido do E-commerce Imersivo
 * 
 * Esta página é responsável por:
 * 1. Exibir confirmação e detalhes do pedido finalizado
 * 2. Fornecer informações de rastreamento e próximos passos
 * 3. Sugerir produtos complementares
 * 4. Oferecer opções para continuar navegando
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Exibição de dados dinâmicos de pedido
 * - Integração com histórico de pedidos
 * - Recomendações personalizadas pós-compra
 * - Experiência de usuário para retenção
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

// Importação de contextos
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

// Importação de componentes
import { Container, Section, SectionTitle } from '../components/UI/Layout';
import { Button } from '../components/UI/Button';
import Recommendations from '../components/Recommendations/Recommendations';
import ProductCard from '../components/Products/ProductCard';

/**
 * Componente principal ConfirmationPage
 */
const ConfirmationPage = () => {
  // Obtém o ID do pedido da URL
  const { orderId } = useParams();
  
  // Contextos
  const { getOrderById, getRecentOrders } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  
  // Estados
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Efeito para carregar dados do pedido
  useEffect(() => {
    setIsLoading(true);
    
    // Simulação de carregamento de dados
    setTimeout(() => {
      const orderData = getOrderById(orderId);
      
      if (orderData) {
        setOrder(orderData);
        document.title = `Pedido #${orderId} Confirmado | E-commerce Imersivo`;
        
        // Carrega pedidos recentes para recomendações
        setRecentOrders(getRecentOrders(3));
      }
      
      setIsLoading(false);
    }, 1000);
  }, [orderId, getOrderById, getRecentOrders]);
  
  // Renderiza estado de carregamento
  if (isLoading) {
    return (
      <Section>
        <Container>
          <LoadingSkeleton />
        </Container>
      </Section>
    );
  }
  
  // Renderiza mensagem de erro se o pedido não for encontrado
  if (!order) {
    return (
      <Section>
        <Container>
          <ErrorMessage>
            <h2>Pedido não encontrado</h2>
            <p>O pedido que você está procurando não existe ou foi removido.</p>
            <Button as={Link} to="/account/orders">
              Ver Meus Pedidos
            </Button>
          </ErrorMessage>
        </Container>
      </Section>
    );
  }

  return (
    <main>
      <Section>
        <Container>
          <ConfirmationHeader>
            <SuccessIcon />
            <h1>Pedido Confirmado!</h1>
            <p>Seu pedido foi recebido e está sendo processado.</p>
          </ConfirmationHeader>
          
          <OrderDetailsCard>
            <OrderDetailsHeader>
              <OrderNumber>Pedido #{order.orderId}</OrderNumber>
              <OrderDate>
                {new Date(order.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </OrderDate>
            </OrderDetailsHeader>
            
            <OrderStatusBar>
              <StatusStep completed={true}>
                <StatusIcon type="confirmed" />
                <StatusLabel>Confirmado</StatusLabel>
              </StatusStep>
              <StatusLine completed={true} />
              <StatusStep completed={order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'}>
                <StatusIcon type="processing" />
                <StatusLabel>Processando</StatusLabel>
              </StatusStep>
              <StatusLine completed={order.status === 'shipped' || order.status === 'delivered'} />
              <StatusStep completed={order.status === 'shipped' || order.status === 'delivered'}>
                <StatusIcon type="shipped" />
                <StatusLabel>Enviado</StatusLabel>
              </StatusStep>
              <StatusLine completed={order.status === 'delivered'} />
              <StatusStep completed={order.status === 'delivered'}>
                <StatusIcon type="delivered" />
                <StatusLabel>Entregue</StatusLabel>
              </StatusStep>
            </OrderStatusBar>
            
            <OrderSection>
              <OrderSectionTitle>Itens do Pedido</OrderSectionTitle>
              <OrderItemsList>
                {order.items.map((item, index) => (
                  <OrderItem key={`${item.id}-${index}`}>
                    <OrderItemImage>
                      <img src={item.image || '/assets/images/placeholder.jpg'} alt={item.name} />
                    </OrderItemImage>
                    <OrderItemDetails>
                      <OrderItemName>{item.name}</OrderItemName>
                      {item.size && <OrderItemMeta>Tamanho: {item.size}</OrderItemMeta>}
                      {item.customization && (
                        <OrderItemMeta>Personalizado: <ColorSwatch color={item.customization.colors.body} /></OrderItemMeta>
                      )}
                      <OrderItemQuantity>Quantidade: {item.quantity}</OrderItemQuantity>
                    </OrderItemDetails>
                    <OrderItemPrice>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </OrderItemPrice>
                  </OrderItem>
                ))}
              </OrderItemsList>
            </OrderSection>
            
            <OrderInfoGrid>
              <OrderInfoSection>
                <OrderSectionTitle>Endereço de Entrega</OrderSectionTitle>
                <AddressDetails>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}, {order.shipping.state}</p>
                  <p>{order.shipping.zipCode}</p>
                </AddressDetails>
              </OrderInfoSection>
              
              <OrderInfoSection>
                <OrderSectionTitle>Método de Entrega</OrderSectionTitle>
                <ShippingDetails>
                  <p>{getShippingMethodName(order.shipping.method)}</p>
                  <p>Prazo estimado: {getShippingEstimate(order.shipping.method)}</p>
                </ShippingDetails>
              </OrderInfoSection>
              
              <OrderInfoSection>
                <OrderSectionTitle>Método de Pagamento</OrderSectionTitle>
                <PaymentDetails>
                  <p>{getPaymentMethodName(order.payment.method)}</p>
                  {order.payment.method === 'credit' && (
                    <p>Cartão final {order.payment.cardLastFour}</p>
                  )}
                </PaymentDetails>
              </OrderInfoSection>
              
              <OrderInfoSection>
                <OrderSectionTitle>Resumo de Valores</OrderSectionTitle>
                <OrderSummary>
                  <SummaryRow>
                    <span>Subtotal</span>
                    <span>R$ {order.summary.subtotal.toFixed(2)}</span>
                  </SummaryRow>
                  {order.summary.discount > 0 && (
                    <SummaryRow>
                      <span>Desconto</span>
                      <span>-R$ {order.summary.discount.toFixed(2)}</span>
                    </SummaryRow>
                  )}
                  <SummaryRow>
                    <span>Frete</span>
                    <span>R$ {order.summary.shipping.toFixed(2)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Impostos</span>
                    <span>R$ {order.summary.tax.toFixed(2)}</span>
                  </SummaryRow>
                  <SummaryTotal>
                    <span>Total</span>
                    <span>R$ {order.summary.total.toFixed(2)}</span>
                  </SummaryTotal>
                </OrderSummary>
              </OrderInfoSection>
            </OrderInfoGrid>
          </OrderDetailsCard>
          
          <ActionButtons>
            <Button as={Link} to="/account/orders" variant="outline">
              Ver Meus Pedidos
            </Button>
            <Button as={Link} to="/products" primary>
              Continuar Comprando
            </Button>
          </ActionButtons>
        </Container>
      </Section>
      
      {/* Seção de recomendações */}
      <Section background={theme === 'dark' ? '#2d3436' : '#f5f9fc'}>
        <Container>
          <SectionTitle>Recomendações Baseadas em Sua Compra</SectionTitle>
          <RecommendationsGrid>
            {recentOrders.flatMap(order => order.items).slice(0, 4).map((item, index) => (
              <ProductCard 
                key={`rec-${item.id}-${index}`}
                product={{
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  images: [item.image],
                  rating: 4.5,
                  reviewCount: 12
                }}
              />
            ))}
          </RecommendationsGrid>
        </Container>
      </Section>
    </main>
  );
};

/**
 * Funções auxiliares
 */

/**
 * Retorna o nome do método de entrega
 * 
 * @param {string} method - Código do método de entrega
 * @returns {string} - Nome do método de entrega
 */
const getShippingMethodName = (method) => {
  const methods = {
    standard: 'Entrega Padrão',
    express: 'Entrega Expressa',
    pickup: 'Retirada na Loja'
  };
  
  return methods[method] || method;
};

/**
 * Retorna o prazo estimado de entrega
 * 
 * @param {string} method - Código do método de entrega
 * @returns {string} - Prazo estimado
 */
const getShippingEstimate = (method) => {
  const estimates = {
    standard: '3-5 dias úteis',
    express: '1-2 dias úteis',
    pickup: 'Disponível em 24h'
  };
  
  return estimates[method] || 'Prazo a confirmar';
};

/**
 * Retorna o nome do método de pagamento
 * 
 * @param {string} method - Código do método de pagamento
 * @returns {string} - Nome do método de pagamento
 */
const getPaymentMethodName = (method) => {
  const methods = {
    credit: 'Cartão de Crédito',
    pix: 'PIX',
    boleto: 'Boleto Bancário'
  };
  
  return methods[method] || method;
};

/**
 * Componente SuccessIcon
 */
const SuccessIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/**
 * Componente StatusIcon
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.type - Tipo de ícone de status
 */
const StatusIcon = ({ type }) => {
  switch (type) {
    case 'confirmed':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      );
    case 'processing':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" />
        </svg>
      );
    case 'shipped':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </svg>
      );
    case 'delivered':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * Componentes estilizados
 */
const ConfirmationHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  svg {
    color: var(--secondary);
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 18px;
    color: var(--text-light);
  }
`;

const OrderDetailsCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const OrderDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const OrderNumber = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const OrderDate = styled.div`
  font-size: 16px;
  color: var(--text-light);
`;

const OrderStatusBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const StatusStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  
  svg {
    color: ${props => props.completed ? 'var(--secondary)' : 'var(--text-light)'};
    margin-bottom: 8px;
  }
`;

const StatusLabel = styled.div`
  font-size: 12px;
  text-align: center;
`;

const StatusLine = styled.div`
  flex: 1;
  height: 3px;
  background-color: ${props => props.completed ? 'var(--secondary)' : 'var(--border)'};
`;

const OrderSection = styled.div`
  margin-bottom: 30px;
`;

const OrderSectionTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 15px 0;
`;

const OrderItemsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const OrderItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const OrderItemDetails = styled.div`
  flex: 1;
`;

const OrderItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const OrderItemMeta = styled.div`
  font-size: 14px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ColorSwatch = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
  margin-left: 5px;
`;

const OrderItemQuantity = styled.div`
  font-size: 14px;
  color: var(--text-light);
`;

const OrderItemPrice = styled.div`
  font-weight: 500;
  margin-left: 20px;
  
  @media (max-width: 576px) {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OrderInfoSection = styled.div``;

const AddressDetails = styled.div`
  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const ShippingDetails = styled.div`
  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const PaymentDetails = styled.div`
  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const OrderSummary = styled.div``;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border);
  font-size: 16px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`;

const LoadingSkeleton = styled.div`
  height: 600px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 0;
  
  h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  p {
    color: var(--text-light);
    margin-bottom: 24px;
  }
`;

export default ConfirmationPage;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como os dados do pedido são exibidos
 * 2. Observe como o status do pedido é visualizado
 * 3. Estude como as recomendações pós-compra são implementadas
 * 4. Analise a estrutura de layout para diferentes tamanhos de tela
 */
