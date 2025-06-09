/**
 * Componente de Visualização 3D de Produtos
 * 
 * Este componente é responsável por:
 * 1. Renderizar modelos 3D de produtos usando Three.js e React Three Fiber
 * 2. Permitir interação com o modelo (rotação, zoom)
 * 3. Aplicar personalizações em tempo real (cores, materiais)
 * 4. Fornecer uma experiência imersiva de visualização
 * 
 * CONCEITOS DE APRENDIZADO:
 * - Integração de Three.js com React através do React Three Fiber
 * - Carregamento e manipulação de modelos 3D
 * - Aplicação de materiais e texturas em tempo real
 * - Controles de câmera e iluminação para visualização 3D
 */

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, ContactShadows } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import styled from 'styled-components';

/**
 * Componente principal ProductViewer
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.modelPath - Caminho para o modelo 3D
 * @param {Object} props.customization - Opções de personalização
 * @param {Function} props.onInteraction - Callback para interações
 */
const ProductViewer = ({ modelPath, customization, onInteraction }) => {
  // Estado para controlar carregamento
  const [isLoading, setIsLoading] = useState(true);
  
  // Manipula interações com o modelo
  const handleInteraction = (event) => {
    if (onInteraction) {
      onInteraction(event);
    }
  };
  
  // Efeito para simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ViewerContainer>
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>Carregando modelo 3D...</LoadingText>
        </LoadingOverlay>
      )}
      
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 50 }}
        onPointerDown={handleInteraction}
      >
        <color attach="background" args={['#f5f5f5']} />
        
        {/* Iluminação */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Ambiente */}
        <Environment preset="studio" />
        
        {/* Modelo 3D */}
        <Suspense fallback={<LoadingFallback />}>
          <Model 
            modelPath={modelPath || '/assets/models/shoes-1.glb'} 
            customization={customization}
          />
          <ContactShadows 
            rotation-x={Math.PI / 2}
            position={[0, -1, 0]}
            opacity={0.25}
            width={10}
            height={10}
            blur={1.5}
            far={1}
          />
        </Suspense>
        
        {/* Controles de câmera */}
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Instruções de interação */}
      <InteractionHint>
        <HintIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 6v12l-5-6 5-6z M19 6v12l-5-6 5-6z" />
          </svg>
        </HintIcon>
        <HintText>Arraste para girar</HintText>
      </InteractionHint>
    </ViewerContainer>
  );
};

/**
 * Componente Model para renderizar o modelo 3D
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.modelPath - Caminho para o modelo 3D
 * @param {Object} props.customization - Opções de personalização
 */
const Model = ({ modelPath, customization }) => {
  // Referência para o modelo
  const groupRef = useRef();
  
  // Carrega o modelo GLTF
  const { scene } = useGLTF(modelPath);
  
  // Clona o modelo para evitar mutações
  const model = React.useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  // Efeito para aplicar personalizações
  useEffect(() => {
    if (!customization || !model) return;
    
    // Aplica cores e materiais conforme a personalização
    model.traverse((node) => {
      if (!node.isMesh) return;
      
      // Aplica cores com base no nome do objeto
      if (node.name.includes('body') && customization.colors?.body) {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(customization.colors.body),
          metalness: 0.1,
          roughness: 0.8,
        });
      }
      
      if (node.name.includes('sole') && customization.colors?.sole) {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(customization.colors.sole),
          metalness: 0.1,
          roughness: 0.6,
        });
      }
      
      if (node.name.includes('laces') && customization.colors?.laces) {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(customization.colors.laces),
          metalness: 0.1,
          roughness: 0.9,
        });
        
        // Esconde cadarços se desativados
        if (customization.components && customization.components.laces === false) {
          node.visible = false;
        } else {
          node.visible = true;
        }
      }
      
      if (node.name.includes('logo') && customization.colors?.logo) {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(customization.colors.logo),
          metalness: 0.3,
          roughness: 0.7,
        });
        
        // Esconde logo se desativado
        if (customization.components && customization.components.logo === false) {
          node.visible = false;
        } else {
          node.visible = true;
        }
      }
      
      // Aplica materiais específicos
      if (customization.materials) {
        if (node.name.includes('body') && customization.materials.body) {
          applyMaterial(node, customization.materials.body);
        }
        
        if (node.name.includes('sole') && customization.materials.sole) {
          applyMaterial(node, customization.materials.sole);
        }
      }
    });
  }, [model, customization]);
  
  // Animação de rotação suave
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Rotação automática suave quando não há interação
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(t / 5) * 0.5,
      0.05
    );
  });
  
  return (
    <group ref={groupRef} dispose={null}>
      <primitive 
        object={model} 
        scale={1.5} 
        position={[0, -1, 0]} 
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
};

/**
 * Componente LoadingFallback para exibir durante o carregamento
 */
const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  );
};

/**
 * Aplica material específico a um nó
 * 
 * @param {Object} node - Nó do modelo 3D
 * @param {string} materialType - Tipo de material
 */
const applyMaterial = (node, materialType) => {
  switch (materialType) {
    case 'leather':
      node.material.roughness = 0.9;
      node.material.metalness = 0.1;
      break;
    case 'suede':
      node.material.roughness = 1;
      node.material.metalness = 0;
      break;
    case 'mesh':
      node.material.roughness = 0.7;
      node.material.metalness = 0.1;
      break;
    case 'canvas':
      node.material.roughness = 0.95;
      node.material.metalness = 0;
      break;
    case 'rubber':
      node.material.roughness = 0.8;
      node.material.metalness = 0.2;
      break;
    case 'synthetic':
      node.material.roughness = 0.7;
      node.material.metalness = 0.3;
      break;
    case 'waterproof':
      node.material.roughness = 0.6;
      node.material.metalness = 0.2;
      node.material.clearcoat = 0.5;
      break;
    default:
      break;
  }
};

/**
 * Componentes estilizados
 */
const ViewerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(245, 245, 245, 0.8);
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: var(--text);
`;

const InteractionHint = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HintIcon = styled.div`
  margin-right: 8px;
  color: var(--text-light);
`;

const HintText = styled.div`
  font-size: 14px;
  color: var(--text-light);
`;

export default ProductViewer;

/**
 * PRÓXIMOS PASSOS DE APRENDIZADO:
 * 
 * 1. Explore como o React Three Fiber é utilizado para renderizar modelos 3D
 * 2. Observe como as personalizações são aplicadas em tempo real
 * 3. Estude como os controles de câmera e iluminação são configurados
 * 4. Analise como os materiais são aplicados aos diferentes componentes do modelo
 */
