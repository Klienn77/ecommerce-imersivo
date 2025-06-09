/**
 * Componente ProductListItem
 * 
 * Item de produto para exibição em formato de lista.
 * 
 * 
 */

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ListItem = styled.div`
  display: flex;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  margin-bottom: 16px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 200px;
  min-width: 200px;
  height: 200px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${ListItem}:hover & {
    transform: scale(1.05);
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  &.new {
    background-color: #3f51b5;
    color: white;
  }
  
  &.sale {
    background-color: #f44336;
    color: white;
  }
  
  &.bestseller {
    background-color: #ff9800;
    color: white;
  }
`;

const ContentContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
`;

const ProductCategory = styled.span`
  font-size: 0.875rem;
  color: #757575;
  margin-bottom: 8px;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CurrentPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
`;

const OriginalPrice = styled.span`
  font-size: 0.875rem;
  color: #757575;
  text-decoration: line-through;
  margin-left: 8px;
`;

const DiscountPercentage = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #f44336;
  margin-left: 8px;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.primary ? '#3f51b5' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#3f51b5'};
  border: ${props => props.primary ? 'none' : '1px solid #3f51b5'};
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#303f9f' : 'rgba(63, 81, 181, 0.08)'};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/**
 * Componente de item de produto para exibição em formato de lista
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.product - Dados do produto
 * @param {string} props.product.id - ID do produto
 * @param {string} props.product.name - Nome do produto
 * @param {string} props.product.category - Categoria do produto
 * @param {string} props.product.description - Descrição do produto
 * @param {number} props.product.price - Preço atual do produto
 * @param {number} [props.product.originalPrice] - Preço original (para produtos em promoção)
 * @param {string} props.product.image - URL da imagem principal do produto
 * @param {Array} [props.product.badges] - Array de badges a serem exibidos (new, sale, bestseller)
 * @param {Function} [props.onAddToCart] - Função chamada ao clicar no botão de adicionar ao carrinho
 */
const ProductListItem = ({
  product,
  onAddToCart,
}) => {
  const {
    id,
    name,
    category,
    description,
    price,
    originalPrice,
    image,
    badges = []
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
  const handleAddToCart = (e) => {
    e.preventDefault(); // Evitar navegação
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <ListItem data-testid="product-list-item">
      <StyledLink to={`/produto/${id}`}>
        <ImageContainer>
          <ProductImage src={image} alt={name} />
          
          {badges.length > 0 && (
            <BadgeContainer>
              {badges.map((badge, index) => (
                <Badge key={index} className={badge.toLowerCase()}>
                  {badge}
                </Badge>
              ))}
            </BadgeContainer>
          )}
        </ImageContainer>
        
        <ContentContainer>
          <ProductCategory>{category}</ProductCategory>
          <ProductName>{name}</ProductName>
          <ProductDescription>{description}</ProductDescription>
          
          <BottomContainer>
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
              <ActionButton 
                onClick={handleAddToCart}
                primary
                aria-label="Adicionar ao carrinho"
              >
                Adicionar
              </ActionButton>
            </ActionContainer>
          </BottomContainer>
        </ContentContainer>
      </StyledLink>
    </ListItem>
  );
};

export default ProductListItem;
