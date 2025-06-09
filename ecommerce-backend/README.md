# Guia de Instalação e Execução do Backend do E-commerce Imersivo

Este guia fornece instruções detalhadas para instalar, configurar e executar o backend do projeto de E-commerce Imersivo.

## Requisitos

- Node.js (v14.x ou superior)
- MongoDB (v4.x ou superior)
- NPM (v6.x ou superior)

## Instalação

1. Clone o repositório ou descompacte o arquivo ZIP em seu ambiente local:

```bash
git clone <url-do-repositorio> ecommerce-backend
cd ecommerce-backend
```

2. Instale as dependências:

```bash
npm install
```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce-imersivo
JWT_SECRET=sua_chave_secreta_para_jwt
NODE_ENV=development
```

Substitua `sua_chave_secreta_para_jwt` por uma string aleatória e segura.

## Execução

### Ambiente de Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento com recarga automática:

```bash
npm run dev
```

### Ambiente de Produção

Para iniciar o servidor em modo de produção:

```bash
npm start
```

## Testes

Para executar os testes de integração:

```bash
node test-integration.js
```

## Documentação da API

A documentação completa da API está disponível em:

1. Swagger UI: http://localhost:5000/api-docs (quando o servidor estiver em execução)
2. Arquivo Markdown: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Estrutura do Projeto

```
ecommerce-backend/
├── src/
│   ├── controllers/     # Lógica de negócios
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── models/          # Modelos de dados
│   │   ├── productModel.js
│   │   ├── userModel.js
│   │   ├── cartModel.js
│   │   └── orderModel.js
│   ├── routes/          # Rotas da API
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/      # Middlewares
│   │   └── authMiddleware.js
│   ├── services/        # Serviços externos
│   ├── utils/           # Funções utilitárias
│   └── config/          # Configurações
├── uploads/             # Armazenamento de arquivos
├── tests/               # Testes automatizados
├── server.js            # Ponto de entrada
├── test-integration.js  # Script de teste de integração
└── API_DOCUMENTATION.md # Documentação da API
```

## Endpoints Principais

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Obter produto por ID
- `POST /api/products` - Criar produto (Admin)
- `PUT /api/products/:id` - Atualizar produto (Admin)
- `DELETE /api/products/:id` - Excluir produto (Admin)
- `GET /api/products/search` - Buscar produtos

### Usuários
- `POST /api/users` - Registrar usuário
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Obter perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil do usuário

### Carrinho
- `GET /api/cart` - Obter carrinho
- `POST /api/cart` - Adicionar item ao carrinho
- `PUT /api/cart/:itemId` - Atualizar item do carrinho
- `DELETE /api/cart/:itemId` - Remover item do carrinho
- `DELETE /api/cart` - Limpar carrinho

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Obter pedidos do usuário
- `GET /api/orders/:id` - Obter pedido por ID
- `PUT /api/orders/:id/pay` - Atualizar status para pago
- `PUT /api/orders/:id/ship` - Atualizar status para enviado (Admin)
- `PUT /api/orders/:id/deliver` - Atualizar status para entregue (Admin)
- `PUT /api/orders/:id/cancel` - Cancelar pedido

## Integração com Frontend

Para integrar este backend com o frontend do E-commerce Imersivo, siga as instruções detalhadas na [documentação da API](./API_DOCUMENTATION.md#integração-com-frontend).

## Recursos Avançados

### Personalização de Produtos
O backend suporta a personalização de produtos, permitindo que os usuários escolham cores, materiais e componentes para produtos customizáveis.

### Recomendações Personalizadas
O sistema de recomendações utiliza o histórico de visualização do usuário para sugerir produtos relevantes.

### Gerenciamento de Endereços e Métodos de Pagamento
Os usuários podem salvar múltiplos endereços de entrega e métodos de pagamento para facilitar o checkout.

## Solução de Problemas

### Erro de Conexão com MongoDB
Verifique se o MongoDB está em execução e se a URI de conexão está correta no arquivo `.env`.

### Erro de Autenticação
Verifique se o token JWT está sendo enviado corretamente no cabeçalho de autorização.

### Outros Erros
Consulte os logs do servidor para obter mais informações sobre erros específicos.

## Próximos Passos

1. Implementar sistema de avaliações e comentários
2. Adicionar suporte para cupons de desconto
3. Implementar sistema de notificações em tempo real
4. Adicionar suporte para múltiplas moedas e idiomas
5. Integrar com serviços de pagamento reais (Stripe, PayPal, etc.)
