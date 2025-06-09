/**
 * Componente Pagination
 * 
 * Componente de paginação para navegação entre páginas de resultados.
 * 
 
 */

import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  margin: 0 4px;
  padding: 0 6px;
  border-radius: 16px;
  border: 1px solid ${props => props.active ? '#3f51b5' : '#e0e0e0'};
  background-color: ${props => props.active ? '#3f51b5' : 'transparent'};
  color: ${props => props.active ? 'white' : 'inherit'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#3f51b5' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EllipsisIndicator = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  margin: 0 4px;
`;

/**
 * Componente de paginação para navegação entre páginas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {number} props.currentPage - Página atual
 * @param {number} props.totalPages - Número total de páginas
 * @param {Function} props.onPageChange - Função chamada quando a página é alterada
 * @param {number} [props.siblingCount=1] - Número de páginas vizinhas a mostrar
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  // Não renderizar se houver apenas uma página
  if (totalPages <= 1) return null;

  // Função para gerar o array de páginas a serem exibidas
  const generatePaginationItems = () => {
    const items = [];
    
    // Sempre mostrar a primeira página
    items.push(1);
    
    // Calcular o intervalo de páginas a serem mostradas
    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);
    
    // Adicionar elipse à esquerda se necessário
    if (leftSibling > 2) {
      items.push('left-ellipsis');
    } else if (leftSibling === 2) {
      items.push(2);
    }
    
    // Adicionar páginas do intervalo
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(i);
      }
    }
    
    // Adicionar elipse à direita se necessário
    if (rightSibling < totalPages - 1) {
      items.push('right-ellipsis');
    } else if (rightSibling === totalPages - 1) {
      items.push(totalPages - 1);
    }
    
    // Sempre mostrar a última página
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };

  const paginationItems = generatePaginationItems();

  return (
    <PaginationContainer data-testid="pagination">
      {/* Botão Anterior */}
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        &lt;
      </PageButton>
      
      {/* Páginas */}
      {paginationItems.map((item, index) => {
        if (item === 'left-ellipsis' || item === 'right-ellipsis') {
          return <EllipsisIndicator key={item}>...</EllipsisIndicator>;
        }
        
        return (
          <PageButton
            key={index}
            active={currentPage === item}
            onClick={() => onPageChange(item)}
            aria-label={`Página ${item}`}
            aria-current={currentPage === item ? 'page' : undefined}
          >
            {item}
          </PageButton>
        );
      })}
      
      {/* Botão Próximo */}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        &gt;
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
