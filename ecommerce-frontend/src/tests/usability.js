/**
 * Script para executar testes manuais de usabilidade
 * 
 * Este arquivo contém um roteiro para testes manuais de usabilidade
 * que complementam os testes automatizados de integração.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

const usabilityTests = {
  /**
   * Testes de navegação e fluxo do usuário
   */
  navigationTests: [
    {
      name: 'Navegação pela página inicial',
      steps: [
        '1. Abrir a página inicial',
        '2. Verificar se o carrossel de destaques está funcionando',
        '3. Clicar em cada categoria na barra de navegação',
        '4. Verificar se a rolagem suave está funcionando',
        '5. Testar o botão de voltar ao topo'
      ],
      expectedResults: 'Navegação fluida e intuitiva sem erros ou atrasos'
    },
    {
      name: 'Filtros e ordenação de produtos',
      steps: [
        '1. Acessar a página de listagem de produtos',
        '2. Testar cada filtro de categoria',
        '3. Testar cada opção de ordenação (preço, popularidade, etc.)',
        '4. Combinar múltiplos filtros',
        '5. Limpar todos os filtros'
      ],
      expectedResults: 'Filtros aplicados corretamente, produtos atualizados instantaneamente'
    }
  ],
  
  /**
   * Testes de visualização 3D
   */
  viewer3DTests: [
    {
      name: 'Controles de câmera do visualizador 3D',
      steps: [
        '1. Acessar a página de um produto com visualização 3D',
        '2. Testar rotação do modelo com mouse/touch',
        '3. Testar zoom com scroll/pinch',
        '4. Testar botões de visualização predefinida (frente, lado, cima)',
        '5. Verificar se a iluminação se ajusta corretamente'
      ],
      expectedResults: 'Controles responsivos e intuitivos, modelo renderizado corretamente'
    },
    {
      name: 'Desempenho do visualizador 3D',
      steps: [
        '1. Carregar o visualizador 3D em diferentes dispositivos',
        '2. Verificar tempo de carregamento inicial',
        '3. Testar fluidez da rotação e zoom',
        '4. Alternar rapidamente entre diferentes produtos',
        '5. Testar em conexões de internet mais lentas'
      ],
      expectedResults: 'Desempenho aceitável em todos os dispositivos, sem travamentos'
    }
  ],
  
  /**
   * Testes de personalização de produtos
   */
  customizationTests: [
    {
      name: 'Alteração de cores e materiais',
      steps: [
        '1. Acessar a página de um produto personalizável',
        '2. Testar cada opção de cor disponível',
        '3. Testar cada opção de material disponível',
        '4. Verificar se o modelo 3D atualiza instantaneamente',
        '5. Verificar se o preço atualiza conforme as opções selecionadas'
      ],
      expectedResults: 'Alterações aplicadas instantaneamente ao modelo 3D, preço atualizado corretamente'
    },
    {
      name: 'Personalização de componentes',
      steps: [
        '1. Acessar a página de um produto com componentes personalizáveis',
        '2. Adicionar/remover componentes opcionais',
        '3. Alterar configurações de cada componente',
        '4. Verificar se as incompatibilidades são tratadas corretamente',
        '5. Verificar se o resumo da personalização está correto'
      ],
      expectedResults: 'Componentes adicionados/removidos corretamente, incompatibilidades sinalizadas'
    }
  ],
  
  /**
   * Testes de carrinho e checkout
   */
  checkoutTests: [
    {
      name: 'Adição e remoção de produtos do carrinho',
      steps: [
        '1. Adicionar diferentes produtos ao carrinho',
        '2. Alterar a quantidade de cada produto',
        '3. Remover produtos do carrinho',
        '4. Verificar se o subtotal é calculado corretamente',
        '5. Testar o botão de esvaziar carrinho'
      ],
      expectedResults: 'Carrinho atualizado corretamente, cálculos precisos'
    },
    {
      name: 'Processo de checkout',
      steps: [
        '1. Iniciar o processo de checkout com produtos no carrinho',
        '2. Preencher informações de entrega',
        '3. Selecionar método de envio',
        '4. Preencher informações de pagamento',
        '5. Finalizar pedido e verificar página de confirmação'
      ],
      expectedResults: 'Processo de checkout fluido, validações funcionando, confirmação exibida'
    }
  ],
  
  /**
   * Testes de recomendações personalizadas
   */
  recommendationTests: [
    {
      name: 'Qualidade das recomendações',
      steps: [
        '1. Visualizar vários produtos de uma categoria específica',
        '2. Verificar se as recomendações se ajustam ao histórico de navegação',
        '3. Adicionar produtos ao carrinho',
        '4. Verificar se as recomendações de cross-selling são relevantes',
        '5. Testar após login/logout para verificar persistência'
      ],
      expectedResults: 'Recomendações relevantes e personalizadas baseadas no comportamento do usuário'
    }
  ],
  
  /**
   * Testes de responsividade
   */
  responsiveTests: [
    {
      name: 'Layout em diferentes dispositivos',
      steps: [
        '1. Testar em desktop (1920x1080)',
        '2. Testar em tablet (768x1024)',
        '3. Testar em smartphone (375x667)',
        '4. Verificar adaptação de elementos como carrossel e grade de produtos',
        '5. Testar orientação retrato e paisagem em dispositivos móveis'
      ],
      expectedResults: 'Layout adaptado corretamente a todos os tamanhos de tela'
    },
    {
      name: 'Interações touch em dispositivos móveis',
      steps: [
        '1. Testar gestos de swipe no carrossel',
        '2. Testar pinch-to-zoom no visualizador 3D',
        '3. Verificar tamanho de áreas clicáveis para touch',
        '4. Testar menu mobile e navegação',
        '5. Verificar formulários e teclado virtual'
      ],
      expectedResults: 'Interações touch funcionando naturalmente, elementos dimensionados adequadamente'
    }
  ],
  
  /**
   * Testes de acessibilidade
   */
  accessibilityTests: [
    {
      name: 'Navegação por teclado',
      steps: [
        '1. Navegar por toda a interface usando apenas Tab e Enter',
        '2. Verificar se a ordem de tabulação é lógica',
        '3. Testar atalhos de teclado',
        '4. Verificar indicadores de foco visíveis',
        '5. Testar interação com elementos complexos (visualizador 3D, personalizador)'
      ],
      expectedResults: 'Navegação completa possível apenas com teclado, foco sempre visível'
    },
    {
      name: 'Compatibilidade com leitores de tela',
      steps: [
        '1. Testar com leitor de tela (NVDA, VoiceOver)',
        '2. Verificar descrições alternativas para imagens',
        '3. Verificar rótulos em campos de formulário',
        '4. Testar anúncios dinâmicos (mensagens de erro, confirmações)',
        '5. Verificar landmarks e estrutura semântica'
      ],
      expectedResults: 'Conteúdo acessível e compreensível através de leitores de tela'
    }
  ],
  
  /**
   * Testes de desempenho
   */
  performanceTests: [
    {
      name: 'Tempo de carregamento inicial',
      steps: [
        '1. Medir tempo de carregamento da página inicial',
        '2. Medir tempo de carregamento da listagem de produtos',
        '3. Medir tempo de carregamento da página de produto com visualizador 3D',
        '4. Testar em diferentes conexões (4G, 3G)',
        '5. Verificar carregamento progressivo de imagens e modelos'
      ],
      expectedResults: 'Tempos de carregamento aceitáveis, feedback visual durante carregamento'
    },
    {
      name: 'Desempenho em uso prolongado',
      steps: [
        '1. Navegar por múltiplas páginas sem recarregar',
        '2. Alternar entre vários produtos com visualização 3D',
        '3. Adicionar e remover muitos itens do carrinho',
        '4. Realizar personalizações complexas',
        '5. Monitorar uso de memória e CPU'
      ],
      expectedResults: 'Desempenho consistente ao longo do tempo, sem degradação ou vazamentos de memória'
    }
  ]
};

// Exporta o roteiro de testes para uso na aplicação
export default usabilityTests;
