/**
 * Página NotFoundPage
 * 
 * Página exibida quando uma rota não é encontrada.
 * 

 */

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 60vh;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: #3f51b5;
  margin: 0 0 20px 0;
  
  @media (max-width: 576px) {
    font-size: 4rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #555;
  margin: 0 0 30px 0;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Image = styled.img`
  max-width: 300px;
  margin-bottom: 30px;
`;

/**
 * Página exibida quando uma rota não é encontrada
 */
const NotFoundPage = () => {
  return (
    <Container data-testid="not-found-page">
      <Image 
        src="/assets/images/not-found.svg" 
        alt="Página não encontrada"
        onError={(e) => {
          // Fallback se a imagem não for encontrada
          e.target.style.display = 'none';
        }}
      />
      <ErrorCode>404</ErrorCode>
      <Title>Página não encontrada</Title>
      <Description>
        A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
      </Description>
      <ButtonContainer>
        <Link to="/">
          <Button variant="primary" size="large">
            Voltar para a Página Inicial
          </Button>
        </Link>
        <Link to="/produtos">
          <Button variant="outline" size="large">
            Explorar Produtos
          </Button>
        </Link>
      </ButtonContainer>
    </Container>
  );
};

export default NotFoundPage;
