/**
 * Contexto de Produtos para o E-commerce Imersivo
 * 
 * Este contexto gerencia o estado global relacionado aos produtos,
 * incluindo listagem, filtragem, busca e detalhes de produtos.
 * Corrigido para evitar flicker de imagens durante buscas.
 */
import React, { createContext, useState, useEffect } from 'react';
import productDataImport from '../data/productData';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    brand: '',
    priceRange: [0, 1000],
    sortBy: 'featured'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProducts(productDataImport);
    setFilteredProducts(productDataImport);

    const uniqueCategories = [...new Set(productDataImport.map(p => p.category))];
    const categoriesObjects = uniqueCategories.map((category, index) => ({
      id: index + 1,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      slug: category.toLowerCase()
    }));
    setCategories(categoriesObjects);

    const uniqueBrands = [...new Set(productDataImport.map(p => p.brand))];
    setBrands(uniqueBrands);
  }, []);

  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
  };

  const getProductsByCategory = (categorySlug) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) return [];
    return products.filter(product =>
      product.category.toLowerCase() === category.slug
    );
  };

  const applyFilters = (filters) => {
    setActiveFilters(filters);

    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.brand) {
      filtered = filtered.filter(product =>
        product.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const searchProducts = (term) => {
    const search = term.trim().toLowerCase();
    setSearchTerm(term);

    if (!search) {
      setFilteredProducts([...products]);
      return [...products];
    }

    const searched = products.filter(product => {
      const matches = [
        product.name,
        product.description,
        product.brand,
        product.category,
        ...(product.tags || [])
      ].some(field =>
        typeof field === 'string'
          ? field.toLowerCase().includes(search)
          : false
      );
      return matches;
    });

    // Importante: atualizar o estado filteredProducts para que a UI reflita os resultados
    setFilteredProducts(searched);
    return searched;
  };

  const getRelatedProducts = (productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    let related = products.filter(p =>
      p.id !== product.id && p.category === product.category
    );

    if (related.length < limit) {
      const sameBrand = products.filter(p =>
        p.id !== product.id &&
        p.category !== product.category &&
        p.brand === product.brand
      );
      related = [...related, ...sameBrand];
    }

    return related.slice(0, limit);
  };

  const contextValue = {
    products,
    filteredProducts,
    categories,
    brands,
    activeFilters,
    searchTerm,
    getProductById,
    getProductsByCategory,
    applyFilters,
    searchProducts,
    getRelatedProducts
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
