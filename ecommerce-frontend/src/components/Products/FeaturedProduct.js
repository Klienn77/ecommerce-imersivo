/**
 * Componente FeaturedProduct
 * 
 * Componente para exibir um produto em destaque na página inicial.
 * 
 
 */

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Container}:hover & {
    transform: scale(1.05);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${props => props.bgColor || '#f8f9fa'};
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => props.bgColor || '#3f51b5'};
  color: white;
  margin-bottom: 16px;
`;

const ProductName = styled.h2`
  margin: 0 0 16px 0;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const CurrentPrice = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
`;

const OriginalPrice = styled.span`
  font-size: 1.25rem;
  color: #757575;
  text-decoration: line-through;
  margin-left: 12px;
`;

const DiscountPercentage = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #f44336;
  margin-left: 12px;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

/**
 * Componente para exibir um produto em destaque
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.product - Dados do produto em destaque
 * @param {string} props.product.id - ID do produto
 * @param {string} props.product.name - Nome do produto
 * @param {string} props.product.description - Descrição do produto
 * @param {number} props.product.price - Preço atual do produto
 * @param {number} [props.product.originalPrice] - Preço original (para produtos em promoção)
 * @param {string} props.product.image - URL da imagem do produto
 * @param {string} [props.product.badge] - Texto do badge (ex: "Novo", "Destaque")
 * @param {string} [props.product.badgeColor] - Cor de fundo do badge
 * @param {string} [props.bgColor] - Cor de fundo do container de conteúdo
 * @param {Function} [props.onAddToCart] - Função chamada ao clicar no botão de adicionar ao carrinho
 */
const FeaturedProduct = ({
  product,
  bgColor,
  onAddToCart,
}) => {
  const {
    id,
    name,
    description,
    price,
    originalPrice,
    image,
    badge,
    badgeColor,
  } = product;

  // Calcular porcentagem de desconto se houver preço original
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  // Formatar preço para exibição
  const formatPrice = (value) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Manipulador para o botão de adicionar ao carrinho
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Fallback para imagem ausente
const fallbackImage = 'https://vulcabras.vtexassets.com/arquivos/ids/318019-1300-1300?v=638820744866870000&width=1300&height=1300&aspect=true';


  return (
    <Container data-testid="featured-product">
      <ImageContainer>
        <ProductImage src={image || fallbackImage} alt={name} />
      </ImageContainer>
      
      <ContentContainer bgColor={bgColor}>
        {badge && (
          <Badge bgColor={badgeColor}>{badge}</Badge>
        )}
        
        <ProductName>{name}</ProductName>
        <ProductDescription>{description}</ProductDescription>
        
        <PriceContainer>
          <CurrentPrice>{formatPrice(price)}</CurrentPrice>
          {originalPrice && (
            <>
              <OriginalPrice>{formatPrice(originalPrice)}</OriginalPrice>
              <DiscountPercentage>-{discountPercentage}%</DiscountPercentage>
            </>
          )}
        </PriceContainer>
        
        <ActionContainer>
          <Button 
            variant="primary" 
            size="large"
            onClick={handleAddToCart}
          >
            Adicionar ao Carrinho
          </Button>
          
          <StyledLink to={`/produto/${id}`}>
            <Button 
              variant="outline" 
              size="large"
            >
              Ver Detalhes
            </Button>
          </StyledLink>
        </ActionContainer>
      </ContentContainer>
    </Container>
  );
};

export default FeaturedProduct;
