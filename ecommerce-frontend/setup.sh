#!/bin/bash
# Script para limpar e reinstalar dependências com aplicação de patch

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando limpeza e reinstalação de dependências...${NC}"

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
  echo -e "${RED}Erro: Arquivo de patch patches/ExtensionUtilities.js não encontrado.${NC}"
  exit 1
fi

# Limpar dependências
echo -e "${YELLOW}Removendo node_modules e package-lock.json...${NC}"
rm -rf node_modules
rm -f package-lock.json

# Instalar customize-cra e react-app-rewired para configuração do webpack
echo -e "${YELLOW}Instalando dependências de desenvolvimento...${NC}"
npm install --save-dev customize-cra react-app-rewired string-replace-loader file-loader

# Modificar scripts no package.json para usar react-app-rewired
echo -e "${YELLOW}Atualizando scripts no package.json...${NC}"
# Usar sed para modificar o package.json
sed -i 's/"start": "react-scripts start"/"start": "react-app-rewired start"/g' package.json
sed -i 's/"build": "react-scripts build"/"build": "react-app-rewired build"/g' package.json
sed -i 's/"test": "react-scripts test"/"test": "react-app-rewired test"/g' package.json

# Instalar dependências principais
echo -e "${YELLOW}Instalando dependências principais...${NC}"
npm install

# Verificar se a pasta node_modules/@react-three/drei/node_modules/three-mesh-bvh/src/utils existe
TARGET_DIR="node_modules/@react-three/drei/node_modules/three-mesh-bvh/src/utils"
if [ -d "$TARGET_DIR" ]; then
  echo -e "${YELLOW}Aplicando patch para ExtensionUtilities.js...${NC}"
  # Fazer backup do arquivo original
  cp "$TARGET_DIR/ExtensionUtilities.js" "$TARGET_DIR/ExtensionUtilities.js.bak"
  # Copiar o arquivo de patch
  cp "patches/ExtensionUtilities.js" "$TARGET_DIR/ExtensionUtilities.js"
  echo -e "${GREEN}Patch aplicado com sucesso!${NC}"
else
  echo -e "${RED}Aviso: Pasta $TARGET_DIR não encontrada. O patch não foi aplicado.${NC}"
  echo -e "${YELLOW}Isso pode significar que a estrutura de dependências mudou ou que o pacote não foi instalado corretamente.${NC}"
fi

# Criar arquivo config-overrides.js para react-app-rewired
echo -e "${YELLOW}Criando arquivo config-overrides.js...${NC}"
cat > config-overrides.js << 'EOL'
const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  // Adicionar aliases para garantir que todas as importações de three e three-mesh-bvh
  // apontem para as mesmas versões
  addWebpackAlias({
    'three': path.resolve(__dirname, 'node_modules/three'),
    'three-mesh-bvh': path.resolve(__dirname, 'node_modules/three-mesh-bvh'),
  }),
  
  // Configuração para aplicar o patch manual
  config => {
    // Adicionar um loader personalizado para substituir o arquivo problemático
    config.module.rules.push({
      test: /ExtensionUtilities\.js$/,
      include: [
        path.resolve(__dirname, 'node_modules/@react-three/drei/node_modules/three-mesh-bvh/src/utils')
      ],
      use: [
        {
          loader: 'string-replace-loader',
          options: {
            search: /import \* as THREE from 'three';[\s\S]*?export function setGroupMaterial\([^{]*{[\s\S]*?}/g,
            replace: () => {
              // Usar o conteúdo do arquivo de patch
              const fs = require('fs');
              return fs.readFileSync(
                path.resolve(__dirname, 'patches/ExtensionUtilities.js'),
                'utf8'
              );
            }
          }
        }
      ]
    });
    
    return config;
  }
);
EOL

echo -e "${GREEN}Instalação e configuração concluídas com sucesso!${NC}"
echo -e "${YELLOW}Execute 'npm start' para iniciar o projeto.${NC}"
