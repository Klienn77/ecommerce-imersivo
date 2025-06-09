/**
 * Componente ProductTabs
 * 
 * Componente de abas para exibir diferentes informações do produto.
 * 
 
 */

import React, { useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  width: 100%;
  margin: 30px 0;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
  overflow-x: auto;
  
  @media (max-width: 576px) {
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const TabButton = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#3f51b5' : 'transparent'};
  color: ${props => props.active ? '#3f51b5' : '#757575'};
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    color: #3f51b5;
  }
  
  &:focus {
    outline: none;
  }
`;

const TabPanel = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
  padding: 10px 0;
`;

const DescriptionContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  
  p {
    margin-bottom: 16px;
  }
  
  ul, ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }
  
  li {
    margin-bottom: 8px;
  }
`;

const SpecificationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
  
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    width: 30%;
    font-weight: 600;
    color: #333;
  }
  
  td {
    color: #555;
  }
`;

const ReviewContainer = styled.div`
  margin-bottom: 24px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewAuthor = styled.span`
  font-weight: 600;
  color: #333;
`;

const ReviewDate = styled.span`
  font-size: 0.875rem;
  color: #757575;
`;

const StarRating = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#ffc107' : '#e0e0e0'};
  font-size: 1.25rem;
  margin-right: 2px;
`;

const ReviewContent = styled.p`
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #555;
  margin: 0;
`;

const NoReviewsMessage = styled.p`
  font-size: 0.9375rem;
  color: #757575;
  font-style: italic;
`;

/**
 * Componente de abas para exibir diferentes informações do produto
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.description - Descrição detalhada do produto em HTML
 * @param {Array} props.specifications - Array de especificações do produto (objetos com name e value)
 * @param {Array} props.reviews - Array de avaliações do produto
 */
const ProductTabs = ({
  description,
  specifications = [],
  reviews = [],
}) => {
  const [activeTab, setActiveTab] = useState('description');

  // Renderizar estrelas para avaliação
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} filled={i <= rating}>
          ★
        </Star>
      );
    }
    return stars;
  };

  // Formatar data para exibição
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <TabsContainer data-testid="product-tabs">
      <TabList role="tablist">
        <TabButton
          type="button"
          role="tab"
          id="tab-description"
          aria-selected={activeTab === 'description'}
          aria-controls="panel-description"
          active={activeTab === 'description'}
          onClick={() => setActiveTab('description')}
        >
          Descrição
        </TabButton>
        
        <TabButton
          type="button"
          role="tab"
          id="tab-specifications"
          aria-selected={activeTab === 'specifications'}
          aria-controls="panel-specifications"
          active={activeTab === 'specifications'}
          onClick={() => setActiveTab('specifications')}
        >
          Especificações
        </TabButton>
        
        <TabButton
          type="button"
          role="tab"
          id="tab-reviews"
          aria-selected={activeTab === 'reviews'}
          aria-controls="panel-reviews"
          active={activeTab === 'reviews'}
          onClick={() => setActiveTab('reviews')}
        >
          Avaliações ({reviews.length})
        </TabButton>
      </TabList>
      
      <TabPanel
        role="tabpanel"
        id="panel-description"
        aria-labelledby="tab-description"
        active={activeTab === 'description'}
      >
        <DescriptionContent dangerouslySetInnerHTML={{ __html: description }} />
      </TabPanel>
      
      <TabPanel
        role="tabpanel"
        id="panel-specifications"
        aria-labelledby="tab-specifications"
        active={activeTab === 'specifications'}
      >
        <SpecificationsTable>
          <tbody>
            {specifications.map((spec, index) => (
              <tr key={index}>
                <th>{spec.name}</th>
                <td>{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </SpecificationsTable>
      </TabPanel>
      
      <TabPanel
        role="tabpanel"
        id="panel-reviews"
        aria-labelledby="tab-reviews"
        active={activeTab === 'reviews'}
      >
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ReviewContainer key={index}>
              <ReviewHeader>
                <ReviewAuthor>{review.author}</ReviewAuthor>
                <ReviewDate>{formatDate(review.date)}</ReviewDate>
              </ReviewHeader>
              <StarRating>
                {renderStars(review.rating)}
              </StarRating>
              <ReviewContent>{review.content}</ReviewContent>
            </ReviewContainer>
          ))
        ) : (
          <NoReviewsMessage>
            Este produto ainda não possui avaliações.
          </NoReviewsMessage>
        )}
      </TabPanel>
    </TabsContainer>
  );
};

export default ProductTabs;
