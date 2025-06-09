/**
 * Componente principal da aplicação E-commerce Imersivo
 * 
 * Este componente configura os provedores de contexto e as rotas da aplicação.
 * Foi corrigido para usar a importação correta do ProductProvider.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

// Páginas
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Layout/Header';
/**
 * Componente App
 * 
 * Componente raiz da aplicação que configura os provedores de contexto
 * e define as rotas disponíveis.
 */

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <Router>
              <Header /> {/* <- Adicione o Header aqui */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/category/:category" element={<ProductListPage />} />
                <Route path="/products/search" element={<ProductListPage />} />
                <Route path="/products/search" element={<searchResultsPage/>}/>
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
