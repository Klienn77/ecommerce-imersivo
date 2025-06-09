/**
 * Componente NewsletterSignup
 * 
 * Componente para inscrição na newsletter.
 * 
 
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../UI/Button';

const Container = styled.div`
  width: 100%;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  margin: 40px 0;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0 0 20px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Form = styled.form`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
  
  @media (min-width: 576px) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const SubmitButton = styled(Button)`
  @media (min-width: 576px) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  font-weight: 500;
  margin-top: 10px;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-weight: 500;
  margin-top: 10px;
`;

/**
 * Componente para inscrição na newsletter
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.title='Inscreva-se em nossa newsletter'] - Título do componente
 * @param {string} [props.description='Receba novidades, promoções e dicas exclusivas diretamente no seu e-mail.'] - Descrição do componente
 * @param {Function} [props.onSubmit] - Função chamada ao enviar o formulário
 */
const NewsletterSignup = ({
  title = 'Inscreva-se em nossa newsletter',
  description = 'Receba novidades, promoções e dicas exclusivas diretamente no seu e-mail.',
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', null
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }
    
    // Chamar função de callback se fornecida
    if (onSubmit) {
      onSubmit(email);
    }
    
    // Simular sucesso
    setStatus('success');
    setEmail('');
    
    // Limpar mensagem após alguns segundos
    setTimeout(() => {
      setStatus(null);
    }, 5000);
  };
  
  return (
    <Container data-testid="newsletter-signup">
      <Title>{title}</Title>
      <Description>{description}</Description>
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Endereço de e-mail"
          required
        />
        <SubmitButton 
          type="submit"
          variant="primary"
          fullWidth={window.innerWidth < 576}
        >
          Inscrever-se
        </SubmitButton>
      </Form>
      
      {status === 'success' && (
        <SuccessMessage>
          Inscrição realizada com sucesso! Obrigado por se inscrever.
        </SuccessMessage>
      )}
      
      {status === 'error' && (
        <ErrorMessage>
          Por favor, insira um endereço de e-mail válido.
        </ErrorMessage>
      )}
    </Container>
  );
};

export default NewsletterSignup;
