/**
 * Componente de Checkout Simplificado
 * 
 * Este componente é responsável por:
 * 1. Implementar um fluxo de checkout em etapas progressivas
 * 2. Validar dados do usuário em tempo real
 * 3. Calcular valores de frete, impostos e total
 * 4. Processar o pagamento (simulado)
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Gerenciamento de formulários em React
 * - Validação de dados em tempo real
 * - Fluxos de usuário em múltiplas etapas
 * - Técnicas de UX para redução de abandono
 */

import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

// Contexto fictício para demonstração - será implementado posteriormente
// import { CartContext } from '../../context/CartContext';

/**
 * Componente principal Checkout
 * 
 * Este componente gerencia o fluxo de checkout em etapas progressivas,
 * validando os dados e processando o pagamento.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {function} props.onOrderComplete - Callback para quando o pedido for finalizado
 * @param {Object} props.cartItems - Itens no carrinho (opcional, pode usar contexto)
 */
const Checkout = ({ onOrderComplete, cartItems: propCartItems }) => {
  // Estado para controlar a etapa atual do checkout
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    // Dados pessoais
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Endereço de entrega
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Dados de pagamento
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Estado para armazenar erros de validação
  const [errors, setErrors] = useState({});
  
  // Estado para controlar o método de entrega selecionado
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // Estado para controlar o método de pagamento selecionado
  const [paymentMethod, setPaymentMethod] = useState('credit');
  
  // Estado para controlar o processamento do pagamento
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Contexto do carrinho (fictício para este exemplo)
  // const { cartItems: contextCartItems, clearCart } = useContext(CartContext);
  
  // Usar itens do carrinho do contexto ou das props
  const cartItems = propCartItems || [
    {
      id: 1,
      name: 'Tênis Personalizado',
      price: 299.99,
      quantity: 1,
      image: '/assets/images/custom-shoe.jpg',
      customization: {
        colors: { body: '#3498db', sole: '#2c3e50' }
      }
    }
  ];
  
  /**
   * Calcula o subtotal dos itens no carrinho
   * 
   * @returns {number} - Subtotal calculado
   */
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  /**
   * Calcula o valor do frete com base no método selecionado
   * 
   * @returns {number} - Valor do frete
   */
  const calculateShipping = () => {
    const rates = {
      standard: 15.99,
      express: 29.99,
      pickup: 0
    };
    
    return rates[shippingMethod] || 0;
  };
  
  /**
   * Calcula o valor dos impostos (simulado como 10% do subtotal)
   * 
   * @returns {number} - Valor dos impostos
   */
  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };
  
  /**
   * Calcula o valor total do pedido
   * 
   * @returns {number} - Valor total
   */
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };
  
  /**
   * Manipula mudanças nos campos do formulário
   * 
   * @param {Object} e - Evento de mudança
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro quando o usuário começa a corrigir o campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  /**
   * Valida os dados do formulário para a etapa atual
   * 
   * @returns {boolean} - Se os dados são válidos
   */
  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validação da etapa 1 (Dados pessoais)
    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Nome é obrigatório';
        isValid = false;
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Sobrenome é obrigatório';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email é obrigatório';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefone é obrigatório';
        isValid = false;
      }
    }
    
    // Validação da etapa 2 (Endereço de entrega)
    else if (currentStep === 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'Endereço é obrigatório';
        isValid = false;
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'Cidade é obrigatória';
        isValid = false;
      }
      
      if (!formData.state.trim()) {
        newErrors.state = 'Estado é obrigatório';
        isValid = false;
      }
      
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'CEP é obrigatório';
        isValid = false;
      }
    }
    
    // Validação da etapa 3 (Pagamento)
    else if (currentStep === 3 && paymentMethod === 'credit') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Número do cartão é obrigatório';
        isValid = false;
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Número do cartão inválido';
        isValid = false;
      }
      
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Nome no cartão é obrigatório';
        isValid = false;
      }
      
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Data de validade é obrigatória';
        isValid = false;
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Formato inválido (MM/AA)';
        isValid = false;
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV é obrigatório';
        isValid = false;
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV inválido';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  /**
   * Avança para a próxima etapa do checkout
   */
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  /**
   * Volta para a etapa anterior do checkout
   */
  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  /**
   * Processa o pagamento e finaliza o pedido
   */
  const handleSubmitOrder = async () => {
    if (validateCurrentStep()) {
      setIsProcessing(true);
      
      try {
        // Simulação de processamento de pagamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Limpar carrinho após finalização
        // clearCart();
        
        // Notificar conclusão do pedido
        if (onOrderComplete) {
          onOrderComplete({
            orderId: `ORD-${Date.now()}`,
            total: calculateTotal(),
            items: cartItems,
            shipping: {
              method: shippingMethod,
              address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`
            }
          });
        }
        
        // Avançar para a etapa de confirmação
        setCurrentStep(4);
      } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        setErrors({ payment: 'Erro ao processar pagamento. Tente novamente.' });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  return (
    <CheckoutContainer>
      {/* Indicador de progresso */}
      <ProgressIndicator>
        <ProgressStep active={currentStep >= 1} completed={currentStep > 1}>
          <StepNumber>1</StepNumber>
          <StepLabel>Dados Pessoais</StepLabel>
        </ProgressStep>
        <ProgressLine completed={currentStep > 1} />
        <ProgressStep active={currentStep >= 2} completed={currentStep > 2}>
          <StepNumber>2</StepNumber>
          <StepLabel>Endereço</StepLabel>
        </ProgressStep>
        <ProgressLine completed={currentStep > 2} />
        <ProgressStep active={currentStep >= 3} completed={currentStep > 3}>
          <StepNumber>3</StepNumber>
          <StepLabel>Pagamento</StepLabel>
        </ProgressStep>
        <ProgressLine completed={currentStep > 3} />
        <ProgressStep active={currentStep >= 4} completed={currentStep > 4}>
          <StepNumber>4</StepNumber>
          <StepLabel>Confirmação</StepLabel>
        </ProgressStep>
      </ProgressIndicator>

      <CheckoutContent>
        <FormSection>
          {/* Etapa 1: Dados Pessoais */}
          {currentStep === 1 && (
            <>
              <SectionTitle>Dados Pessoais</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                  />
                  {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                  />
                  {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                  />
                  {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </FormGroup>
              </FormGrid>
            </>
          )}

          {/* Etapa 2: Endereço de Entrega */}
          {currentStep === 2 && (
            <>
              <SectionTitle>Endereço de Entrega</SectionTitle>
              <FormGrid>
                <FormGroup fullWidth>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                  />
                  {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                  />
                  {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                  />
                  {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={errors.zipCode}
                  />
                  {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
                </FormGroup>
              </FormGrid>
              
              <ShippingOptions>
                <SectionSubtitle>Método de Entrega</SectionSubtitle>
                <RadioGroup>
                  <RadioOption>
                    <input
                      type="radio"
                      id="standard"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                    />
                    <RadioLabel htmlFor="standard">
                      <RadioTitle>Entrega Padrão</RadioTitle>
                      <RadioDescription>3-5 dias úteis - R$ 15,99</RadioDescription>
                    </RadioLabel>
                  </RadioOption>
                  
                  <RadioOption>
                    <input
                      type="radio"
                      id="express"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <RadioLabel htmlFor="express">
                      <RadioTitle>Entrega Expressa</RadioTitle>
                      <RadioDescription>1-2 dias úteis - R$ 29,99</RadioDescription>
                    </RadioLabel>
                  </RadioOption>
                  
                  <RadioOption>
                    <input
                      type="radio"
                      id="pickup"
                      name="shipping"
                      value="pickup"
                      checked={shippingMethod === 'pickup'}
                      onChange={() => setShippingMethod('pickup')}
                    />
                    <RadioLabel htmlFor="pickup">
                      <RadioTitle>Retirada na Loja</RadioTitle>
                      <RadioDescription>Disponível em 24h - Grátis</RadioDescription>
                    </RadioLabel>
                  </RadioOption>
                </RadioGroup>
              </ShippingOptions>
            </>
          )}

          {/* Etapa 3: Pagamento */}
          {currentStep === 3 && (
            <>
              <SectionTitle>Método de Pagamento</SectionTitle>
              
              <PaymentOptions>
                <RadioGroup>
                  <RadioOption>
                    <input
                      type="radio"
                      id="credit"
                      name="payment"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={() => setPaymentMethod('credit')}
                    />
                    <RadioLabel htmlFor="credit">
                      <RadioTitle>Cartão de Crédito</RadioTitle>
                    </RadioLabel>
                  </RadioOption>
                  
                  <RadioOption>
                    <input
                      type="radio"
                      id="pix"
                      name="payment"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={() => setPaymentMethod('pix')}
                    />
                    <RadioLabel htmlFor="pix">
                      <RadioTitle>PIX</RadioTitle>
                    </RadioLabel>
                  </RadioOption>
                  
                  <RadioOption>
                    <input
                      type="radio"
                      id="boleto"
                      name="payment"
                      value="boleto"
                      checked={paymentMethod === 'boleto'}
                      onChange={() => setPaymentMethod('boleto')}
                    />
                    <RadioLabel htmlFor="boleto">
                      <RadioTitle>Boleto Bancário</RadioTitle>
                    </RadioLabel>
                  </RadioOption>
                </RadioGroup>
              </PaymentOptions>
              
              {/* Formulário de cartão de crédito */}
              {paymentMethod === 'credit' && (
                <FormGrid>
                  <FormGroup fullWidth>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup fullWidth>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      error={errors.cardName}
                    />
                    {errors.cardName && <ErrorMessage>{errors.cardName}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="expiryDate">Validade</Label>
                    <Input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      error={errors.expiryDate}
                      placeholder="MM/AA"
                    />
                    {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      error={errors.cvv}
                      placeholder="123"
                    />
                    {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
                  </FormGroup>
                </FormGrid>
              )}
              
              {/* Instruções para PIX */}
              {paymentMethod === 'pix' && (
                <PaymentInstructions>
                  <p>Ao finalizar o pedido, você receberá um QR Code para pagamento via PIX.</p>
                  <p>O pagamento é processado instantaneamente e seu pedido será enviado assim que confirmado.</p>
                </PaymentInstructions>
              )}
              
              {/* Instruções para Boleto */}
              {paymentMethod === 'boleto' && (
                <PaymentInstructions>
                  <p>Ao finalizar o pedido, você receberá um boleto para pagamento.</p>
                  <p>O prazo de compensação é de até 3 dias úteis e seu pedido será enviado após a confirmação.</p>
                </PaymentInstructions>
              )}
              
              {errors.payment && <ErrorMessage>{errors.payment}</ErrorMessage>}
            </>
          )}

          {/* Etapa 4: Confirmação */}
          {currentStep === 4 && (
            <ConfirmationSection>
              <ConfirmationIcon>✓</ConfirmationIcon>
              <ConfirmationTitle>Pedido Confirmado!</ConfirmationTitle>
              <ConfirmationMessage>
                Seu pedido foi processado com sucesso. Você receberá um email de confirmação em breve.
              </ConfirmationMessage>
              <OrderDetails>
                <OrderNumber>Pedido #ORD-{Date.now()}</OrderNumber>
                <OrderSummary>
                  <p><strong>Data:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Total:</strong> R$ {calculateTotal().toFixed(2)}</p>
                  <p><strong>Método de Pagamento:</strong> {getPaymentMethodName(paymentMethod)}</p>
                  <p><strong>Método de Entrega:</strong> {getShippingMethodName(shippingMethod)}</p>
                </OrderSummary>
              </OrderDetails>
            </ConfirmationSection>
          )}
        </FormSection>

        <OrderSummarySection>
          <SectionTitle>Resumo do Pedido</SectionTitle>
          
          {/* Lista de itens */}
          <CartItemsList>
            {cartItems.map(item => (
              <CartItem key={item.id}>
                <CartItemImage>
                  <img src={item.image || '/assets/images/placeholder.jpg'} alt={item.name} />
                </CartItemImage>
                <CartItemDetails>
                  <CartItemName>{item.name}</CartItemName>
                  <CartItemPrice>R$ {item.price.toFixed(2)}</CartItemPrice>
                  <CartItemQuantity>Qtd: {item.quantity}</CartItemQuantity>
                </CartItemDetails>
              </CartItem>
            ))}
          </CartItemsList>
          
          {/* Resumo de valores */}
          <PriceSummary>
            <PriceRow>
              <span>Subtotal</span>
              <span>R$ {calculateSubtotal().toFixed(2)}</span>
            </PriceRow>
            <PriceRow>
              <span>Frete</span>
              <span>R$ {calculateShipping().toFixed(2)}</span>
            </PriceRow>
            <PriceRow>
              <span>Impostos</span>
              <span>R$ {calculateTax().toFixed(2)}</span>
            </PriceRow>
            <PriceRowTotal>
              <span>Total</span>
              <span>R$ {calculateTotal().toFixed(2)}</span>
            </PriceRowTotal>
          </PriceSummary>
        </OrderSummarySection>
      </CheckoutContent>

      {/* Botões de navegação */}
      {currentStep < 4 && (
        <ButtonsContainer>
          {currentStep > 1 && (
            <BackButton onClick={handlePreviousStep}>
              Voltar
            </BackButton>
          )}
          
          {currentStep < 3 ? (
            <NextButton onClick={handleNextStep}>
              Continuar
            </NextButton>
          ) : (
            <SubmitButton 
              onClick={handleSubmitOrder} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Finalizar Compra'}
            </SubmitButton>
          )}
        </ButtonsContainer>
      )}
      
      {currentStep === 4 && (
        <ButtonsContainer>
          <NextButton onClick={() => window.location.href = '/'}>
            Continuar Comprando
          </NextButton>
        </ButtonsContainer>
      )}
    </CheckoutContainer>
  );
};

/**
 * Funções auxiliares
 */

// Retorna o nome do método de pagamento
const getPaymentMethodName = (method) => {
  const methods = {
    credit: 'Cartão de Crédito',
    pix: 'PIX',
    boleto: 'Boleto Bancário'
  };
  
  return methods[method] || method;
};

// Retorna o nome do método de entrega
const getShippingMethodName = (method) => {
  const methods = {
    standard: 'Entrega Padrão (3-5 dias úteis)',
    express: 'Entrega Expressa (1-2 dias úteis)',
    pickup: 'Retirada na Loja'
  };
  
  return methods[method] || method;
};

/**
 * Componentes estilizados com styled-components
 */
const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 0 40px;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#3498db' : '#e0e0e0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition: background-color 0.3s ease;
`;

const StepLabel = styled.div`
  font-size: 14px;
  color: ${props => props.active ? '#333' : '#999'};
  transition: color 0.3s ease;
`;

const ProgressLine = styled.div`
  flex: 1;
  height: 3px;
  background-color: ${props => props.completed ? '#3498db' : '#e0e0e0'};
  margin: 0 10px;
  position: relative;
  top: -15px;
  z-index: 0;
  transition: background-color 0.3s ease;
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const OrderSummarySection = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  height: fit-content;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 0 0 20px 0;
  color: #333;
`;

const SectionSubtitle = styled.h3`
  font-size: 16px;
  margin: 0 0 15px 0;
  color: #333;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  grid-column: ${props => props.fullWidth ? 'span 2' : 'span 1'};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
`;

const ShippingOptions = styled.div`
  margin-bottom: 30px;
`;

const PaymentOptions = styled.div`
  margin-bottom: 30px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: flex-start;
  
  input {
    margin-top: 3px;
  }
`;

const RadioLabel = styled.label`
  margin-left: 10px;
  cursor: pointer;
`;

const RadioTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

const RadioDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 3px;
`;

const PaymentInstructions = styled.div`
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  
  p {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #555;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CartItemsList = styled.div`
  margin-bottom: 20px;
`;

const CartItem = styled.div`
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CartItemDetails = styled.div`
  flex: 1;
`;

const CartItemName = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const CartItemPrice = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const CartItemQuantity = styled.div`
  font-size: 14px;
  color: #666;
`;

const PriceSummary = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

const PriceRowTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-weight: bold;
  font-size: 18px;
  color: #333;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const NextButton = styled(Button)`
  background-color: #3498db;
  color: white;
  border: none;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SubmitButton = styled(NextButton)`
  background-color: #2ecc71;
  
  &:hover {
    background-color: #27ae60;
  }
`;

const ConfirmationSection = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const ConfirmationIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: #2ecc71;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
`;

const ConfirmationTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
`;

const ConfirmationMessage = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
`;

const OrderDetails = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const OrderNumber = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const OrderSummary = styled.div`
  text-align: left;
  
  p {
    margin: 8px 0;
    font-size: 14px;
    color: #555;
  }
`;

export default Checkout;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o fluxo de checkout é dividido em etapas progressivas
 * 2. Entenda como a validação de formulários é implementada em tempo real
 * 3. Observe como os diferentes métodos de pagamento são gerenciados
 * 4. Estude como os cálculos de preço, frete e impostos são realizados
 * 
 * DESAFIOS PARA PRATICAR:
 * 
 * 1. Adicione validação de CEP com preenchimento automático de endereço
 * 2. Implemente um sistema de cupons de desconto
 * 3. Adicione animações de transição entre as etapas
 * 4. Crie uma versão mobile-first do checkout
 */
