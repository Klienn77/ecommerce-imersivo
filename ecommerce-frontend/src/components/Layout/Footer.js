/**
 * Componente Footer do E-commerce Imersivo
 * 
 * Este componente é responsável por:
 * 1. Exibir informações de contato e links úteis
 * 2. Fornecer navegação secundária
 * 3. Mostrar informações legais e de direitos autorais
 * 4. Incluir formulário de newsletter
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Estrutura de rodapé em aplicações web
 * - Organização de links e informações
 * - Formulários simples em React
 * - Layout responsivo para diferentes dispositivos
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Componente principal Footer
 */
const Footer = () => {
  // Estado para formulário de newsletter
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  /**
   * Manipula envio do formulário de newsletter
   * 
   * @param {Event} e - Evento de formulário
   */
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    
    // Simulação de inscrição
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      
      // Reseta o estado após 5 segundos
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };
  
  return (
    <FooterContainer>
      <FooterContent>
        {/* Seção principal */}
        <FooterMain>
          {/* Coluna da marca */}
          <BrandColumn>
            <FooterLogo>
              <LogoIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </LogoIcon>
              <LogoText>E-Shop 3D</LogoText>
            </FooterLogo>
            
            <BrandDescription>
              Experiência imersiva de compra com visualização 3D e personalização em tempo real.
            </BrandDescription>
            
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </SocialLink>
            </SocialLinks>
          </BrandColumn>
          
          {/* Coluna de links */}
          <LinksColumn>
            <FooterTitle>Navegação</FooterTitle>
            <FooterLinks>
              <FooterLink to="/">Início</FooterLink>
              <FooterLink to="/products">Produtos</FooterLink>
              <FooterLink to="/products/category/tenis-esportivos">Esportivos</FooterLink>
              <FooterLink to="/products/category/tenis-casuais">Casuais</FooterLink>
              <FooterLink to="/products/search?q=lancamentos">Lançamentos</FooterLink>
            </FooterLinks>
          </LinksColumn>
          
          {/* Coluna de informações */}
          <LinksColumn>
            <FooterTitle>Informações</FooterTitle>
            <FooterLinks>
              <FooterLink to="/about">Sobre Nós</FooterLink>
              <FooterLink to="/faq">Perguntas Frequentes</FooterLink>
              <FooterLink to="/terms">Termos de Uso</FooterLink>
              <FooterLink to="/privacy">Política de Privacidade</FooterLink>
              <FooterLink to="/contact">Contato</FooterLink>
            </FooterLinks>
          </LinksColumn>
          
          {/* Coluna de newsletter */}
          <NewsletterColumn>
            <FooterTitle>Newsletter</FooterTitle>
            <NewsletterText>
              Inscreva-se para receber novidades, promoções e lançamentos exclusivos.
            </NewsletterText>
            
            <NewsletterForm onSubmit={handleNewsletterSubmit}>
              <NewsletterInput
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <NewsletterButton type="submit">
                Inscrever
              </NewsletterButton>
            </NewsletterForm>
            
            {isSubscribed && (
              <SuccessMessage>
                Inscrição realizada com sucesso!
              </SuccessMessage>
            )}
          </NewsletterColumn>
        </FooterMain>
        
        {/* Seção de pagamentos */}
        <PaymentSection>
          <FooterTitle>Formas de Pagamento</FooterTitle>
          <PaymentIcons>
            <PaymentIcon src="/assets/images/payment/visa.png" alt="Visa" />
            <PaymentIcon src="/assets/images/payment/mastercard.png" alt="Mastercard" />
            <PaymentIcon src="/assets/images/payment/amex.png" alt="American Express" />
            <PaymentIcon src="/assets/images/payment/pix.png" alt="PIX" />
            <PaymentIcon src="/assets/images/payment/boleto.png" alt="Boleto" />
          </PaymentIcons>
        </PaymentSection>
        
        {/* Seção de direitos autorais */}
        <CopyrightSection>
          <CopyrightText>
            © {new Date().getFullYear()} E-Shop 3D. Todos os direitos reservados.
          </CopyrightText>
          <DeveloperText>
            Desenvolvido com ❤️ e dedicação por Fabiano.
          </DeveloperText>
        </CopyrightSection>
      </FooterContent>
    </FooterContainer>
  );
};

/**
 * Componentes estilizados
 */
const FooterContainer = styled.footer`
  background-color: var(--card-background);
  border-top: 1px solid var(--border);
  padding: 60px 0 20px;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterMain = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const BrandColumn = styled.div``;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoIcon = styled.div`
  margin-right: 10px;
  color: var(--primary);
`;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
`;

const BrandDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 20px;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--border);
  color: var(--text);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary);
    color: white;
  }
`;

const LinksColumn = styled.div``;

const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text);
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterLink = styled(Link)`
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const NewsletterColumn = styled.div``;

const NewsletterText = styled.p`
  color: var(--text-light);
  margin-bottom: 20px;
  line-height: 1.6;
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-bottom: 10px;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--border);
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  background-color: var(--card-background);
  color: var(--text);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const NewsletterButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const SuccessMessage = styled.div`
  color: var(--secondary);
  font-size: 14px;
  margin-top: 10px;
`;

const PaymentSection = styled.div`
  margin-bottom: 40px;
`;

const PaymentIcons = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const PaymentIcon = styled.img`
  height: 30px;
  width: auto;
`;

const CopyrightSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const CopyrightText = styled.div`
  color: var(--text-light);
  font-size: 14px;
`;

const DeveloperText = styled.div`
  color: var(--text-light);
  font-size: 14px;
`;

export default Footer;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o rodapé é estruturado em diferentes seções
 * 2. Observe como o formulário de newsletter é implementado
 * 3. Estude como o layout se adapta a diferentes tamanhos de tela
 * 4. Analise como os ícones de redes sociais e pagamentos são organizados
 */
