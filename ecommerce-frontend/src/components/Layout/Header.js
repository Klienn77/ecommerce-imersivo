/**
 * Componente Header do E-commerce Imersivo
 * 
 * Este componente é responsável por:
 * 1. Exibir a barra de navegação principal
 * 2. Fornecer acesso às categorias e páginas principais
 * 3. Mostrar ícones de carrinho, favoritos e perfil
 * 4. Implementar busca de produtos
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Navegação em aplicações React
 * - Componentes responsivos
 * - Integração com contextos globais
 * - Interação com usuário
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { UserContext } from '../../context/UserContext';

// Importação de hooks personalizados
import { useCart, useUser, useProducts } from '../../hooks/useHooks';

/**
 * Componente principal Header
 */
const Header = () => {
  // Hooks de contexto
  const theme = useTheme();

  
  
  const { cart, getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useUser();
  const { categories } = useProducts();
  
  // Estado local
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  
  // Referências
  const searchInputRef = useRef(null);
  const categoryMenuRef = useRef(null);
  
  // Hooks de navegação
  const navigate = useNavigate();
  const location = useLocation();
  
  // Efeito para fechar menu ao navegar
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsCategoryMenuOpen(false);
  }, [location.pathname]);
  
  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Efeito para focar input de busca quando aberto
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Efeito para fechar menu de categorias ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  /**
   * Manipula envio do formulário de busca
   * 
   * @param {Event} e - Evento de formulário
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };
  
  /**
   * Alterna visibilidade do menu mobile
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };
  
  /**
   * Alterna visibilidade da busca
   */
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };
  
  /**
   * Alterna visibilidade do menu de categorias
   */
  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };
  
  // Função para alternar tema (simulada para manter compatibilidade)
  const toggleTheme = () => {
    console.warn('toggleTheme não está disponível nesta versão. Use ThemeProvider do styled-components para gerenciar o tema.');
  };
  
  // Determinar se o tema é escuro (simulado para compatibilidade)
  const isDark = theme.mode === 'dark';
  
  return (
    <HeaderContainer scrolled={isScrolled}>
      <HeaderContent>
        {/* Logo */}
        <LogoContainer>
          <Logo to="/">
            <LogoIcon>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </LogoIcon>
            <LogoText>E-Shop 3D</LogoText>
          </Logo>
        </LogoContainer>
        
        {/* Navegação principal (desktop) */}
        <NavDesktop>
          <NavItem>
            <NavLink 
              to="/products"
              onMouseEnter={toggleCategoryMenu}
            >
              Categorias
              <NavIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </NavIcon>
            </NavLink>
            
            {/* Menu dropdown de categorias */}
            {isCategoryMenuOpen && (
              <CategoryMenu ref={categoryMenuRef} onMouseLeave={() => setIsCategoryMenuOpen(false)}>
                {categories.map(category => (
                  <CategoryMenuItem key={category.id}>
                    <CategoryMenuLink to={`/products/category/${category.slug}`}>
                      {category.name}
                    </CategoryMenuLink>
                  </CategoryMenuItem>
                ))}
              </CategoryMenu>
            )}
          </NavItem>
          <NavItem>
            <NavLink to="/products/category/running">Esportivos</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/products/category/casual">Casuais</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/products/category/skate">Lançamentos</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/products/category/clothing">Promoções</NavLink>
          </NavItem>
        </NavDesktop>
        
        {/* Ações do usuário */}
        <UserActions>
          {/* Botão de busca */}
          <ActionButton onClick={toggleSearch} aria-label="Buscar">
            <ActionIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </ActionIcon>
          </ActionButton>
          
          {/* Botão de tema */}
          <ActionButton onClick={toggleTheme} aria-label="Alternar tema">
            <ActionIcon>
              {isDark ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </ActionIcon>
          </ActionButton>
          
          {/* Botão de usuário */}
          <ActionButton 
            as={Link} 
            to={isAuthenticated ? "/account" : "/login"}
            aria-label="Perfil"
          >
            <ActionIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </ActionIcon>
          </ActionButton>
          
          {/* Botão de carrinho */}
          <ActionButton as={Link} to="/cart" aria-label="Carrinho">
            <ActionIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </ActionIcon>
            {getTotalItems() > 0 && (
              <CartBadge>{getTotalItems()}</CartBadge>
            )}
          </ActionButton>
          
          {/* Botão de menu mobile */}
          <MenuButton onClick={toggleMenu} aria-label="Menu">
            <MenuIcon open={isMenuOpen}>
              <span></span>
              <span></span>
              <span></span>
            </MenuIcon>
          </MenuButton>
        </UserActions>
      </HeaderContent>
      
      {/* Barra de busca */}
      <SearchBar open={isSearchOpen}>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit" aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </SearchButton>
          <CloseSearchButton 
            type="button" 
            onClick={() => setIsSearchOpen(false)}
            aria-label="Fechar busca"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseSearchButton>
        </SearchForm>
      </SearchBar>
      
      {/* Menu mobile */}
      <MobileMenu open={isMenuOpen}>
        <MobileNavItem>
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Início
          </MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink to="/products" onClick={() => setIsMenuOpen(false)}>
            Todos os Produtos
          </MobileNavLink>
        </MobileNavItem>
        
        {/* Categorias no menu mobile */}
        <MobileNavSection>Categorias</MobileNavSection>
        {categories.slice(0, 6).map(category => (
          <MobileNavItem key={category.id}>
            <MobileNavLink 
              to={`/products/category/${category.slug}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {category.name}
            </MobileNavLink>
          </MobileNavItem>
        ))}
        
        {/* Ações de usuário no menu mobile */}
        <MobileNavSection>Minha Conta</MobileNavSection>
        {isAuthenticated ? (
          <>
            <MobileNavItem>
              <MobileNavLink to="/account" onClick={() => setIsMenuOpen(false)}>
                Meu Perfil
              </MobileNavLink>
            </MobileNavItem>
            <MobileNavItem>
              <MobileNavLink to="/account/orders" onClick={() => setIsMenuOpen(false)}>
                Meus Pedidos
              </MobileNavLink>
            </MobileNavItem>
            <MobileNavItem>
              <MobileNavButton onClick={() => { logout(); setIsMenuOpen(false); }}>
                Sair
              </MobileNavButton>
            </MobileNavItem>
          </>
        ) : (
          <>
            <MobileNavItem>
              <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                Entrar
              </MobileNavLink>
            </MobileNavItem>
            <MobileNavItem>
              <MobileNavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                Cadastrar
              </MobileNavLink>
            </MobileNavItem>
          </>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
};

/**
 * Componentes estilizados
 */
const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.scrolled ? props.theme.shadows.md : 'none'};
  transition: box-shadow 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  flex: 1;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${props => props.theme.colors.dark};
`;

const LogoIcon = styled.div`
  margin-right: 10px;
  color: ${props => props.theme.colors.primary};
`;

const LogoText = styled.div`
  font-size: 20px;
  font-weight: 700;
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const NavDesktop = styled.nav`
  display: flex;
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
  margin: 0 10px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px;
  color: ${props => props.theme.colors.dark};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NavIcon = styled.div`
  margin-left: 5px;
`;

const CategoryMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: ${props => props.theme.colors.white};
  border-radius: 4px;
  box-shadow: ${props => props.theme.shadows.md};
  padding: 10px 0;
  z-index: 100;
`;

const CategoryMenuItem = styled.div`
  padding: 5px 0;
`;

const CategoryMenuLink = styled(Link)`
  display: block;
  padding: 8px 20px;
  color: ${props => props.theme.colors.dark};
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.primary};
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 10px;
  margin-left: 5px;
  cursor: pointer;
  color: ${props => props.theme.colors.dark};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 10px;
  margin-left: 5px;
  cursor: pointer;
  color: ${props => props.theme.colors.dark};
  display: none;
  
  @media (max-width: 992px) {
    display: block;
  }
`;

const MenuIcon = styled.div`
  width: 24px;
  height: 18px;
  position: relative;
  
  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background-color: ${props => props.theme.colors.dark};
    border-radius: 2px;
    transition: all 0.3s ease;
    
    &:nth-child(1) {
      top: ${props => props.open ? '8px' : '0'};
      transform: ${props => props.open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      top: 8px;
      opacity: ${props => props.open ? '0' : '1'};
    }
    
    &:nth-child(3) {
      top: ${props => props.open ? '8px' : '16px'};
      transform: ${props => props.open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const SearchBar = styled.div`
  display: ${props => props.open ? 'block' : 'none'};
  padding: 10px 20px;
  background-color: ${props => props.theme.colors.gray[100]};
  border-top: 1px solid ${props => props.theme.colors.gray[300]};
`;

const SearchForm = styled.form`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 50px 12px 15px;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[600]};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CloseSearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[600]};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileMenu = styled.nav`
  display: ${props => props.open ? 'block' : 'none'};
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 20px;
  
  @media (min-width: 993px) {
    display: none;
  }
`;

const MobileNavItem = styled.div`
  margin-bottom: 10px;
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 10px 0;
  color: ${props => props.theme.colors.dark};
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileNavButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 0;
  color: ${props => props.theme.colors.dark};
  background: none;
  border: none;
  font-weight: 500;
  font-size: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileNavSection = styled.div`
  font-weight: 700;
  color: ${props => props.theme.colors.gray[600]};
  margin: 20px 0 10px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export default Header;
