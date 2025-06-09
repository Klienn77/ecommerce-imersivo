// apply-patch.js
// Script para aplicar o patch automaticamente após a instalação das dependências
// Compatível com Windows e ambientes Unix

const fs = require('fs');
const path = require('path');

console.log('Iniciando aplicação do patch para resolver conflito de dependências...');

// Conteúdo do patch para ExtensionUtilities.js
const patchContent = `// Patch para ExtensionUtilities.js
// Este arquivo substitui a versão original para resolver incompatibilidade entre three.js e three-mesh-bvh

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
}`;

// Criar pasta patches se não existir
const patchesDir = path.join(__dirname, 'patches');
if (!fs.existsSync(patchesDir)) {
  console.log('Criando pasta patches...');
  fs.mkdirSync(patchesDir, { recursive: true });
}

// Salvar o conteúdo do patch em um arquivo
const patchFilePath = path.join(patchesDir, 'ExtensionUtilities.js');
fs.writeFileSync(patchFilePath, patchContent);
console.log(`Arquivo de patch criado em: ${patchFilePath}`);

// Possíveis localizações do arquivo ExtensionUtilities.js
const possibleLocations = [
  path.join(__dirname, 'node_modules', '@react-three', 'drei', 'node_modules', 'three-mesh-bvh', 'src', 'utils', 'ExtensionUtilities.js'),
  path.join(__dirname, 'node_modules', 'three-mesh-bvh', 'src', 'utils', 'ExtensionUtilities.js'),
  path.join(__dirname, 'node_modules', '@react-three', 'drei', 'dist', 'utils', 'ExtensionUtilities.js')
];

let patchApplied = false;

// Verificar cada localização possível
for (const location of possibleLocations) {
  if (fs.existsSync(location)) {
    console.log(`Encontrado arquivo em: ${location}`);
    
    // Verificar se o arquivo já contém o patch
    const content = fs.readFileSync(location, 'utf8');
    if (content.includes('BatchedMesh')) {
      console.log('Fazendo backup e aplicando patch...');
      
      // Fazer backup do arquivo original
      fs.copyFileSync(location, `${location}.bak`);
      
      // Copiar o arquivo de patch
      fs.copyFileSync(patchFilePath, location);
      
      console.log(`Patch aplicado com sucesso em: ${location}`);
      patchApplied = true;
    } else {
      console.log('Arquivo já parece estar corrigido, não é necessário aplicar o patch.');
      patchApplied = true;
    }
  }
}

// Verificar se o patch foi aplicado em algum lugar
if (!patchApplied) {
  console.log('Aviso: Não foi possível encontrar o arquivo ExtensionUtilities.js nas localizações esperadas.');
  
  // Procurar por qualquer arquivo ExtensionUtilities.js
  console.log('Procurando por qualquer arquivo ExtensionUtilities.js...');
  
  // Esta parte é mais complexa em JavaScript puro, então vamos apenas sugerir uma busca manual
  console.log('Por favor, procure manualmente por arquivos ExtensionUtilities.js em node_modules e aplique o patch manualmente.');
  console.log(`O arquivo de patch está disponível em: ${patchFilePath}`);
  
  // Sugestão para instalação com --legacy-peer-deps
  console.log('\nSe continuar enfrentando problemas, tente reinstalar com:');
  console.log('npm install --legacy-peer-deps');
}

console.log('Processo de aplicação do patch concluído.');
console.log('Execute "npm start" para iniciar o projeto.');
