// Patch para ExtensionUtilities.js
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
}