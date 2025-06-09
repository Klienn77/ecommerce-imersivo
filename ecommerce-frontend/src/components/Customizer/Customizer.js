/**
 * Componente de Personalização de Produtos
 * 
 * Este componente é responsável por:
 * 1. Fornecer interface para personalização de produtos em tempo real
 * 2. Permitir seleção de cores, materiais e componentes
 * 3. Comunicar alterações ao visualizador 3D
 * 4. Oferecer experiência interativa e intuitiva
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Interação entre componentes React
 * - Gerenciamento de estado para personalização
 * - Seleção de cores e materiais em tempo real
 * - Comunicação com componente de visualização 3D
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useProductCustomization } from '../../hooks/useHooks';

/**
 * Componente principal Customizer
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onCustomizationChange - Callback para mudanças na personalização
 * @param {Object} props.initialCustomization - Personalização inicial
 * @param {Object} props.productData - Dados do produto
 */
const Customizer = ({ onCustomizationChange, initialCustomization, productData }) => {
  // Hook personalizado para gerenciar personalização
  const {
    customization,
    updateColor,
    updateMaterial,
    toggleComponent,
    resetCustomization
  } = useProductCustomization(initialCustomization);
  
  // Efeito para notificar mudanças na personalização
  useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange(customization);
    }
  }, [customization, onCustomizationChange]);
  
  // Cores disponíveis para personalização
  const availableColors = {
    body: [
      { name: 'Azul', value: '#3498db' },
      { name: 'Verde', value: '#2ecc71' },
      { name: 'Vermelho', value: '#e74c3c' },
      { name: 'Amarelo', value: '#f1c40f' },
      { name: 'Roxo', value: '#9b59b6' },
      { name: 'Preto', value: '#2c3e50' },
      { name: 'Cinza', value: '#7f8c8d' },
      { name: 'Marrom', value: '#935116' }
    ],
    sole: [
      { name: 'Branco', value: '#ecf0f1' },
      { name: 'Preto', value: '#2c3e50' },
      { name: 'Cinza', value: '#7f8c8d' },
      { name: 'Azul', value: '#3498db' },
      { name: 'Vermelho', value: '#e74c3c' }
    ],
    laces: [
      { name: 'Branco', value: '#ecf0f1' },
      { name: 'Preto', value: '#2c3e50' },
      { name: 'Cinza', value: '#7f8c8d' },
      { name: 'Azul', value: '#3498db' },
      { name: 'Vermelho', value: '#e74c3c' }
    ],
    logo: [
      { name: 'Branco', value: '#ecf0f1' },
      { name: 'Preto', value: '#2c3e50' },
      { name: 'Azul', value: '#3498db' },
      { name: 'Vermelho', value: '#e74c3c' },
      { name: 'Amarelo', value: '#f1c40f' },
      { name: 'Verde', value: '#2ecc71' }
    ]
  };
  
  // Materiais disponíveis para personalização
  const availableMaterials = {
    body: [
      { name: 'Couro', value: 'leather' },
      { name: 'Camurça', value: 'suede' },
      { name: 'Malha', value: 'mesh' },
      { name: 'Lona', value: 'canvas' },
      { name: 'Sintético', value: 'synthetic' },
      { name: 'Impermeável', value: 'waterproof' }
    ],
    sole: [
      { name: 'Borracha', value: 'rubber' },
      { name: 'EVA', value: 'eva' },
      { name: 'PU', value: 'pu' }
    ]
  };
  
  // Componentes disponíveis para personalização
  const availableComponents = [
    { name: 'Cadarços', value: 'laces' },
    { name: 'Logo', value: 'logo' }
  ];
  
  return (
    <CustomizerContainer>
      <CustomizerTabs>
        <CustomizerTab active={true}>
          <TabIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" />
              <circle cx="6.5" cy="11.5" r="1.5" />
              <circle cx="9.5" cy="7.5" r="1.5" />
              <circle cx="14.5" cy="7.5" r="1.5" />
              <circle cx="17.5" cy="11.5" r="1.5" />
            </svg>
          </TabIcon>
          <TabText>Personalizar</TabText>
        </CustomizerTab>
      </CustomizerTabs>
      
      <CustomizerContent>
        {/* Seção de cores */}
        <CustomizerSection>
          <SectionTitle>Cores</SectionTitle>
          
          <ColorOption>
            <ColorLabel>Corpo</ColorLabel>
            <ColorSwatches>
              {availableColors.body.map(color => (
                <ColorSwatch
                  key={color.value}
                  color={color.value}
                  selected={customization.colors.body === color.value}
                  onClick={() => updateColor('body', color.value)}
                  title={color.name}
                />
              ))}
            </ColorSwatches>
          </ColorOption>
          
          <ColorOption>
            <ColorLabel>Sola</ColorLabel>
            <ColorSwatches>
              {availableColors.sole.map(color => (
                <ColorSwatch
                  key={color.value}
                  color={color.value}
                  selected={customization.colors.sole === color.value}
                  onClick={() => updateColor('sole', color.value)}
                  title={color.name}
                />
              ))}
            </ColorSwatches>
          </ColorOption>
          
          <ColorOption>
            <ColorLabel>Cadarços</ColorLabel>
            <ColorSwatches>
              {availableColors.laces.map(color => (
                <ColorSwatch
                  key={color.value}
                  color={color.value}
                  selected={customization.colors.laces === color.value}
                  onClick={() => updateColor('laces', color.value)}
                  title={color.name}
                  disabled={!customization.components.laces}
                />
              ))}
            </ColorSwatches>
          </ColorOption>
          
          <ColorOption>
            <ColorLabel>Logo</ColorLabel>
            <ColorSwatches>
              {availableColors.logo.map(color => (
                <ColorSwatch
                  key={color.value}
                  color={color.value}
                  selected={customization.colors.logo === color.value}
                  onClick={() => updateColor('logo', color.value)}
                  title={color.name}
                  disabled={!customization.components.logo}
                />
              ))}
            </ColorSwatches>
          </ColorOption>
        </CustomizerSection>
        
        {/* Seção de materiais */}
        <CustomizerSection>
          <SectionTitle>Materiais</SectionTitle>
          
          <MaterialOption>
            <MaterialLabel>Corpo</MaterialLabel>
            <MaterialButtons>
              {availableMaterials.body.map(material => (
                <MaterialButton
                  key={material.value}
                  selected={customization.materials.body === material.value}
                  onClick={() => updateMaterial('body', material.value)}
                >
                  {material.name}
                </MaterialButton>
              ))}
            </MaterialButtons>
          </MaterialOption>
          
          <MaterialOption>
            <MaterialLabel>Sola</MaterialLabel>
            <MaterialButtons>
              {availableMaterials.sole.map(material => (
                <MaterialButton
                  key={material.value}
                  selected={customization.materials.sole === material.value}
                  onClick={() => updateMaterial('sole', material.value)}
                >
                  {material.name}
                </MaterialButton>
              ))}
            </MaterialButtons>
          </MaterialOption>
        </CustomizerSection>
        
        {/* Seção de componentes */}
        <CustomizerSection>
          <SectionTitle>Componentes</SectionTitle>
          
          <ComponentOptions>
            {availableComponents.map(component => (
              <ComponentToggle key={component.value}>
                <ToggleLabel>{component.name}</ToggleLabel>
                <ToggleSwitch
                  checked={customization.components[component.value]}
                  onChange={() => toggleComponent(component.value)}
                />
              </ComponentToggle>
            ))}
          </ComponentOptions>
        </CustomizerSection>
        
        {/* Botões de ação */}
        <ActionButtons>
          <ResetButton onClick={resetCustomization}>
            Restaurar Padrão
          </ResetButton>
        </ActionButtons>
      </CustomizerContent>
    </CustomizerContainer>
  );
};

/**
 * Componente ToggleSwitch para alternar componentes
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.checked - Estado do toggle
 * @param {Function} props.onChange - Callback para mudança de estado
 */
const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <SwitchContainer onClick={onChange}>
      <SwitchInput type="checkbox" checked={checked} readOnly />
      <SwitchSlider checked={checked} />
    </SwitchContainer>
  );
};

/**
 * Componentes estilizados
 */
const CustomizerContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CustomizerTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
`;

const CustomizerTab = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  background-color: ${props => props.active ? 'var(--card-background)' : 'transparent'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-light)'};
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const TabIcon = styled.div`
  margin-right: 8px;
`;

const TabText = styled.div`
  font-weight: 500;
`;

const CustomizerContent = styled.div`
  padding: 24px;
`;

const CustomizerSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 16px 0;
  color: var(--text);
`;

const ColorOption = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ColorLabel = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-light);
`;

const ColorSwatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorSwatch = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border: 2px solid ${props => props.selected ? 'var(--primary)' : '#ddd'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
  }
`;

const MaterialOption = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MaterialLabel = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-light);
`;

const MaterialButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MaterialButton = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  background-color: ${props => props.selected ? 'var(--primary)' : 'transparent'};
  color: ${props => props.selected ? 'white' : 'var(--text)'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary);
  }
`;

const ComponentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ComponentToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleLabel = styled.div`
  font-size: 14px;
  color: var(--text);
`;

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.checked ? 'var(--primary)' : '#ccc'};
  border-radius: 24px;
  transition: 0.4s;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
    transform: ${props => props.checked ? 'translateX(24px)' : 'translateX(0)'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--border);
  }
`;

export default Customizer;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o componente de personalização interage com o visualizador 3D
 * 2. Observe como as opções de cores, materiais e componentes são organizadas
 * 3. Estude como o estado de personalização é gerenciado e comunicado
 * 4. Analise como os componentes de interface são estilizados para uma experiência intuitiva
 */
