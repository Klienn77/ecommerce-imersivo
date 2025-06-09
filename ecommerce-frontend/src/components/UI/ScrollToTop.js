/**
 * Componente ScrollToTop
 * 
 * Este componente faz com que a página role para o topo quando a rota muda.
 * É um componente utilitário que não renderiza nada visualmente.
 * 
 
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que rola a página para o topo quando a rota muda
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente não renderiza nada
};

export default ScrollToTop;
