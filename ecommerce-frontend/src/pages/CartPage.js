/**
 * Página de Carrinho do E-commerce Imersivo
 * 
 * Esta página é responsável por:
 * 1. Exibir os produtos adicionados ao carrinho
 * 2. Permitir ajustes de quantidade e remoção de itens
 * 3. Calcular subtotal, frete e total
 * 4. Fornecer opções para continuar comprando ou finalizar compra
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Gerenciamento de estado do carrinho
 * - Cálculos dinâmicos de valores
 * - Interações de usuário para modificação de itens
 * - Navegação entre fluxos de compra
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

// Importação de contextos
import { CartContext } from '../context/CartContext';

// Importação de componentes
import { Container, Section, SectionTitle } from '../components/UI/Layout';
import { Button } from '../components/UI/Button';
import QuantitySelector from '../components/UI/QuantitySelector';
import Recommendations from '../components/Recommendations/Recommendations';

/**
 * Componente principal CartPage
 */
const CartPage = () => {
  // Contextos
  const { cart, updateQuantity, removeItem, clearCart, calculateSubtotal, calculateShipping, calculateTotal } = useContext(CartContext);
  const theme = useTheme();
  
  // Estado para controlar cupom de desconto
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Estado para controlar CEP e cálculo de frete
  const [zipCode, setZipCode] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  
  // Navegação
  const navigate = useNavigate();
  
  // Efeito para atualizar título da página
  useEffect(() => {
    document.title = 'Carrinho de Compras | E-commerce Imersivo';
  }, []);
  
  /**
   * Manipula aplicação de cupom de desconto
   */
  const handleApplyCoupon = () => {
    // Simulação de validação de cupom
    if (couponCode.toUpperCase() === 'DESCONTO20') {
      const discount = calculateSubtotal() * 0.2; // 20% de desconto
      setCouponDiscount(discount);
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
      alert('Cupom inválido ou expirado');
    }
  };
  
  /**
   * Manipula cálculo de frete
   */
  const handleCalculateShipping = () => {
    // Simulação de cálculo de frete
    if (zipCode.length === 8) {
      setShippingCalculated(true);
    } else {
      alert('Por favor, insira um CEP válido');
    }
  };
  
  /**
   * Manipula navegação para checkout
   */
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };
  
  // Renderiza página vazia se o carrinho estiver vazio
  if (cart.length === 0) {
    return (
      <main>
        <Section>
          <Container>
            <EmptyCartContainer>
              <EmptyCartIcon />
              <h2>Seu carrinho está vazio</h2>
              <p>Parece que você ainda não adicionou nenhum produto ao seu carrinho.</p>
              <Button as={Link} to="/products" primary large>
                Continuar Comprando
              </Button>
            </EmptyCartContainer>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Section>
        <Container>
          <SectionTitle>Seu Carrinho</SectionTitle>
          
          <CartLayout>
            {/* Coluna de itens do carrinho */}
            <CartItemsColumn>
              <CartHeader>
                <HeaderItem flex={3}>Produto</HeaderItem>
                <HeaderItem flex={1}>Preço</HeaderItem>
                <HeaderItem flex={1}>Quantidade</HeaderItem>
                <HeaderItem flex={1}>Total</HeaderItem>
                <HeaderItem flex={0.5}></HeaderItem>
              </CartHeader>
              
              {/* Lista de itens */}
              <CartItemsList>
                {cart.map(item => (
                  <CartItem key={`${item.id}-${item.size}`}>
                    <ItemInfo flex={3}>
                      <ItemImage>
                        <img src={item.image || '/assets/images/placeholder.jpg'} alt={item.name} />
                      </ItemImage>
                      <ItemDetails>
                        <ItemName>{item.name}</ItemName>
                        {item.size && <ItemMeta>Tamanho: {item.size}</ItemMeta>}
                        {item.customization && (
                          <ItemMeta>Personalizado: <ColorSwatch color={item.customization.colors.body} /></ItemMeta>
                        )}
                      </ItemDetails>
                    </ItemInfo>
                    <ItemPrice flex={1}>
                      R$ {item.price.toFixed(2)}
                    </ItemPrice>
                    <ItemQuantity flex={1}>
                      <QuantitySelector 
                        quantity={item.quantity}
                        onChange={(newQuantity) => updateQuantity(item.id, item.size, newQuantity)}
                        min={1}
                        max={10}
                      />
                    </ItemQuantity>
                    <ItemTotal flex={1}>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </ItemTotal>
                    <ItemRemove flex={0.5}>
                      <RemoveButton onClick={() => removeItem(item.id, item.size)}>
                        <RemoveIcon />
                      </RemoveButton>
                    </ItemRemove>
                  </CartItem>
                ))}
              </CartItemsList>
              
              {/* Ações do carrinho */}
              <CartActions>
                <Button as={Link} to="/products">
                  Continuar Comprando
                </Button>
                <Button onClick={clearCart} variant="outline">
                  Limpar Carrinho
                </Button>
              </CartActions>
            </CartItemsColumn>
            
            {/* Coluna de resumo e checkout */}
            <CartSummaryColumn>
              <SummaryCard>
                <SummaryTitle>Resumo do Pedido</SummaryTitle>
                
                {/* Cupom de desconto */}
                <CouponSection>
                  <CouponInput
                    type="text"
                    placeholder="Cupom de desconto"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                    variant={couponApplied ? "success" : "primary"}
                  >
                    {couponApplied ? 'Aplicado' : 'Aplicar'}
                  </Button>
                </CouponSection>
                
                {/* Cálculo de frete */}
                <ShippingSection>
                  <CouponInput
                    type="text"
                    placeholder="CEP"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                  />
                  <Button 
                    onClick={handleCalculateShipping}
                    disabled={zipCode.length !== 8}
                  >
                    Calcular
                  </Button>
                </ShippingSection>
                
                {/* Valores */}
                <SummaryValues>
                  <SummaryRow>
                    <span>Subtotal</span>
                    <span>R$ {calculateSubtotal().toFixed(2)}</span>
                  </SummaryRow>
                  
                  {couponApplied && (
                    <SummaryRow highlight="discount">
                      <span>Desconto</span>
                      <span>-R$ {couponDiscount.toFixed(2)}</span>
                    </SummaryRow>
                  )}
                  
                  <SummaryRow>
                    <span>Frete</span>
                    <span>
                      {shippingCalculated 
                        ? `R$ ${calculateShipping().toFixed(2)}` 
                        : 'Calcule o frete'}
                    </span>
                  </SummaryRow>
                  
                  <SummaryTotal>
                    <span>Total</span>
                    <span>
                      R$ {(calculateTotal() - couponDiscount).toFixed(2)}
                    </span>
                  </SummaryTotal>
                </SummaryValues>
                
                {/* Botão de checkout */}
                <CheckoutButton 
                  onClick={handleProceedToCheckout}
                  primary
                  large
                  disabled={!shippingCalculated}
                >
                  Finalizar Compra
                </CheckoutButton>
                
                {/* Métodos de pagamento */}
                <PaymentMethods>
                  <PaymentTitle>Aceitamos</PaymentTitle>
                  <PaymentIcons>
                    <PaymentIcon type="visa" />
                    <PaymentIcon type="mastercard" />
                    <PaymentIcon type="amex" />
                    <PaymentIcon type="pix" />
                  </PaymentIcons>
                </PaymentMethods>
              </SummaryCard>
            </CartSummaryColumn>
          </CartLayout>
        </Container>
      </Section>
      
      {/* Seção de recomendações */}
      <Section background={theme.mode === 'dark' ? theme.colors.gray[800] : theme.colors.gray[100]}>
        <Container>
          <Recommendations 
            currentProduct={cart[0]}
            viewHistory={cart}
          />
        </Container>
      </Section>
    </main>
  );
};

/**
 * Componente EmptyCartIcon
 */
const EmptyCartIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

/**
 * Componente RemoveIcon
 */
const RemoveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Componente PaymentIcon
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.type - Tipo de ícone de pagamento
 */
const PaymentIcon = ({ type }) => {
  switch (type) {
    case 'visa':
      return <PaymentIconImage src="/assets/images/payment/visa.svg" alt="Visa" />;
    case 'mastercard':
      return <PaymentIconImage src="/assets/images/payment/mastercard.svg" alt="Mastercard" />;
    case 'amex':
      return <PaymentIconImage src="/assets/images/payment/amex.svg" alt="American Express" />;
    case 'pix':
      return <PaymentIconImage src="/assets/images/payment/pix.svg" alt="PIX" />;
    default:
      return null;
  }
};

/**
 * Componentes estilizados
 */
const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  h2 {
    margin: 20px 0 10px;
    font-size: 24px;
  }
  
  p {
    margin-bottom: 30px;
    color: ${props => props.theme.colors.gray[600]};
  }
  
  svg {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartSummaryColumn = styled.div``;

const CartHeader = styled.div`
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[300]};
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderItem = styled.div`
  flex: ${props => props.flex};
  padding: 0 10px;
`;

const CartItemsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[300]};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    position: relative;
    padding-bottom: 60px;
  }
`;

const ItemInfo = styled.div`
  flex: ${props => props.flex};
  display: flex;
  align-items: center;
  padding: 0 10px;
  
  @media (max-width: 768px) {
    flex: 1 0 100%;
    margin-bottom: 15px;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ItemMeta = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ColorSwatch = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  margin-left: 5px;
`;

const ItemPrice = styled.div`
  flex: ${props => props.flex};
  padding: 0 10px;
  
  @media (max-width: 768px) {
    flex: 1;
    &::before {
      content: 'Preço: ';
      font-size: 14px;
      color: ${props => props.theme.colors.gray[600]};
    }
  }
`;

const ItemQuantity = styled.div`
  flex: ${props => props.flex};
  padding: 0 10px;
  
  @media (max-width: 768px) {
    flex: 1;
    &::before {
      content: 'Qtd: ';
      font-size: 14px;
      color: ${props => props.theme.colors.gray[600]};
    }
  }
`;

const ItemTotal = styled.div`
  flex: ${props => props.flex};
  padding: 0 10px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    flex: 1;
    &::before {
      content: 'Total: ';
      font-size: 14px;
      color: ${props => props.theme.colors.gray[600]};
    }
  }
`;

const ItemRemove = styled.div`
  flex: ${props => props.flex};
  padding: 0 10px;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    position: absolute;
    bottom: 15px;
    right: 10px;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[500]};
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.danger};
    background-color: rgba(231, 76, 60, 0.1);
  }
`;

const CartActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SummaryCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.md};
  padding: 20px;
`;

const SummaryTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 20px 0;
`;

const CouponSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const ShippingSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const CouponInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const SummaryValues = styled.div`
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${props => {
    if (props.highlight === 'discount') return props.theme.colors.success;
    return props.theme.colors.dark;
  }};
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme.colors.gray[300]};
  font-size: 18px;
  font-weight: 500;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-bottom: 20px;
`;

const PaymentMethods = styled.div`
  margin-top: 20px;
`;

const PaymentTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 10px;
`;

const PaymentIcons = styled.div`
  display: flex;
  gap: 10px;
`;

const PaymentIconImage = styled.img`
  height: 24px;
  width: auto;
`;

export default CartPage;
