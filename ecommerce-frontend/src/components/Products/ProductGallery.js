/**
 * Componente ProductGallery
 * 
 * Galeria de imagens para a página de produto.
 * 
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  order: 2;
  margin-top: 10px;
  
  @media (min-width: 768px) {
    flex-direction: column;
    order: 1;
    margin-top: 0;
    margin-right: 15px;
    width: 80px;
  }
`;

const ThumbnailButton = styled.button`
  width: 60px;
  height: 60px;
  border: 2px solid ${props => props.active ? '#3f51b5' : 'transparent'};
  border-radius: 4px;
  overflow: hidden;
  padding: 0;
  margin: 0 5px 5px 0;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #3f51b5;
  }
  
  @media (min-width: 768px) {
    margin: 0 0 10px 0;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MainImageContainer = styled.div`
  flex: 1;
  order: 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    order: 2;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ZoomOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ZoomedImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
`;

/**
 * Componente de galeria de imagens para a página de produto
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.images - Array de URLs das imagens do produto
 * @param {string} props.alt - Texto alternativo para as imagens
 */
const ProductGallery = ({
  images = [],
  alt = 'Imagem do produto',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  
  // Se não houver imagens, exibir uma imagem padrão
  if (images.length === 0) {
    images = ['https://placehold.co/300x300?text=Produto'];
  }
  
  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };
  
  const handleMainImageClick = () => {
    setZoomOpen(true);
  };
  
  const handleCloseZoom = () => {
    setZoomOpen(false);
  };
  
  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // Manipulador de teclas para navegação no zoom
  const handleKeyDown = (e) => {
    if (zoomOpen) {
      if (e.key === 'Escape') {
        handleCloseZoom();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    }
  };
  
  // Adicionar event listener para teclas quando o zoom estiver aberto
  React.useEffect(() => {
    if (zoomOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [zoomOpen]);
  
  return (
    <GalleryContainer data-testid="product-gallery">
      <ThumbnailsContainer>
        {images.map((image, index) => (
          <ThumbnailButton
            key={index}
            active={index === activeIndex}
            onClick={() => handleThumbnailClick(index)}
            aria-label={`Ver imagem ${index + 1} de ${images.length}`}
          >
            <ThumbnailImage src={image} alt={`${alt} - Miniatura ${index + 1}`} />
          </ThumbnailButton>
        ))}
      </ThumbnailsContainer>
      
      <MainImageContainer onClick={handleMainImageClick}>
        <MainImage 
          src={images[activeIndex]} 
          alt={`${alt} - Imagem ${activeIndex + 1}`} 
        />
      </MainImageContainer>
      
      {zoomOpen && (
        <ZoomOverlay>
          <CloseButton onClick={handleCloseZoom} aria-label="Fechar zoom">
            &times;
          </CloseButton>
          
          <NavigationButton 
            className="prev" 
            onClick={handlePrevImage}
            aria-label="Imagem anterior"
          >
            &#10094;
          </NavigationButton>
          
          <ZoomedImage 
            src={images[activeIndex]} 
            alt={`${alt} - Imagem ${activeIndex + 1} ampliada`} 
          />
          
          <NavigationButton 
            className="next" 
            onClick={handleNextImage}
            aria-label="Próxima imagem"
          >
            &#10095;
          </NavigationButton>
        </ZoomOverlay>
      )}
    </GalleryContainer>
  );
};

export default ProductGallery;
