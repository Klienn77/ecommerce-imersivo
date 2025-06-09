/**
 * Arquivo de teste para validar a integração entre componentes
 * 
 * Este arquivo contém testes automatizados para verificar se todos os componentes
 * do e-commerce imersivo estão funcionando corretamente juntos.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

/**
 * Wrapper para renderizar componentes com todos os contextos necessários
 */
const AllProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

/**
 * Testes de integração para o fluxo de navegação
 */
describe('Testes de navegação', () => {
  test('Deve navegar da página inicial para a listagem de produtos', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Aguarda o carregamento da página inicial
    await waitFor(() => {
      expect(screen.getByText(/Descubra uma nova experiência de compras/i)).toBeInTheDocument();
    });
    
    // Clica no botão de explorar produtos
    fireEvent.click(screen.getByText(/Explorar Produtos/i));
    
    // Verifica se navegou para a página de listagem
    await waitFor(() => {
      expect(screen.getByText(/Nossos Produtos/i)).toBeInTheDocument();
    });
  });
  
  test('Deve navegar da listagem para a página de produto individual', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para a listagem de produtos
    window.history.pushState({}, '', '/produtos');
    
    // Aguarda o carregamento da página de listagem
    await waitFor(() => {
      expect(screen.getByText(/Nossos Produtos/i)).toBeInTheDocument();
    });
    
    // Clica no primeiro produto
    const firstProduct = screen.getAllByTestId('product-card')[0];
    fireEvent.click(firstProduct);
    
    // Verifica se navegou para a página de produto individual
    await waitFor(() => {
      expect(screen.getByTestId('product-viewer')).toBeInTheDocument();
    });
  });
});

/**
 * Testes de integração para o visualizador 3D
 */
describe('Testes do visualizador 3D', () => {
  test('Deve carregar o modelo 3D na página de produto', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto específico
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento do visualizador 3D
    await waitFor(() => {
      expect(screen.getByTestId('product-viewer')).toBeInTheDocument();
      expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
    });
  });
  
  test('Deve permitir rotação do modelo 3D', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto específico
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento do visualizador 3D
    await waitFor(() => {
      expect(screen.getByTestId('product-viewer')).toBeInTheDocument();
    });
    
    // Simula eventos de mouse para rotação
    const canvas = screen.getByTestId('canvas-container');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 200, clientY: 100 });
    fireEvent.mouseUp(canvas);
    
    // Verifica se a rotação foi aplicada (verificação indireta através do estado do componente)
    expect(canvas).toHaveAttribute('data-rotated', 'true');
  });
});

/**
 * Testes de integração para o personalizador de produtos
 */
describe('Testes do personalizador de produtos', () => {
  test('Deve alterar a cor do produto ao selecionar uma opção', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto específico
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento do personalizador
    await waitFor(() => {
      expect(screen.getByTestId('product-customizer')).toBeInTheDocument();
    });
    
    // Seleciona uma cor diferente
    const colorOption = screen.getByTestId('color-option-blue');
    fireEvent.click(colorOption);
    
    // Verifica se a cor foi alterada
    await waitFor(() => {
      expect(colorOption).toHaveClass('selected');
      expect(screen.getByTestId('current-color')).toHaveTextContent('Azul');
    });
  });
  
  test('Deve alterar o material do produto ao selecionar uma opção', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto específico
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento do personalizador
    await waitFor(() => {
      expect(screen.getByTestId('product-customizer')).toBeInTheDocument();
    });
    
    // Seleciona um material diferente
    const materialOption = screen.getByTestId('material-option-leather');
    fireEvent.click(materialOption);
    
    // Verifica se o material foi alterado
    await waitFor(() => {
      expect(materialOption).toHaveClass('selected');
      expect(screen.getByTestId('current-material')).toHaveTextContent('Couro');
    });
  });
});

/**
 * Testes de integração para o carrinho de compras
 */
describe('Testes do carrinho de compras', () => {
  test('Deve adicionar produto ao carrinho', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto específico
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento da página de produto
    await waitFor(() => {
      expect(screen.getByText(/Adicionar ao Carrinho/i)).toBeInTheDocument();
    });
    
    // Adiciona o produto ao carrinho
    fireEvent.click(screen.getByText(/Adicionar ao Carrinho/i));
    
    // Verifica se o produto foi adicionado (indicador no ícone do carrinho)
    await waitFor(() => {
      expect(screen.getByTestId('cart-counter')).toHaveTextContent('1');
    });
    
    // Navega para o carrinho
    fireEvent.click(screen.getByTestId('cart-icon'));
    
    // Verifica se o produto está no carrinho
    await waitFor(() => {
      expect(screen.getByTestId('cart-items')).toBeInTheDocument();
      expect(screen.getAllByTestId('cart-item')).toHaveLength(1);
    });
  });
  
  test('Deve remover produto do carrinho', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto e adiciona ao carrinho
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento da página de produto
    await waitFor(() => {
      expect(screen.getByText(/Adicionar ao Carrinho/i)).toBeInTheDocument();
    });
    
    // Adiciona o produto ao carrinho
    fireEvent.click(screen.getByText(/Adicionar ao Carrinho/i));
    
    // Navega para o carrinho
    fireEvent.click(screen.getByTestId('cart-icon'));
    
    // Remove o produto do carrinho
    await waitFor(() => {
      expect(screen.getByTestId('remove-item')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId('remove-item'));
    
    // Verifica se o produto foi removido
    await waitFor(() => {
      expect(screen.queryByTestId('cart-item')).not.toBeInTheDocument();
      expect(screen.getByText(/Seu carrinho está vazio/i)).toBeInTheDocument();
    });
  });
});

/**
 * Testes de integração para o checkout
 */
describe('Testes do processo de checkout', () => {
  test('Deve navegar do carrinho para o checkout', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto e adiciona ao carrinho
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento da página de produto
    await waitFor(() => {
      expect(screen.getByText(/Adicionar ao Carrinho/i)).toBeInTheDocument();
    });
    
    // Adiciona o produto ao carrinho
    fireEvent.click(screen.getByText(/Adicionar ao Carrinho/i));
    
    // Navega para o carrinho
    fireEvent.click(screen.getByTestId('cart-icon'));
    
    // Clica no botão de finalizar compra
    await waitFor(() => {
      expect(screen.getByText(/Finalizar Compra/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/Finalizar Compra/i));
    
    // Verifica se navegou para o checkout
    await waitFor(() => {
      expect(screen.getByText(/Informações de Entrega/i)).toBeInTheDocument();
    });
  });
  
  test('Deve preencher formulário de checkout e avançar para pagamento', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para o checkout
    window.history.pushState({}, '', '/checkout');
    
    // Aguarda o carregamento da página de checkout
    await waitFor(() => {
      expect(screen.getByText(/Informações de Entrega/i)).toBeInTheDocument();
    });
    
    // Preenche o formulário
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'joao@exemplo.com' } });
    fireEvent.change(screen.getByTestId('input-address'), { target: { value: 'Rua Exemplo, 123' } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'São Paulo' } });
    fireEvent.change(screen.getByTestId('input-state'), { target: { value: 'SP' } });
    fireEvent.change(screen.getByTestId('input-zip'), { target: { value: '01234-567' } });
    
    // Avança para a etapa de pagamento
    fireEvent.click(screen.getByText(/Continuar para Pagamento/i));
    
    // Verifica se avançou para a etapa de pagamento
    await waitFor(() => {
      expect(screen.getByText(/Informações de Pagamento/i)).toBeInTheDocument();
    });
  });
});

/**
 * Testes de integração para o sistema de recomendações
 */
describe('Testes do sistema de recomendações', () => {
  test('Deve exibir produtos recomendados na página de produto', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto específico
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento das recomendações
    await waitFor(() => {
      expect(screen.getByText(/Produtos Recomendados/i)).toBeInTheDocument();
      expect(screen.getAllByTestId('recommendation-item').length).toBeGreaterThan(0);
    });
  });
  
  test('Deve navegar para um produto recomendado ao clicar', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Navega diretamente para um produto específico
    window.history.pushState({}, '', '/produto/1');
    
    // Aguarda o carregamento das recomendações
    await waitFor(() => {
      expect(screen.getAllByTestId('recommendation-item').length).toBeGreaterThan(0);
    });
    
    // Clica no primeiro produto recomendado
    const firstRecommendation = screen.getAllByTestId('recommendation-item')[0];
    const productId = firstRecommendation.getAttribute('data-product-id');
    fireEvent.click(firstRecommendation);
    
    // Verifica se navegou para o produto recomendado
    await waitFor(() => {
      expect(window.location.pathname).toBe(`/produto/${productId}`);
    });
  });
});

/**
 * Testes de responsividade
 */
describe('Testes de responsividade', () => {
  test('Deve exibir menu mobile em telas pequenas', async () => {
    // Simula uma tela de dispositivo móvel
    window.innerWidth = 480;
    window.innerHeight = 800;
    window.dispatchEvent(new Event('resize'));
    
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Aguarda o carregamento da página
    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    });
    
    // Clica no botão do menu mobile
    fireEvent.click(screen.getByTestId('mobile-menu-button'));
    
    // Verifica se o menu mobile foi aberto
    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu')).toHaveClass('open');
    });
  });
});

/**
 * Testes de acessibilidade
 */
describe('Testes de acessibilidade', () => {
  test('Elementos interativos devem ter atributos de acessibilidade', async () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );
    
    // Aguarda o carregamento da página inicial
    await waitFor(() => {
      expect(screen.getByText(/Descubra uma nova experiência de compras/i)).toBeInTheDocument();
    });
    
    // Verifica se os botões têm atributos de acessibilidade
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
    
    // Verifica se as imagens têm texto alternativo
    const images = screen.getAllByRole('img');
    images.forEach(image => {
      expect(image).toHaveAttribute('alt');
    });
  });
});
