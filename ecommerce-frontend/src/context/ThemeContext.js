/**
 * Contexto de Tema para o E-commerce Imersivo
 * 
 * Este contexto é responsável por:
 * 1. Gerenciar o tema da aplicação (claro/escuro)
 * 2. Fornecer métodos para alternar entre temas
 * 3. Persistir preferência de tema do usuário
 * 4. Aplicar estilos consistentes em toda a aplicação
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Implementação de temas em aplicações React
 * - Uso de variáveis CSS para estilização consistente
 * - Persistência de preferências de usuário
 * - Acessibilidade e preferências de visualização
 */

import React, { createContext, useState, useEffect } from 'react';

// Criação do contexto
export const ThemeContext = createContext();

/**
 * Provedor do contexto de tema
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 */
export const ThemeProvider = ({ children }) => {
  // Estado principal do tema
  const [theme, setTheme] = useState('light');
  
  // Efeito para carregar tema salvo ou detectar preferência do sistema
  useEffect(() => {
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('ecommerce_theme');
    
    if (savedTheme) {
      // Usa tema salvo
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Verifica preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);
  
  /**
   * Aplica o tema ao documento HTML
   * 
   * @param {string} themeName - Nome do tema ('light' ou 'dark')
   */
  const applyTheme = (themeName) => {
    // Remove classes de tema anteriores
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Adiciona classe do tema atual
    document.documentElement.classList.add(`${themeName}-theme`);
    
    // Atualiza meta tag de tema para dispositivos móveis
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        themeName === 'dark' ? '#222831' : '#3498db'
      );
    }
  };
  
  /**
   * Alterna entre temas claro e escuro
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Salva preferência no localStorage
    localStorage.setItem('ecommerce_theme', newTheme);
  };
  
  /**
   * Define um tema específico
   * 
   * @param {string} themeName - Nome do tema ('light' ou 'dark')
   */
  const setSpecificTheme = (themeName) => {
    if (themeName !== 'light' && themeName !== 'dark') {
      console.error('Tema inválido. Use "light" ou "dark".');
      return;
    }
    
    setTheme(themeName);
    applyTheme(themeName);
    
    // Salva preferência no localStorage
    localStorage.setItem('ecommerce_theme', themeName);
  };
  
  // Valores e métodos expostos pelo contexto
  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark'
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o tema é aplicado usando classes CSS
 * 2. Observe como as preferências do usuário são detectadas e salvas
 * 3. Estude como o contexto é utilizado em componentes para estilização condicional
 * 4. Analise como a acessibilidade é considerada na implementação do tema
 */
