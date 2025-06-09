/**
 * Componente de Recomendações Personalizadas com IA
 * 
 * Este componente é responsável por:
 * 1. Analisar preferências do usuário com base em interações
 * 2. Gerar recomendações de produtos relacionados
 * 3. Apresentar sugestões de forma atrativa
 * 4. Explicar o raciocínio por trás das recomendações
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Fundamentos de sistemas de recomendação
 * - Implementação básica de IA no frontend com TensorFlow.js
 * - Análise de dados de usuário para personalização
 * - Integração de modelos de IA com interfaces de usuário
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';

/**
 * Componente principal Recommendations
 * 
 * Este componente analisa as interações do usuário e gera recomendações
 * personalizadas com base em um modelo simples de IA.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.currentProduct - Produto atual sendo visualizado
 * @param {Array} props.viewHistory - Histórico de produtos visualizados
 * @param {Object} props.userPreferences - Preferências conhecidas do usuário
 */
const Recommendations = ({ currentProduct, viewHistory = [], userPreferences = {} }) => {
  // Estado para armazenar as recomendações geradas
  const [recommendations, setRecommendations] = useState([]);
  
  // Estado para controlar o carregamento do modelo
  const [isModelLoading, setIsModelLoading] = useState(true);
  
  // Referência para o modelo de IA
  const modelRef = useRef(null);
  
  // Efeito para carregar o modelo de IA (simulado para fins didáticos)
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        
        // Simulação de carregamento de modelo
        // Em um caso real, você carregaria um modelo treinado:
        // const model = await tf.loadLayersModel('path/to/model.json');
        
        // Para fins didáticos, criamos um modelo simples
        const model = createSimpleModel();
        
        // Armazenamos o modelo na referência
        modelRef.current = model;
        
        console.log('Modelo de recomendação carregado com sucesso');
        setIsModelLoading(false);
      } catch (error) {
        console.error('Erro ao carregar modelo:', error);
        setIsModelLoading(false);
      }
    };
    
    loadModel();
    
    // Limpeza ao desmontar o componente
    return () => {
      // Liberar recursos do modelo se necessário
      if (modelRef.current) {
        // Limpeza de recursos do TensorFlow
      }
    };
  }, []);
  
  // Efeito para gerar recomendações quando o produto atual muda
  useEffect(() => {
    if (!currentProduct || isModelLoading) return;
    
    // Gerar recomendações com base no produto atual e histórico
    generateRecommendations();
  }, [currentProduct, isModelLoading]);
  
  /**
   * Cria um modelo simples para fins didáticos
   * 
   * Em um caso real, você usaria um modelo pré-treinado com dados reais.
   * Este é apenas um exemplo para demonstrar o conceito.
   * 
   * @returns {Object} - Modelo simples para recomendações
   */
  const createSimpleModel = () => {
    // Em um caso real, este seria um modelo de rede neural treinado
    // Para fins didáticos, criamos uma função simples que simula recomendações
    
    return {
      predict: (features) => {
        // Simulação de predição baseada em características do produto
        // Retorna um tensor com pontuações para cada produto no catálogo
        return tf.tidy(() => {
          // Convertemos as características para tensor
          const featuresTensor = tf.tensor(features);
          
          // Simulamos uma operação de modelo
          // Em um caso real, isso seria uma inferência real do modelo
          const scores = tf.randomUniform([SAMPLE_PRODUCTS.length]);
          
          return scores;
        });
      }
    };
  };
  
  /**
   * Gera recomendações com base no produto atual e histórico
   * 
   * Este método combina várias estratégias de recomendação:
   * 1. Produtos similares (baseado em características)
   * 2. Produtos frequentemente comprados juntos
   * 3. Produtos populares na mesma categoria
   */
  const generateRecommendations = async () => {
    if (!modelRef.current || !currentProduct) return;
    
    try {
      // 1. Extrair características do produto atual
      const productFeatures = extractProductFeatures(currentProduct);
      
      // 2. Usar o modelo para prever pontuações para produtos do catálogo
      const scoresTensor = modelRef.current.predict(productFeatures);
      
      // 3. Converter tensor para array JavaScript
      const scores = await scoresTensor.array();
      
      // 4. Combinar produtos com suas pontuações
      const productsWithScores = SAMPLE_PRODUCTS.map((product, index) => ({
        ...product,
        score: scores[index]
      }));
      
      // 5. Filtrar o produto atual (não recomendar o mesmo produto)
      const filteredProducts = productsWithScores.filter(
        product => product.id !== currentProduct.id
      );
      
      // 6. Ordenar por pontuação (do maior para o menor)
      const sortedProducts = filteredProducts.sort((a, b) => b.score - a.score);
      
      // 7. Pegar os 4 produtos com maior pontuação
      const topRecommendations = sortedProducts.slice(0, 4);
      
      // 8. Adicionar explicações para cada recomendação
      const recommendationsWithReasons = topRecommendations.map(product => ({
        ...product,
        reason: generateRecommendationReason(product, currentProduct)
      }));
      
      // 9. Atualizar o estado com as recomendações
      setRecommendations(recommendationsWithReasons);
      
      // Limpeza de memória do TensorFlow
      tf.dispose(scoresTensor);
      
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      // Em caso de erro, usar abordagem de fallback
      generateFallbackRecommendations();
    }
  };
  
  /**
   * Extrai características relevantes de um produto para o modelo
   * 
   * @param {Object} product - Produto para extrair características
   * @returns {Array} - Array de características numéricas
   */
  const extractProductFeatures = (product) => {
    // Em um caso real, você extrairia características relevantes do produto
    // como categoria, preço, cor, material, etc.
    
    // Para fins didáticos, criamos um vetor simples
    return [
      product.category === 'shoes' ? 1 : 0,
      product.category === 'accessories' ? 1 : 0,
      product.category === 'clothing' ? 1 : 0,
      product.price / 1000, // Normalização do preço
      product.popularity / 10 // Normalização da popularidade
    ];
  };
  
  /**
   * Gera uma explicação para a recomendação
   * 
   * @param {Object} recommendedProduct - Produto recomendado
   * @param {Object} currentProduct - Produto atual
   * @returns {string} - Explicação da recomendação
   */
  const generateRecommendationReason = (recommendedProduct, currentProduct) => {
    // Lógica para gerar explicações personalizadas
    const reasons = [
      `Combina perfeitamente com ${currentProduct.name}`,
      `Outros clientes que compraram ${currentProduct.name} também gostaram deste`,
      `Baseado no seu interesse em ${currentProduct.category}`,
      `Complementa seu estilo atual`,
      `Tendência popular na categoria ${currentProduct.category}`
    ];
    
    // Selecionar uma razão com base em alguma lógica
    // Para fins didáticos, selecionamos aleatoriamente
    const randomIndex = Math.floor(Math.random() * reasons.length);
    return reasons[randomIndex];
  };
  
  /**
   * Gera recomendações de fallback quando o modelo falha
   * 
   * Esta é uma estratégia de backup que não depende do modelo de IA
   */
  const generateFallbackRecommendations = () => {
    // Filtrar produtos da mesma categoria
    const sameCategory = SAMPLE_PRODUCTS.filter(
      product => product.id !== currentProduct.id && 
                product.category === currentProduct.category
    );
    
    // Ordenar por popularidade
    const sorted = sameCategory.sort((a, b) => b.popularity - a.popularity);
    
    // Pegar os 4 mais populares
    const topProducts = sorted.slice(0, 4);
    
    // Adicionar razões genéricas
    const withReasons = topProducts.map(product => ({
      ...product,
      reason: `Produto popular na categoria ${product.category}`
    }));
    
    setRecommendations(withReasons);
  };
  
  /**
   * Registra interação do usuário com uma recomendação
   * 
   * @param {Object} product - Produto com o qual o usuário interagiu
   * @param {string} interactionType - Tipo de interação (view, click, add_to_cart)
   */
  const trackInteraction = (product, interactionType) => {
    // Em um sistema real, você enviaria estes dados para um backend
    // para melhorar o modelo de recomendação
    console.log('Interação registrada:', {
      productId: product.id,
      interactionType,
      timestamp: new Date().toISOString()
    });
    
    // Simulação de navegação para o produto clicado
    if (interactionType === 'click') {
      console.log('Navegando para:', product.name);
    }
  };
  
  return (
    <RecommendationsContainer>
      <RecommendationsHeader>
        <h2>Recomendações Personalizadas</h2>
        <p>Com base nas suas preferências e no produto atual</p>
      </RecommendationsHeader>
      
      {isModelLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Analisando suas preferências...</LoadingText>
        </LoadingContainer>
      ) : recommendations.length > 0 ? (
        <ProductGrid>
          {recommendations.map(product => (
            <ProductCard 
              key={product.id}
              onClick={() => trackInteraction(product, 'click')}
              onMouseEnter={() => trackInteraction(product, 'view')}
            >
              <ProductImage>
                <img src={product.image || '/assets/images/placeholder.jpg'} alt={product.name} />
              </ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>R$ {product.price.toFixed(2)}</ProductPrice>
                <RecommendationReason>{product.reason}</RecommendationReason>
              </ProductInfo>
              <AddToCartButton onClick={(e) => {
                e.stopPropagation();
                trackInteraction(product, 'add_to_cart');
              }}>
                Adicionar ao Carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductGrid>
      ) : (
        <NoRecommendationsMessage>
          Não foi possível gerar recomendações para este produto.
        </NoRecommendationsMessage>
      )}
      
      <ExplanationBox>
        <ExplanationTitle>Como funcionam nossas recomendações?</ExplanationTitle>
        <ExplanationText>
          Nosso sistema de IA analisa suas interações, preferências e o produto atual para
          recomendar itens que complementam sua escolha. Combinamos análise de similaridade,
          padrões de compra de outros clientes e tendências atuais para oferecer as melhores sugestões.
        </ExplanationText>
      </ExplanationBox>
    </RecommendationsContainer>
  );
};

/**
 * Dados de exemplo para fins didáticos
 */
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Tênis Esportivo Runner',
    category: 'shoes',
    price: 299.99,
    popularity: 9.2,
    image: '/assets/images/shoe1.jpg'
  },
  {
    id: 2,
    name: 'Tênis Casual Urban',
    category: 'shoes',
    price: 259.99,
    popularity: 8.7,
    image: '/assets/images/shoe2.jpg'
  },
  {
    id: 3,
    name: 'Meia Esportiva Premium',
    category: 'accessories',
    price: 49.99,
    popularity: 7.5,
    image: '/assets/images/socks.jpg'
  },
  {
    id: 4,
    name: 'Camiseta Dry-Fit',
    category: 'clothing',
    price: 89.99,
    popularity: 8.9,
    image: '/assets/images/tshirt.jpg'
  },
  {
    id: 5,
    name: 'Shorts Esportivo',
    category: 'clothing',
    price: 79.99,
    popularity: 8.3,
    image: '/assets/images/shorts.jpg'
  },
  {
    id: 6,
    name: 'Boné Esportivo',
    category: 'accessories',
    price: 59.99,
    popularity: 7.8,
    image: '/assets/images/cap.jpg'
  },
  {
    id: 7,
    name: 'Mochila Esportiva',
    category: 'accessories',
    price: 129.99,
    popularity: 8.1,
    image: '/assets/images/backpack.jpg'
  },
  {
    id: 8,
    name: 'Jaqueta Corta-Vento',
    category: 'clothing',
    price: 199.99,
    popularity: 8.6,
    image: '/assets/images/jacket.jpg'
  }
];

/**
 * Componentes estilizados com styled-components
 */
const RecommendationsContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-top: 40px;
`;

const RecommendationsHeader = styled.div`
  margin-bottom: 25px;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #666;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  height: 180px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
`;

const ProductPrice = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #3498db;
  margin-bottom: 10px;
`;

const RecommendationReason = styled.div`
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-bottom: 10px;
  min-height: 36px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 12px 0;
  background-color: #3498db;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const NoRecommendationsMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  font-size: 16px;
`;

const ExplanationBox = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #3498db;
`;

const ExplanationTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
`;

const ExplanationText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`;

export default Recommendations;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o TensorFlow.js é utilizado para implementar IA no navegador
 * 2. Entenda como as características dos produtos são extraídas e processadas
 * 3. Observe como as recomendações são geradas e apresentadas ao usuário
 * 4. Estude como as interações do usuário são rastreadas para melhorar as recomendações
 * 
 * DESAFIOS PARA PRATICAR:
 * 
 * 1. Implemente um modelo real de recomendação usando TensorFlow.js
 * 2. Adicione mais métricas para análise de similaridade entre produtos
 * 3. Crie um sistema para salvar preferências do usuário no localStorage
 * 4. Implemente filtros para as recomendações (por preço, categoria, etc.)
 * 
 * NOTA SOBRE IA NO FRONTEND:
 * 
 * Em um sistema real de produção, a parte pesada do processamento de IA
 * geralmente é feita no backend. No frontend, podemos usar modelos pré-treinados
 * e mais leves para personalização em tempo real e melhorar a experiência do usuário.
 * Este exemplo é simplificado para fins didáticos.
 */
