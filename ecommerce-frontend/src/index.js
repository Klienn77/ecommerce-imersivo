/**
 * Arquivo de entrada principal da aplicação React
 * 
 * Este arquivo é o ponto de entrada da aplicação React. Ele é responsável por:
 * 1. Renderizar o componente App no elemento root do DOM
 * 2. Configurar o React StrictMode para identificar problemas potenciais
 * 3. Servir como ponto de entrada para toda a aplicação
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Inicialização de uma aplicação React
 * - Renderização de componentes no DOM
 * - Uso do StrictMode para desenvolvimento
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Criamos a raiz do React no elemento com id 'root' no HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizamos o componente App dentro do StrictMode
// O StrictMode é uma ferramenta para destacar problemas potenciais na aplicação
// Ele ativa verificações e avisos adicionais apenas em desenvolvimento
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore o arquivo App.js para entender a estrutura principal da aplicação
 * 2. Verifique como os diferentes componentes são organizados
 * 3. Observe como o roteamento é configurado para navegação entre páginas
 */
