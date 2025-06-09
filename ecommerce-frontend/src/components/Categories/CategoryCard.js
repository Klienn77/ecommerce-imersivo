/**
 * Componente CategoryCard
 * 
 * Card para exibição de categoria na página inicial.
  
 */

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
`;

const CategoryName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const ProductCount = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
`;

/**
 * Componente de card para exibição de categoria
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.category - Dados da categoria
 * @param {string} props.category.id - ID da categoria
 * @param {string} props.category.name - Nome da categoria
 * @param {string} props.category.slug - Slug da categoria para URLs
 * @param {string} props.image - URL da imagem da categoria (opcional)
 */
const CategoryCard = ({
  category,
  image
}) => {
  // Usar valores padrão para evitar erros se alguma propriedade estiver faltando
  const categoryName = category.name || 'Categoria';
  const categorySlug = category.slug || 'categoria';

const normalizeSlugToFilename = (slug) => {
  return slug
    .normalize('NFD')                         // separa acentos
    .replace(/[\u0300-\u036f]/g, '')          // remove os acentos
    .toLowerCase()
    .replace(/\s+/g, '-')                     // espaços viram hífen
    .replace(/[^a-z0-9\-]/g, '');             // remove tudo que não for letra, número ou hífen
};

  
  // Determinar a URL da imagem - usar a passada como prop ou gerar uma baseada no slug
  const imageUrl = image || `/assets/images/categories/${normalizeSlugToFilename(categorySlug)}.jpg`;

  
  // Número de produtos fixo para demonstração
  const productCount = 12;

  return (
    <Card data-testid="category-card">
      <StyledLink to={`/products/category/${categorySlug}`}>
        <CategoryImage src={imageUrl} alt={categoryName} />
        <Overlay>
          <CategoryName>{categoryName}</CategoryName>
          <ProductCount>{productCount} produtos</ProductCount>
        </Overlay>
      </StyledLink>
    </Card>
  );
};

export default CategoryCard;
