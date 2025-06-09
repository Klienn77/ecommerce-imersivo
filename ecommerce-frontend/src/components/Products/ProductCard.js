/**
 * Componente ProductCard
 * 
 * Este componente exibe um card de produto com imagem, nome, preço e outras informações.
 * Foi corrigido para garantir que as imagens sejam carregadas corretamente e mantidas em proporção.
 */
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Estilos do componente
const Card = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  z-index: 2; 
`;

const CardContent = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const ProductBrand = styled.p`
  margin: 0 0 8px;
  font-size: 0.8rem;
  color: #777;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
`;

const Rating = styled.div`
  display: flex;
  color: #f39c12;
`;

const ReviewCount = styled.span`
  font-size: 0.8rem;
  color: #777;
  margin-left: 4px;
`;

/**
 * Componente ProductCard
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.product - Dados do produto a ser exibido
 */
const ProductCard = ({ product }) => {
  // Verificar se o produto existe
  if (!product) {
    return null;
  }

  // Função para lidar com erros de carregamento de imagem
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x400?text=Produto';
  };

  // Obter a primeira imagem do produto ou usar fallback
  const fallbackImage= product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://placehold.co/400x400?text=Produto';

  return (
    <Card>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ImageContainer>
          <ProductImage 
            src={fallbackImage} 
            alt={product.name} 
            onError={handleImageError}
            loading="lazy" // Adiciona carregamento lazy para melhor performance
          />

         {/* Garante que product.discount esteja definido antes de exibir o selo de desconto */}
        {product.discount && product.discount > 0 && (
         <DiscountBadge>-{product.discount}%</DiscountBadge>  
        )}

        </ImageContainer>
        <CardContent>
          <ProductBrand>{product.brand}</ProductBrand>
          <ProductName>{product.name}</ProductName>
          <RatingContainer>
            <Rating>
              {[...Array(5)].map((_, i) => (
            <span key={i}>
              {i < Math.floor(product.rating || 0) ? '★' : '☆'}
            </span>
          ))}
          <ReviewCount>({product.reviews || 0})</ReviewCount>
            </Rating>
          
          </RatingContainer>
          <PriceContainer>
            <Price>R$ {Number(product.price || 0).toFixed(2)}</Price>
         {product.originalPrice && (
           <OriginalPrice>R$ {Number(product.originalPrice).toFixed(2)}</OriginalPrice>
         )}
          </PriceContainer>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
