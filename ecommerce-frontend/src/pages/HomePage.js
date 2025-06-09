/**
 * Página Inicial do E-commerce Imersivo
 * 
 * Esta página exibe o conteúdo principal da loja, incluindo produtos em destaque,
 * banners promocionais, categorias populares e recomendações personalizadas.
 * Foi corrigida para usar o hook useTheme do styled-components.
 */
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { useContext } from 'react';


// Componentes
import { ProductContext } from '../context/ProductContext';
import { Section, Container, SectionTitle } from '../components/UI/Layout';
import Carousel from '../components/UI/Carousel';
import ProductCard from '../components/Products/ProductCard';
import FeaturedProduct from '../components/Products/FeaturedProduct';
import CategoryCard from '../components/Categories/CategoryCard';
import NewsletterSignup from '../components/Marketing/NewsletterSignup';
import Footer from '../components/Layout/Footer';

// Estilos
const Hero = styled.div`
  height: 600px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/banners/fundo.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color:rgb(218, 207, 207);
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) 
    height: 400px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color:rgb(7, 51, 77);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.dark};
    color: white;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

/**
 * Componente HomePage
 * 
 * Página inicial do e-commerce que exibe produtos em destaque,
 * categorias populares e promoções.
 */
const HomePage = () => {
  // Usar o hook useTheme do styled-components em vez de useContext
  const theme = useTheme();
  
  // Contexto de produtos
  const { products, categories } = useContext(ProductContext);
  
  // Obter produtos em destaque
  const featuredProducts = products.filter(product => product.featured).slice(0, 8);
  
  // Obter produto principal para destaque
  const mainFeaturedProduct = products.find(product => product.id === 1) || featuredProducts[0];
  
  // Obter produtos novos
  const newProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
  
  // Obter produtos em promoção
  const discountedProducts = products.filter(product => product.discount > 0).slice(0, 8);
  
  return (
    <>
     
      
      <Hero>
        <HeroContent>
          <HeroTitle>Descubra o Futuro do E-commerce</HeroTitle>
          <HeroSubtitle>
            Experimente uma nova forma de comprar online com visualização 3D,
            personalização em tempo real e recomendações inteligentes.
          </HeroSubtitle>
          <HeroButton to="/products">Explorar Produtos</HeroButton>
        </HeroContent>
      </Hero>
      
      <Section>
        <Container>
          <SectionTitle>Produto em Destaque</SectionTitle>
          {mainFeaturedProduct && (
            <FeaturedProduct product={mainFeaturedProduct} />
          )}
        </Container>
      </Section>
      
      <Section background={theme.colors.gray[100]}>
        <Container>
          <SectionTitle>Produtos Populares</SectionTitle>
          <Carousel
            items={featuredProducts}
            renderItem={(product) => <ProductCard product={product} />}
            autoplay
          />
        </Container>
      </Section>
      
      <Section>
        <Container>
          <SectionTitle>Categorias Populares</SectionTitle>
          <CategoryGrid>
            {categories.map((category, index) => (
              <CategoryCard 
                key={index} 
                category={category} 
                image={`/assets/images/categories/${category.slug.replace(' ', '-')}.jpg`}
                
              />
              
            ))}
            
          </CategoryGrid>
        </Container>
      </Section>
      
      <Section background={theme.colors.gray[100]}>
        <Container>
          <SectionTitle>Novidades</SectionTitle>
          <Grid>
            {newProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        </Container>
      </Section>
      
      <Section>
        <Container>
          <SectionTitle>Ofertas Especiais</SectionTitle>
          <Carousel
            items={discountedProducts}
            renderItem={(product) => <ProductCard product={product} />}
            slidesToShow={4}
          />
        </Container>
      </Section>
      
      <Section background={theme.colors.gray[100]}>
        <Container>
          <NewsletterSignup />
        </Container>
      </Section>
      
      <Footer />
    </>
  );
};

export default HomePage;
