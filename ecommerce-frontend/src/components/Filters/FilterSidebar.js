/**
 * Componente FilterSidebar
 * 
 * Barra lateral de filtros para a página de listagem de produtos.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    width: 280px;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #333;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 12px 0;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  
  &::after {
    content: '${props => props.isOpen ? '−' : '+'}';
    font-size: 1.25rem;
  }
`;

const FilterContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #555;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #555;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

const Radio = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

const RangeContainer = styled.div`
  padding: 0 5px;
`;

const RangeSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const RangeInput = styled.input`
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e0e0e0;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3f51b5;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3f51b5;
    cursor: pointer;
  }
`;

const RangeValues = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #757575;
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const PriceInput = styled.div`
  flex: 1;
  position: relative;
`;

const PriceInputField = styled.input`
  width: 100%;
  padding: 8px 8px 8px 24px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  color: #757575;
`;

const ColorOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#3f51b5' : 'transparent'};
  transition: transform 0.2s, border-color 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 20px;
  
  &:hover {
    background-color: #303f9f;
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: transparent;
  color: #757575;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  margin-top: 10px;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

/**
 * Componente de barra lateral de filtros
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.categories - Lista de categorias disponíveis
 * @param {Array} props.brands - Lista de marcas disponíveis
 * @param {Array} props.colors - Lista de cores disponíveis
 * @param {Object} props.priceRange - Faixa de preço (min, max)
 * @param {Object} props.filters - Filtros atualmente aplicados
 * @param {Function} props.onApplyFilters - Função chamada ao aplicar filtros
 * @param {Function} props.onResetFilters - Função chamada ao resetar filtros
 */
const FilterSidebar = ({
  categories = [],
  brands = [],
  colors = [],
  priceRange = { min: 0, max: 1000 },
  filters = {},
  onApplyFilters,
  onResetFilters,
}) => {
  // Estado para controlar quais seções estão abertas
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    colors: true,
  });
  
  // Estado local para os filtros
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Alternar abertura/fechamento de seção
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Atualizar filtros de checkbox (categorias, marcas)
  const handleCheckboxChange = (type, value) => {
    setLocalFilters(prev => {
      const currentValues = prev[type] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [type]: newValues
      };
    });
  };
  
  // Atualizar filtro de preço
  const handlePriceChange = (type, value) => {
    setLocalFilters(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: value
      }
    }));
  };
  
  // Atualizar filtro de cor
  const handleColorChange = (color) => {
    setLocalFilters(prev => {
      const currentColors = prev.colors || [];
      const newColors = currentColors.includes(color)
        ? currentColors.filter(item => item !== color)
        : [...currentColors, color];
      
      return {
        ...prev,
        colors: newColors
      };
    });
  };
  
  // Aplicar filtros
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
  };
  
  // Resetar filtros
  const handleResetFilters = () => {
    setLocalFilters({});
    if (onResetFilters) {
      onResetFilters();
    }
  };
  
  // Verificar se um valor está selecionado
  const isSelected = (type, value) => {
    return (localFilters[type] || []).includes(value);
  };
  
  return (
    <SidebarContainer data-testid="filter-sidebar">
      <SidebarTitle>Filtros</SidebarTitle>
      
      {/* Categorias */}
      <FilterSection>
        <FilterTitle 
          isOpen={openSections.categories}
          onClick={() => toggleSection('categories')}
        >
          Categorias
        </FilterTitle>
        <FilterContent isOpen={openSections.categories}>
          <CheckboxGroup>
            {categories.map((category, index) => (
              <CheckboxLabel key={index}>
                <Checkbox 
                  type="checkbox"
                  checked={isSelected('categories', category.id)}
                  onChange={() => handleCheckboxChange('categories', category.id)}
                />
                {category.name}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FilterContent>
      </FilterSection>
      
      {/* Marcas */}
      <FilterSection>
        <FilterTitle 
          isOpen={openSections.brands}
          onClick={() => toggleSection('brands')}
        >
          Marcas
        </FilterTitle>
        <FilterContent isOpen={openSections.brands}>
          <CheckboxGroup>
            {brands.map((brand, index) => (
              <CheckboxLabel key={index}>
                <Checkbox 
                  type="checkbox"
                  checked={isSelected('brands', brand.id)}
                  onChange={() => handleCheckboxChange('brands', brand.id)}
                />
                {brand.name}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FilterContent>
      </FilterSection>
      
      {/* Preço */}
      <FilterSection>
        <FilterTitle 
          isOpen={openSections.price}
          onClick={() => toggleSection('price')}
        >
          Preço
        </FilterTitle>
        <FilterContent isOpen={openSections.price}>
          <RangeContainer>
            <RangeSlider>
              <RangeInput 
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.price?.min || priceRange.min}
                onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
              />
            </RangeSlider>
            <RangeValues>
              <span>R$ {priceRange.min}</span>
              <span>R$ {priceRange.max}</span>
            </RangeValues>
            <PriceInputs>
              <PriceInput>
                <CurrencySymbol>R$</CurrencySymbol>
                <PriceInputField 
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={localFilters.price?.min || ''}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                  placeholder="Min"
                />
              </PriceInput>
              <PriceInput>
                <CurrencySymbol>R$</CurrencySymbol>
                <PriceInputField 
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={localFilters.price?.max || ''}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                  placeholder="Max"
                />
              </PriceInput>
            </PriceInputs>
          </RangeContainer>
        </FilterContent>
      </FilterSection>
      
      {/* Cores */}
      <FilterSection>
        <FilterTitle 
          isOpen={openSections.colors}
          onClick={() => toggleSection('colors')}
        >
          Cores
        </FilterTitle>
        <FilterContent isOpen={openSections.colors}>
          <ColorOptions>
            {colors.map((color, index) => (
              <ColorOption 
                key={index}
                color={color.value}
                selected={isSelected('colors', color.id)}
                onClick={() => handleColorChange(color.id)}
                title={color.name}
              />
            ))}
          </ColorOptions>
        </FilterContent>
      </FilterSection>
      
      {/* Botões */}
      <ApplyButton onClick={handleApplyFilters}>
        Aplicar Filtros
      </ApplyButton>
      <ResetButton onClick={handleResetFilters}>
        Limpar Filtros
      </ResetButton>
    </SidebarContainer>
  );
};

export default FilterSidebar;
