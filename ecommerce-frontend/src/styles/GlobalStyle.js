/**
 * Estilos globais para o E-commerce Imersivo
 * 
 * Este arquivo define os estilos globais da aplicação usando styled-components.
 * Inclui reset de CSS, definições de fonte, e estilos base para elementos comuns.
 */
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Reset CSS */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* Definições de fonte e estilos base */
  body {
    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    background-color: #f8f9fa;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Links */
  a {
    color: #2c3e50;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #3498db;
    }
  }
  
  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  h4 {
    font-size: 1.5rem;
  }
  
  h5 {
    font-size: 1.25rem;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  /* Parágrafos */
  p {
    margin-bottom: 1rem;
  }
  
  /* Botões */
  button {
    cursor: pointer;
    font-family: inherit;
  }
  
  /* Imagens */
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Formulários */
  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
  }
  
  /* Listas */
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  /* Código */
  code, pre {
    font-family: 'Courier New', Courier, monospace;
    background-color: #f1f1f1;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
  }
  
  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export default GlobalStyle;
