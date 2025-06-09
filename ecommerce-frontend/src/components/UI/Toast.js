/**
 * Componente Toast
 * 
 * Componente para exibir mensagens temporárias ao usuário.
 * 

 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animação de entrada do toast
const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Animação de saída do toast
const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

// Container principal do toast
const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

// Estilos para diferentes tipos de toast
const getToastTypeStyles = (type) => {
  const types = {
    success: {
      backgroundColor: '#4caf50',
      color: 'white',
      icon: '✓'
    },
    error: {
      backgroundColor: '#f44336',
      color: 'white',
      icon: '✕'
    },
    warning: {
      backgroundColor: '#ff9800',
      color: 'white',
      icon: '⚠'
    },
    info: {
      backgroundColor: '#2196f3',
      color: 'white',
      icon: 'ℹ'
    }
  };

  return types[type] || types.info;
};

// Componente de toast individual
const ToastItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 250px;
  max-width: 350px;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background-color: ${props => getToastTypeStyles(props.type).backgroundColor};
  color: ${props => getToastTypeStyles(props.type).color};
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out;
  
  @media (max-width: 480px) {
    min-width: 200px;
    max-width: 300px;
  }
`;

const ToastIcon = styled.div`
  margin-right: 12px;
  font-size: 1.2rem;
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

/**
 * Componente para exibir mensagens toast
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.open - Se o toast está visível
 * @param {string} props.message - Mensagem a ser exibida
 * @param {string} [props.type='info'] - Tipo do toast (success, error, warning, info)
 * @param {number} [props.duration=3000] - Duração em ms que o toast ficará visível
 * @param {Function} props.onClose - Função chamada quando o toast é fechado
 */
const Toast = ({
  open,
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    if (open) {
      // Configurar timer para fechar o toast após a duração
      const timer = setTimeout(() => {
        setIsExiting(true);
        
        // Aguardar a animação de saída antes de chamar onClose
        const animationTimer = setTimeout(() => {
          onClose();
          setIsExiting(false);
        }, 300); // Duração da animação
        
        return () => clearTimeout(animationTimer);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);
  
  if (!open) return null;
  
  const handleClose = () => {
    setIsExiting(true);
    
    // Aguardar a animação de saída antes de chamar onClose
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 300); // Duração da animação
  };
  
  const typeStyles = getToastTypeStyles(type);
  
  return (
    <ToastContainer data-testid="toast">
      <ToastItem type={type} isExiting={isExiting}>
        <ToastIcon>{typeStyles.icon}</ToastIcon>
        <ToastMessage>{message}</ToastMessage>
        <CloseButton onClick={handleClose} aria-label="Fechar">
          &times;
        </CloseButton>
      </ToastItem>
    </ToastContainer>
  );
};

export default Toast;
