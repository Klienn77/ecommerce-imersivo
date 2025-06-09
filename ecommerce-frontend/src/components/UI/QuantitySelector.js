/**
 * Componente QuantitySelector
 * 
 * Seletor de quantidade com botões para incrementar e decrementar.
 * 
 
 */

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: none;
  height: 36px;
  width: 36px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    cursor: not-allowed;
    color: #bdbdbd;
  }
`;

const Input = styled.input`
  width: 40px;
  height: 36px;
  border: none;
  text-align: center;
  font-size: 1rem;
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &:focus {
    outline: none;
  }
`;

/**
 * Componente para selecionar quantidade de produtos
 * 
 * @param {Object} props - Propriedades do componente
 * @param {number} props.value - Valor atual da quantidade
 * @param {Function} props.onChange - Função chamada quando o valor muda
 * @param {number} [props.min=1] - Valor mínimo permitido
 * @param {number} [props.max=99] - Valor máximo permitido
 * @param {boolean} [props.disabled=false] - Se o componente está desabilitado
 */
const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  ...rest
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <Container data-testid="quantity-selector" {...rest}>
      <Button 
        type="button" 
        onClick={handleDecrement} 
        disabled={disabled || value <= min}
        aria-label="Diminuir quantidade"
      >
        -
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
        aria-label="Quantidade"
      />
      <Button 
        type="button" 
        onClick={handleIncrement} 
        disabled={disabled || value >= max}
        aria-label="Aumentar quantidade"
      >
        +
      </Button>
    </Container>
  );
};

export default QuantitySelector;
