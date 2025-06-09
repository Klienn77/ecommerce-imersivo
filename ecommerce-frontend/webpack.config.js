// webpack.config.js
// Configuração personalizada do webpack para resolver conflitos de dependências

const path = require('path');
const { override, addWebpackAlias, babelInclude } = require('customize-cra');

/**
 * Configuração personalizada do webpack para resolver conflitos de dependências
 * entre three.js e three-mesh-bvh
 */
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
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'patched/',
            emitFile: false
          }
        },
        {
          loader: 'string-replace-loader',
          options: {
            search: /[\s\S]*/,
            replace: () => {
              // Usar o conteúdo do arquivo de patch
              const fs = require('fs');
              return fs.readFileSync(
                path.resolve(__dirname, 'patches/ExtensionUtilities.js'),
                'utf8'
              );
            },
            flags: 'g'
          }
        }
      ]
    });
    
    return config;
  }
);
