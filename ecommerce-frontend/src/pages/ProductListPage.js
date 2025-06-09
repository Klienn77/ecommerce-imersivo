/**
 * Página de Listagem de Produtos do E-commerce Imersivo
 * 
 * Esta página é responsável por:
 * 1. Exibir produtos filtrados por categoria ou busca
 * 2. Fornecer opções de filtragem e ordenação
 * 3. Implementar paginação para navegação entre resultados
 * 4. Permitir visualização em diferentes layouts (grade/lista)
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Filtragem e ordenação de dados
 * - Paginação em React
 * - Layouts responsivos e adaptáveis
 * - Gerenciamento de estado para preferências de visualização
 */



import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/Products/ProductCard';
import ProductListItem from '../components/Products/ProductListItem';
import FilterSidebar from '../components/Filters/FilterSidebar';
import Pagination from '../components/UI/Pagination';
import { Container, Section, SectionTitle } from '../components/UI/Layout';
import { Button } from '../components/UI/Button';

const ProductListPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, categories, getProductsByCategory, searchProducts } = useContext(ProductContext);
  const theme = useTheme();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  const [activeFilters, setActiveFilters] = useState({
    price: { min: 0, max: 1000 },
    colors: [],
    sizes: [],
    brands: []
  });
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');
    
    // Inicialmente, definimos isLoading como true apenas se não for uma busca
    // Isso evita o flicker durante buscas, que são operações rápidas em memória
    const isInitialLoad = !searchQuery && isLoading;
    
    if (isInitialLoad) {
      setIsLoading(true);
    }

    // Função para processar os resultados sem setTimeout
    const processResults = () => {
      let results = [];

      if (searchQuery) {
        const searchedResults = searchProducts(searchQuery);
        document.title = `Busca: ${searchQuery} | E-commerce Imersivo`;
        setFilteredProducts(searchedResults);
        setTotalProducts(searchedResults.length);
        setIsLoading(false);
        return;
      }

      if (category) {
        results = getProductsByCategory(category);
        const categoryName = categories.find((cat) => cat.slug === category)?.name || category;
        document.title = `${categoryName} | E-commerce Imersivo`;
      } else {
        results = [...products];
        document.title = 'Todos os Produtos | E-commerce Imersivo';
      }

      results = applyFilters(results, activeFilters);
      results = applySorting(results, sortBy);

      setFilteredProducts(results);
      setTotalProducts(results.length);
      setIsLoading(false);
    };

    // Para carregamento inicial, simulamos um pequeno delay para mostrar o skeleton
    // Para buscas e filtros, executamos imediatamente para evitar flicker
    if (isInitialLoad && products.length > 0) {
      // Apenas no carregamento inicial usamos um timeout curto
      setTimeout(processResults, 300);
    } else {
      // Para buscas e filtros, executamos imediatamente
      processResults();
    }
    
  }, [category, location.search, activeFilters, sortBy, products, categories, getProductsByCategory, searchProducts]);

  const applyFilters = (products, filters) => {
    return products.filter(product => {
      if (product.price < filters.price.min || product.price > filters.price.max) return false;
      if (filters.colors.length > 0 && !filters.colors.some(color => product.colors.includes(color))) return false;
      if (filters.sizes.length > 0 && !filters.sizes.some(size => product.sizes.includes(size))) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
      return true;
    });
  };

  const applySorting = (products, sortOption) => {
    const sortedProducts = [...products];
    switch (sortOption) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
      default:
        sortedProducts.sort((a, b) => b.popularity - a.popularity);
        break;
    }
    return sortedProducts;
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const getPageTitle = () => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');
    if (searchQuery) return `Resultados para: "${searchQuery}"`;
    if (category) return categories.find(cat => cat.slug === category)?.name || category;
    return 'Todos os Produtos';
  };

  return (
    <main>
      <Section>
        <Container>
          <PageHeader>
            <SectionTitle>{getPageTitle()}</SectionTitle>
            <ResultCount>
              {isLoading ? 'Carregando...' : `${totalProducts} produtos encontrados`}
            </ResultCount>
          </PageHeader>

          <ProductListContainer>
            <FilterSidebar filters={activeFilters} onFilterChange={handleFilterChange} isLoading={isLoading} />
            <ProductListContent>
              <ListControls>
                <SortControls>
                  <SortLabel>Ordenar por:</SortLabel>
                  <SortSelect value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="popular">Mais Populares</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="newest">Mais Recentes</option>
                  </SortSelect>
                </SortControls>
                <ViewControls>
                  <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} aria-label="Visualização em grade">
                    <GridIcon />
                  </ViewButton>
                  <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')} aria-label="Visualização em lista">
                    <ListIcon />
                  </ViewButton>
                </ViewControls>
              </ListControls>

              {isLoading ? (
                <LoadingGrid viewMode={viewMode}>
                  {Array.from({ length: productsPerPage }).map((_, index) => (
                    <SkeletonProduct key={index} viewMode={viewMode} />
                  ))}
                </LoadingGrid>
              ) : currentProducts.length > 0 ? (
                <ProductsContainer viewMode={viewMode}>
                  {currentProducts.map(product => (
                    viewMode === 'grid' ? (
                      <ProductCard key={product.id} product={product} />
                    ) : (
                      <ProductListItem key={product.id} product={product} />
                    )
                  ))}
                </ProductsContainer>
              ) : (
                <NoResults>
                  <h3>Nenhum produto encontrado</h3>
                  <p>Tente ajustar seus filtros ou buscar por outro termo.</p>
                  <Button onClick={() => {
                    setActiveFilters({ price: { min: 0, max: 1000 }, colors: [], sizes: [], brands: [] });
                    navigate('/products');
                  }}>
                    Ver Todos os Produtos
                  </Button>
                </NoResults>
              )}

              {!isLoading && totalProducts > productsPerPage && (
                <Pagination currentPage={currentPage} totalPages={Math.ceil(totalProducts / productsPerPage)} onPageChange={handlePageChange} />
              )}
            </ProductListContent>
          </ProductListContainer>
        </Container>
      </Section>
    </main>
  );
};

const PageHeader = styled.div`
  margin-bottom: 30px;
`;

const ResultCount = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  margin-top: 10px;
`;

const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProductListContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.gray[300]};
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
`;

const SortLabel = styled.label`
  margin-right: 10px;
  color: ${props => props.theme.colors.gray[600]};
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.dark};
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: 10px;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.dark};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[200]};
  }
`;

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" rx="1" />
    <rect x="9" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="9" width="6" height="6" rx="1" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="14" height="3" rx="1" />
    <rect x="1" y="6" width="14" height="3" rx="1" />
    <rect x="1" y="11" width="14" height="3" rx="1" />
  </svg>
);

const ProductsContainer = styled.div`
  display: ${props => props.viewMode === 'grid' ? 'grid' : 'flex'};
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  flex-direction: ${props => props.viewMode === 'list' ? 'column' : 'row'};
`;

const LoadingGrid = styled.div`
  display: ${props => props.viewMode === 'grid' ? 'grid' : 'flex'};
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  flex-direction: ${props => props.viewMode === 'list' ? 'column' : 'row'};
`;

const SkeletonProduct = styled.div`
  height: ${props => props.viewMode === 'grid' ? '350px' : '150px'};
  background: linear-gradient(
    to right,
    ${props => props.theme.colors.gray[100]} 0%,
    ${props => props.theme.colors.gray[200]} 50%,
    ${props => props.theme.colors.gray[100]} 100%
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

const NoResults = styled.div`
  text-align: center;
  padding: 60px 0;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.dark};
  }
  
  p {
    color: ${props => props.theme.colors.gray[600]};
    margin-bottom: 20px;
  }
`;

export default ProductListPage;