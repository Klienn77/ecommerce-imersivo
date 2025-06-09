#!/bin/bash
# Script para aplicação direta do patch no arquivo ExtensionUtilities.js

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando aplicação direta do patch...${NC}"

# Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
  echo -e "${RED}Erro: package.json não encontrado. Certifique-se de estar na pasta raiz do projeto.${NC}"
  exit 1
fi

# Criar pasta de patches se não existir
if [ ! -d "patches" ]; then
  echo -e "${YELLOW}Criando pasta de patches...${NC}"
  mkdir -p patches
fi

# Verificar se o arquivo de patch existe
if [ ! -f "patches/ExtensionUtilities.js" ]; then
  echo -e "${YELLOW}Criando arquivo de patch...${NC}"
  
  # Criar o arquivo de patch
  cat > patches/ExtensionUtilities.js << 'EOL'
// Patch para ExtensionUtilities.js
// Este arquivo substitui a versão original em node_modules/@react-three/drei/node_modules/three-mesh-bvh/src/utils/ExtensionUtilities.js

/**
 * Arquivo de patch para resolver incompatibilidade entre three.js e three-mesh-bvh
 * 
 * Este patch modifica o arquivo ExtensionUtilities.js para remover a dependência
 * de BatchedMesh que não está disponível na versão atual do Three.js
 */

import * as THREE from 'three';

// Função modificada para evitar o uso de BatchedMesh
export function getGroupMaterial(mesh) {
  // Verificar se é uma instância de Mesh
  if (mesh.isMesh) {
    return mesh.material;
  }
  
  // Verificar se é um Group
  if (mesh.isGroup) {
    const children = mesh.children;
    for (let i = 0, l = children.length; i < l; i++) {
      const child = children[i];
      if (child.isMesh) {
        return child.material;
      }
    }
  }
  
  // Fallback para outros tipos
  return null;
}

// Função modificada para evitar o uso de BatchedMesh
export function setGroupMaterial(mesh, material) {
  // Verificar se é uma instância de Mesh
  if (mesh.isMesh) {
    mesh.material = material;
    return;
  }
  
  // Verificar se é um Group
  if (mesh.isGroup) {
    const children = mesh.children;
    for (let i = 0, l = children.length; i < l; i++) {
      const child = children[i];
      if (child.isMesh) {
        child.material = material;
      }
    }
  }
}
EOL

  echo -e "${GREEN}Arquivo de patch criado com sucesso!${NC}"
else
  echo -e "${GREEN}Arquivo de patch encontrado.${NC}"
fi

# Instalar dependências se node_modules não existir
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Instalando dependências...${NC}"
  npm install
fi

# Procurar o arquivo ExtensionUtilities.js em todas as possíveis localizações
LOCATIONS=(
  "node_modules/@react-three/drei/node_modules/three-mesh-bvh/src/utils/ExtensionUtilities.js"
  "node_modules/three-mesh-bvh/src/utils/ExtensionUtilities.js"
  "node_modules/@react-three/drei/dist/utils/ExtensionUtilities.js"
)

PATCH_APPLIED=false

for LOCATION in "${LOCATIONS[@]}"; do
  if [ -f "$LOCATION" ]; then
    echo -e "${YELLOW}Encontrado arquivo em: $LOCATION${NC}"
    echo -e "${YELLOW}Fazendo backup e aplicando patch...${NC}"
    
    # Fazer backup do arquivo original
    cp "$LOCATION" "$LOCATION.bak"
    
    # Copiar o arquivo de patch
    cp "patches/ExtensionUtilities.js" "$LOCATION"
    
    echo -e "${GREEN}Patch aplicado com sucesso em: $LOCATION${NC}"
    PATCH_APPLIED=true
  fi
done

# Verificar se o patch foi aplicado em algum lugar
if [ "$PATCH_APPLIED" = false ]; then
  echo -e "${RED}Aviso: Não foi possível encontrar o arquivo ExtensionUtilities.js.${NC}"
  echo -e "${YELLOW}Isso pode significar que a estrutura de dependências mudou.${NC}"
  echo -e "${YELLOW}Você precisará encontrar e modificar o arquivo manualmente.${NC}"
  
  # Procurar por qualquer arquivo ExtensionUtilities.js
  echo -e "${YELLOW}Procurando por qualquer arquivo ExtensionUtilities.js...${NC}"
  FOUND_FILES=$(find node_modules -name "ExtensionUtilities.js" 2>/dev/null)
  
  if [ -n "$FOUND_FILES" ]; then
    echo -e "${GREEN}Arquivos encontrados:${NC}"
    echo "$FOUND_FILES"
    echo -e "${YELLOW}Por favor, aplique o patch manualmente a estes arquivos.${NC}"
  else
    echo -e "${RED}Nenhum arquivo ExtensionUtilities.js encontrado.${NC}"
  fi
fi

echo -e "${GREEN}Processo concluído.${NC}"
echo -e "${YELLOW}Execute 'npm start' para iniciar o projeto.${NC}"
echo -e "${YELLOW}Se ainda encontrar erros, consulte o guia de execução para instruções manuais.${NC}"
