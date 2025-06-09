/**
 * Componentes de Layout
 * 
 * Componentes reutilizáveis para estruturação de layout.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import React from 'react';
import styled from 'styled-components';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

// Container principal do layout
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Conteúdo principal
const Main = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

// Componente de seção para organizar conteúdo
export const Section = styled.section`
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Container para limitar largura e centralizar conteúdo
export const Container = styled.div`
  max-width: ${props => props.fluid ? '100%' : '1200px'};
  width: 100%;
  margin: 0 auto;
  padding: ${props => props.noPadding ? '0' : '0 20px'};
  
  @media (max-width: 768px) {
    padding: ${props => props.noPadding ? '0' : '0 15px'};
  }
`;

// Título de seção com estilo consistente
export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

/**
 * Componente de layout padrão que envolve o conteúdo da página com header e footer
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado dentro do layout
 */
const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
