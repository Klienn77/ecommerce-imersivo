/**
 * Componente Button
 * 
 * Botão reutilizável com diferentes variantes e tamanhos.
 * 
 * 
 */

import React from 'react';
import styled, { css } from 'styled-components';

// Estilos para diferentes variantes do botão
const getVariantStyles = (variant, theme) => {
  const variants = {
    primary: css`
      background-color: #3f51b5;
      color: white;
      &:hover {
        background-color: #303f9f;
      }
    `,
    secondary: css`
      background-color: #f50057;
      color: white;
      &:hover {
        background-color: #c51162;
      }
    `,
    outline: css`
      background-color: transparent;
      color: #3f51b5;
      border: 1px solid #3f51b5;
      &:hover {
        background-color: rgba(63, 81, 181, 0.08);
      }
    `,
    text: css`
      background-color: transparent;
      color: #3f51b5;
      &:hover {
        background-color: rgba(63, 81, 181, 0.08);
      }
    `
  };

  return variants[variant] || variants.primary;
};

// Estilos para diferentes tamanhos do botão
const getSizeStyles = (size) => {
  const sizes = {
    small: css`
      padding: 6px 16px;
      font-size: 0.875rem;
    `,
    medium: css`
      padding: 8px 20px;
      font-size: 0.975rem;
    `,
    large: css`
      padding: 10px 24px;
      font-size: 1.125rem;
    `
  };

  return sizes[size] || sizes.medium;
};

// Componente estilizado para o botão
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  font-weight: 500;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  min-width: 64px;
  border-radius: 4px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
              border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
              color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  
  ${({ variant, theme }) => getVariantStyles(variant, theme)}
  ${({ size }) => getSizeStyles(size)}
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    color: rgba(0, 0, 0, 0.26);
    background-color: rgba(0, 0, 0, 0.12);
    cursor: default;
    pointer-events: none;
    box-shadow: none;
  }
  
  & > .startIcon {
    display: inherit;
    margin-right: 8px;
    margin-left: -4px;
  }
  
  & > .endIcon {
    display: inherit;
    margin-right: -4px;
    margin-left: 8px;
  }
`;

/**
 * Componente de botão reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.variant='primary'] - Variante do botão (primary, secondary, outline, text)
 * @param {string} [props.size='medium'] - Tamanho do botão (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Se o botão deve ocupar toda a largura disponível
 * @param {React.ReactNode} [props.startIcon] - Ícone para exibir no início do botão
 * @param {React.ReactNode} [props.endIcon] - Ícone para exibir no final do botão
 * @param {string} [props.type='button'] - Tipo do botão (button, submit, reset)
 * @param {boolean} [props.disabled=false] - Se o botão está desabilitado
 * @param {Function} [props.onClick] - Função a ser chamada quando o botão é clicado
 * @param {React.ReactNode} props.children - Conteúdo do botão
 */
export const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  type = 'button',
  disabled = false,
  onClick,
  children,
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : undefined}
      {...rest}
    >
      {startIcon && <span className="startIcon">{startIcon}</span>}
      {children}
      {endIcon && <span className="endIcon">{endIcon}</span>}
    </StyledButton>
  );
};

// Exportação padrão para compatibilidade com código existente
export default Button;
