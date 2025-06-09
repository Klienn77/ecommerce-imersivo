/**
 * Página de Produto Individual do E-commerce Imersivo
 * 
 * Esta página é responsável por:
 * 1. Exibir visualização 3D do produto selecionado
 * 2. Permitir personalização em tempo real
 * 3. Mostrar detalhes, especificações e avaliações
 * 4. Facilitar adição ao carrinho
 * 5. Exibir produtos relacionados e recomendações
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Integração de visualização 3D com personalização
 * - Gerenciamento de estado para opções de produto
 * - Interação entre componentes relacionados
 * - Experiência de usuário para conversão
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

// Importação de contextos
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';

// Importação de componentes
import ProductViewer from '../components/ProductViewer/ProductViewer';
import Customizer from '../components/Customizer/Customizer';
import Recommendations from '../components/Recommendations/Recommendations';
import ProductTabs from '../components/Products/ProductTabs';
import ProductGallery from '../components/Products/ProductGallery';
import QuantitySelector from '../components/UI/QuantitySelector';
import { Button } from '../components/UI/Button';
import { Container, Section } from '../components/UI/Layout';
import ProductCard from '../components/Products/ProductCard';
import Toast from '../components/UI/Toast';

/**
 * Componente principal ProductPage
 */
const ProductPage = () => {
  // Obtém o ID do produto da URL
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Contextos
  const { getProductById, getRelatedProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  
  // Usar o hook useTheme do styled-components em vez de useContext(ThemeContext)
  const theme = useTheme();
  
  // Estados
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Efeito para carregar dados do produto
  useEffect(() => {
    setIsLoading(true);
    
    // Simulação de carregamento de dados
    setTimeout(() => {
      const productData = getProductById(parseInt(id));
      
      if (productData) {
        setProduct(productData);
        document.title = `${productData.name} | E-commerce Imersivo`;
        
        // Carregar produtos relacionados
        const related = getRelatedProducts(parseInt(id));
        setRelatedProducts(related);
        
        // Inicializa customização com valores padrão
        if (productData.customizable) {
          setCustomization({
            colors: {
              body: productData.defaultColors?.body || '#3498db',
              sole: productData.defaultColors?.sole || '#2c3e50',
              laces: productData.defaultColors?.laces || '#ecf0f1',
              logo: productData.defaultColors?.logo || '#e74c3c'
            },
            materials: {
              body: productData.defaultMaterials?.body || 'leather',
              sole: productData.defaultMaterials?.sole || 'rubber'
            },
            components: {
              laces: true,
              logo: true
            }
          });
        }
        
        // Seleciona o primeiro tamanho disponível por padrão
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } else {
        // Produto não encontrado
        navigate('/not-found');
      }
      
      setIsLoading(false);
    }, 1000);
    
    // Scroll para o topo ao carregar novo produto
    window.scrollTo(0, 0);
  }, [id, getProductById, getRelatedProducts, navigate]);
  
  /**
   * Manipula mudanças na personalização do produto
   * 
   * @param {Object} newCustomization - Novas opções de personalização
   */
  const handleCustomizationChange = (newCustomization) => {
    setCustomization(newCustomization);
  };
  
  /**
   * Manipula mudança na quantidade
   * 
   * @param {number} newQuantity - Nova quantidade
   */
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };
  
  /**
   * Manipula adição ao carrinho
   */
  const handleAddToCart = () => {
    if (!selectedSize) {
      setToast({
        show: true,
        message: 'Por favor, selecione um tamanho',
        type: 'error'
      });
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      quantity,
      customization: product.customizable ? customization : null
    });
    
    setToast({
      show: true,
      message: 'Produto adicionado ao carrinho',
      type: 'success'
    });
    
    // Esconde o toast após 3 segundos
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 3000);
  };
  
  /**
   * Manipula compra direta
   */
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  // Renderiza estado de carregamento
  if (isLoading) {
    return (
      <Section>
        <Container>
          <ProductSkeleton />
        </Container>
      </Section>
    );
  }
  
  // Renderiza mensagem de erro se o produto não for encontrado
  if (!product) {
    return (
      <Section>
        <Container>
          <ErrorMessage>
            <h2>Produto não encontrado</h2>
            <p>O produto que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => navigate('/products')}>
              Ver Todos os Produtos
            </Button>
          </ErrorMessage>
        </Container>
      </Section>
    );
  }

  return (
    <main>
      {/* Seção principal do produto */}
      <Section>
        <Container>
          <ProductLayout>
            {/* Coluna esquerda: Visualização 3D ou galeria de imagens */}
            <ProductVisualColumn>
              {product.has3DModel ? (
                <ProductViewer 
                  modelPath={product.modelPath}
                  customization={customization}
                  onInteraction={() => {}}
                />
              ) : (
                <ProductGallery images={product.images} />
              )}
            </ProductVisualColumn>
            
            {/* Coluna direita: Informações e ações do produto */}
            <ProductInfoColumn>
              {/* Cabeçalho do produto */}
              <ProductHeader>
                <ProductCategory>{product.category}</ProductCategory>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductPrice>
                  {product.discountPrice ? (
                    <>
                      <OriginalPrice>R$ {product.price.toFixed(2)}</OriginalPrice>
                      <CurrentPrice>R$ {product.discountPrice.toFixed(2)}</CurrentPrice>
                    </>
                  ) : (
                    <CurrentPrice>R$ {product.price.toFixed(2)}</CurrentPrice>
                  )}
                </ProductPrice>
                
                {/* Avaliações */}
                <RatingContainer>
                  <Stars rating={product.rating} />
                  <ReviewCount>{product.reviewCount} avaliações</ReviewCount>
                </RatingContainer>
              </ProductHeader>
              
              {/* Descrição curta */}
              <ShortDescription>
                {product.shortDescription}
              </ShortDescription>
              
              {/* Seleção de tamanho */}
              <SizeSection>
                <SectionLabel>Tamanho</SectionLabel>
                <SizeOptions>
                  {product.sizes.map(size => (
                    <SizeButton
                      key={size}
                      selected={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </SizeButton>
                  ))}
                </SizeOptions>
              </SizeSection>
              
              {/* Seleção de quantidade */}
              <QuantitySection>
                <SectionLabel>Quantidade</SectionLabel>
                <QuantitySelector 
                  quantity={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={10}
                />
              </QuantitySection>
              
              {/* Botões de ação */}
              <ActionButtons>
                <Button 
                  onClick={handleAddToCart}
                  primary
                  large
                >
                  Adicionar ao Carrinho
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  secondary
                  large
                >
                  Comprar Agora
                </Button>
              </ActionButtons>
              
              {/* Informações adicionais */}
              <AdditionalInfo>
                <InfoItem>
                  <InfoIcon type="shipping" />
                  <InfoText>Frete grátis para compras acima de R$ 200</InfoText>
                </InfoItem>
                <InfoItem>
                  <InfoIcon type="return" />
                  <InfoText>30 dias para devolução</InfoText>
                </InfoItem>
                <InfoItem>
                  <InfoIcon type="warranty" />
                  <InfoText>Garantia de 1 ano</InfoText>
                </InfoItem>
              </AdditionalInfo>
            </ProductInfoColumn>
          </ProductLayout>
        </Container>
      </Section>
      
      {/* Seção de personalização (se aplicável) */}
      {product.customizable && (
        <Section background={theme.colors.gray[100]}>
          <Container>
            <SectionTitle>Personalize seu Produto</SectionTitle>
            <Customizer 
              onCustomizationChange={handleCustomizationChange}
              initialCustomization={customization}
              productData={product}
            />
          </Container>
        </Section>
      )}
      
      {/* Seção de detalhes, especificações e avaliações */}
      <Section>
        <Container>
          <ProductTabs 
            product={product}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Container>
      </Section>
      
      {/* Seção de recomendações */}
      <Section background={theme.colors.gray[100]}>
        <Container>
          <Recommendations 
            currentProduct={product}
            viewHistory={[]}
          />
        </Container>
      </Section>
      
      {/* Seção de produtos relacionados */}
      <Section>
        <Container>
          <SectionTitle>Produtos Relacionados</SectionTitle>
          <RelatedProductsGrid>
            {relatedProducts.slice(0, 4).map(relatedProduct => (
              <ProductCard 
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}
          </RelatedProductsGrid>
        </Container>
      </Section>
      
      {/* Toast para notificações */}
      {toast.show && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </main>
  );
};

/**
 * Componente Stars para exibir avaliação
 * 
 * @param {Object} props - Propriedades do componente
 * @param {number} props.rating - Avaliação (0-5)
 */
const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <StarsContainer>
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} type="full" />
      ))}
      {hasHalfStar && <StarIcon type="half" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} type="empty" />
      ))}
    </StarsContainer>
  );
};

/**
 * Componente InfoIcon para ícones informativos
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.type - Tipo de ícone
 */
const InfoIcon = ({ type }) => {
  switch (type) {
    case 'shipping':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17 8h-2V6c0-1.1-.9-2-2-2H3C1.9 4 1 4.9 1 6v8c0 1.1.9 2 2 2h1c0 1.1.9 2 2 2s2-.9 2-2h6c0 1.1.9 2 2 2s2-.9 2-2h1c.6 0 1-.4 1-1v-5l-3-3zM6 16c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm9 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2-3H3V6h10v3h4v4z" />
        </svg>
      );
    case 'return':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 2v2H5c-2.2 0-4 1.8-4 4s1.8 4 4 4h10v2l5-5-5-5zM5 10c-1.1 0-2-.9-2-2s.9-2 2-2h10v4H5z" />
        </svg>
      );
    case 'warranty':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1L3 5v6c0 5.5 3 8 7 10 4-2 7-4.5 7-10V5l-7-4zm5 10c0 4-2 6-5 8-3-2-5-4-5-8V6l5-3 5 3v5z" />
          <path d="M8.5 11.5l4-4 1 1-5 5-3-3 1-1 2 2z" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * Componente StarIcon para estrelas de avaliação
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.type - Tipo de estrela (full, half, empty)
 */
const StarIcon = ({ type }) => {
  switch (type) {
    case 'full':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    case 'half':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#e0e0e0" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    case 'empty':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#e0e0e0">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * Componente ProductSkeleton para estado de carregamento
 */
const ProductSkeleton = () => (
  <SkeletonContainer>
    <SkeletonImage />
    <SkeletonContent>
      <SkeletonTitle />
      <SkeletonPrice />
      <SkeletonText />
      <SkeletonText />
      <SkeletonButtons />
    </SkeletonContent>
  </SkeletonContainer>
);

/**
 * Componentes estilizados
 */
const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.dark};
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProductVisualColumn = styled.div`
  position: sticky;
  top: 20px;
  align-self: start;
  
  @media (max-width: 992px) {
    position: static;
  }
`;

const ProductInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductHeader = styled.div`
  margin-bottom: 20px;
`;

const ProductCategory = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 8px;
`;

const ProductTitle = styled.h1`
  font-size: 32px;
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.dark};
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const CurrentPrice = styled.span`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const OriginalPrice = styled.span`
  font-size: 18px;
  color: ${props => props.theme.colors.gray[600]};
  text-decoration: line-through;
  margin-right: 12px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewCount = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
`;

const ShortDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.gray[700]};
`;

const SizeSection = styled.div`
  margin-bottom: 24px;
`;

const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.dark};
`;

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SizeButton = styled.button`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.gray[300]};
  background-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.selected ? 'white' : props.theme.colors.dark};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.gray[100]};
  }
`;

const QuantitySection = styled.div`
  margin-bottom: 24px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const AdditionalInfo = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.gray[300]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.gray[600]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoText = styled.span`
  margin-left: 8px;
  font-size: 14px;
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  
  h2 {
    margin-bottom: 16px;
    color: ${props => props.theme.colors.dark};
  }
  
  p {
    margin-bottom: 24px;
    color: ${props => props.theme.colors.gray[600]};
  }
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonImage = styled.div`
  height: 500px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: 8px;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SkeletonTitle = styled.div`
  height: 32px;
  width: 70%;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: 4px;
  margin-bottom: 16px;
  animation: pulse 1.5s infinite;
`;

const SkeletonPrice = styled.div`
  height: 28px;
  width: 40%;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: 4px;
  margin-bottom: 24px;
  animation: pulse 1.5s infinite;
`;

const SkeletonText = styled.div`
  height: 16px;
  width: 100%;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: 4px;
  margin-bottom: 16px;
  animation: pulse 1.5s infinite;
`;

const SkeletonButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  
  &::before, &::after {
    content: '';
    height: 48px;
    border-radius: 4px;
    animation: pulse 1.5s infinite;
    background-color: ${props => props.theme.colors.gray[200]};
  }
  
  &::before {
    flex: 2;
  }
  
  &::after {
    flex: 1;
  }
`;

export default ProductPage;
