/**
 * Hooks personalizados para o E-commerce Imersivo
 * 
 * Este arquivo contém hooks React personalizados que:
 * 1. Facilitam o acesso aos contextos da aplicação
 * 2. Encapsulam lógicas comuns reutilizáveis
 * 3. Simplificam a integração de componentes com o estado global
 * 4. Melhoram a legibilidade e manutenção do código
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Criação e uso de hooks personalizados em React
 * - Encapsulamento de lógica para reutilização
 * - Integração eficiente com Context API
 * - Separação de responsabilidades no código
 */

import { useContext, useState, useEffect, useCallback } from 'react';
import { useTheme as useStyledTheme } from 'styled-components';
import { CartContext } from '../context/CartContext';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';

/**
 * Hook para acessar o contexto de carrinho
 * 
 * @returns {Object} - Valores e métodos do contexto de carrinho
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  
  return context;
};

/**
 * Hook para acessar o contexto de produtos
 * 
 * @returns {Object} - Valores e métodos do contexto de produtos
 */
export const useProducts = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  
  return context;
};

/**
 * Hook para acessar o contexto de usuário
 * 
 * @returns {Object} - Valores e métodos do contexto de usuário
 */
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  
  return context;
};

/**
 * Hook para acessar o tema do styled-components
 * 
 * @returns {Object} - Objeto de tema do styled-components
 */
export const useTheme = () => {
  // Usa o hook useTheme do styled-components
  const theme = useStyledTheme();
  
  // Adiciona funcionalidade de toggle para compatibilidade com código existente
  const isDark = theme.mode === 'dark';
  
  // Simula a API anterior para manter compatibilidade
  return {
    theme: theme,
    isDark: isDark,
    toggleTheme: () => {
      console.warn('toggleTheme não está disponível nesta versão. Use ThemeProvider do styled-components para gerenciar o tema.');
    }
  };
};

/**
 * Hook para gerenciar formulários
 * 
 * @param {Object} initialValues - Valores iniciais do formulário
 * @param {Function} validate - Função de validação
 * @param {Function} onSubmit - Função a ser chamada no envio do formulário
 * @returns {Object} - Estado e manipuladores do formulário
 */
export const useForm = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Efeito para validar quando valores mudam e foram tocados
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validate ? validate(values) : {};
      setErrors(validationErrors);
    }
  }, [values, touched, validate]);
  
  // Manipulador de mudança de campo
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: fieldValue
    });
  };
  
  // Manipulador de blur (perda de foco)
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
  };
  
  // Manipulador de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marca todos os campos como tocados
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Valida todos os campos
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
    
    // Se não houver erros, envia o formulário
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      if (onSubmit) {
        onSubmit(values);
      }
    }
  };
  
  // Reseta o formulário
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };
  
  // Define um valor específico
  const setValue = (name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValue
  };
};

/**
 * Hook para gerenciar paginação
 * 
 * @param {Array} items - Lista de itens a paginar
 * @param {number} itemsPerPage - Itens por página
 * @returns {Object} - Estado e manipuladores da paginação
 */
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calcula índices para a página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Obtém itens da página atual
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  
  // Manipulador de mudança de página
  const paginate = (pageNumber) => {
    // Garante que o número da página seja válido
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };
  
  // Vai para a próxima página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Vai para a página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return {
    currentPage,
    totalPages,
    currentItems,
    paginate,
    nextPage,
    prevPage
  };
};

/**
 * Hook para gerenciar visualização de produto
 * 
 * @param {number|string} productId - ID do produto
 * @returns {Object} - Estado e manipuladores da visualização
 */
export const useProductView = (productId) => {
  const { getProductById, relatedProducts } = useProducts();
  const { addToViewHistory } = useUser();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Efeito para carregar dados do produto
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const productData = getProductById(productId);
      
      if (productData) {
        setProduct(productData);
        
        // Registra visualização no histórico do usuário
        addToViewHistory(productData);
      } else {
        setError('Produto não encontrado');
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar produto');
    } finally {
      setIsLoading(false);
    }
  }, [productId, getProductById, addToViewHistory]);
  
  // Obtém produtos relacionados
  const related = useCallback(() => {
    if (!product) return [];
    return relatedProducts(product.id);
  }, [product, relatedProducts]);
  
  return {
    product,
    isLoading,
    error,
    related
  };
};

/**
 * Hook para gerenciar personalização de produto
 * 
 * @param {Object} initialCustomization - Personalização inicial
 * @returns {Object} - Estado e manipuladores da personalização
 */
export const useProductCustomization = (initialCustomization) => {
  const [customization, setCustomization] = useState(initialCustomization || {
    colors: {
      body: '#3498db',
      sole: '#2c3e50',
      laces: '#ecf0f1',
      logo: '#e74c3c'
    },
    materials: {
      body: 'leather',
      sole: 'rubber'
    },
    components: {
      laces: true,
      logo: true
    }
  });
  
  // Atualiza uma cor específica
  const updateColor = (part, color) => {
    setCustomization(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [part]: color
      }
    }));
  };
  
  // Atualiza um material específico
  const updateMaterial = (part, material) => {
    setCustomization(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        [part]: material
      }
    }));
  };
  
  // Atualiza um componente específico
  const toggleComponent = (component) => {
    setCustomization(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [component]: !prev.components[component]
      }
    }));
  };
  
  // Reseta para a personalização inicial
  const resetCustomization = () => {
    setCustomization(initialCustomization);
  };
  
  return {
    customization,
    updateColor,
    updateMaterial,
    toggleComponent,
    resetCustomization,
    setCustomization
  };
};

/**
 * Hook para gerenciar filtros de produtos
 * 
 * @param {Object} initialFilters - Filtros iniciais
 * @returns {Object} - Estado e manipuladores dos filtros
 */
export const useProductFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters || {
    price: { min: 0, max: 1000 },
    colors: [],
    sizes: [],
    brands: [],
    categories: []
  });
  
  // Atualiza um filtro específico
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Adiciona um valor a um filtro de array
  const addFilterValue = (filterName, value) => {
    setFilters(prev => {
      if (!Array.isArray(prev[filterName])) {
        return prev;
      }
      
      return {
        ...prev,
        [filterName]: [...prev[filterName], value]
      };
    });
  };
  
  // Remove um valor de um filtro de array
  const removeFilterValue = (filterName, value) => {
    setFilters(prev => {
      if (!Array.isArray(prev[filterName])) {
        return prev;
      }
      
      return {
        ...prev,
        [filterName]: prev[filterName].filter(item => item !== value)
      };
    });
  };
  
  // Reseta todos os filtros
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  return {
    filters,
    updateFilter,
    addFilterValue,
    removeFilterValue,
    resetFilters,
    setFilters
  };
};

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como os hooks personalizados encapsulam lógica reutilizável
 * 2. Observe como os hooks simplificam o acesso aos contextos
 * 3. Estude como a separação de responsabilidades melhora a manutenção do código
 * 4. Analise como os hooks podem ser combinados para criar funcionalidades complexas
 */
