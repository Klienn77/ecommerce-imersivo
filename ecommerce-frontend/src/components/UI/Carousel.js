/**
 * Componente Carousel
 *
 * Este componente exibe um carrossel de imagens ou conteúdo com navegação.
 * Foi corrigido para validar a existência dos dados antes de acessar propriedades.
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Estilos do componente
const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => props.translate}px);
`;

const CarouselSlide = styled.div`
  min-width: 100%;
  height: ${props => props.height || '400px'};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:rgb(255, 255, 255);
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CarouselContent = styled.div`
  padding: 20px;
  text-align: center;
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const CarouselDot = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  margin: 0 5px;
  background-color: ${props => props.$active ? '#007bff' : '#ccc'};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#007bff' : '#aaa'};
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }
`;

const Carousel = ({ items = [], height = '400px', autoplay = true, interval = 5000, renderItem }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translate, setTranslate] = useState(0);
  const containerRef = useRef(null);
  const hasItems = safeItems.length > 0;

  const updateTranslate = (index) => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    setTranslate(-width * index);
  };

  const nextSlide = () => {
    if (!hasItems) return;
    const newIndex = (currentIndex + 1) % safeItems.length;
    setCurrentIndex(newIndex);
    updateTranslate(newIndex);
  };

  const prevSlide = () => {
    if (!hasItems) return;
    const newIndex = (currentIndex - 1 + safeItems.length) % safeItems.length;
    setCurrentIndex(newIndex);
    updateTranslate(newIndex);
  };

  const goToSlide = (index) => {
    if (!hasItems) return;
    setCurrentIndex(index);
    updateTranslate(index);
  };

  useEffect(() => {
    if (autoplay && hasItems && safeItems.length > 1) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [currentIndex, autoplay, interval, hasItems, safeItems.length]);

  useEffect(() => {
    const handleResize = () => updateTranslate(currentIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  if (!hasItems) {
    return (
      <CarouselContainer ref={containerRef} style={{ height }}>
        <CarouselSlide height={height}>
          <CarouselContent>
            <h3>Nenhum item para exibir</h3>
          </CarouselContent>
        </CarouselSlide>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer ref={containerRef}>
      <CarouselTrack translate={translate}>
        {safeItems.map((item, index) => (
          <CarouselSlide key={index} height={height}>
            {renderItem ? renderItem(item) : (
              item.image ? (
                <CarouselImage src={item.image} alt={item.alt || `Slide ${index + 1}`} />
              ) : (
                <CarouselContent>
                  {item.content || <h3>Conteúdo do Slide {index + 1}</h3>}
                </CarouselContent>
              )
            )}
          </CarouselSlide>
        ))}
      </CarouselTrack>

      {safeItems.length > 1 && (
        <>
          <CarouselButton className="prev" onClick={prevSlide}>
            &#10094;
          </CarouselButton>
          <CarouselButton className="next" onClick={nextSlide}>
            &#10095;
          </CarouselButton>
          <CarouselDots>
            {safeItems.map((_, index) => (
              <CarouselDot
                key={index}
                onClick={() => goToSlide(index)}
                $active={index === currentIndex}
              />
            ))}
          </CarouselDots>
        </>
      )}
    </CarouselContainer>
  );
};

export default Carousel;
