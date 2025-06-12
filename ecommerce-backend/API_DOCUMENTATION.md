# API do E-commerce Imersivo - Documentação

Este documento descreve a API RESTful do backend para o projeto de E-commerce Imersivo, detalhando os endpoints disponíveis, parâmetros necessários e respostas esperadas.

## Visão Geral

A API do E-commerce Imersivo fornece endpoints para gerenciar produtos, usuários, carrinhos de compras e pedidos. A API segue os princípios RESTful e utiliza JSON para comunicação.

## Base URL

```
http://localhost:5000/api
```

## Autenticação

A maioria dos endpoints requer autenticação. Para acessar esses endpoints, é necessário incluir um token JWT no cabeçalho de autorização:

```
Authorization: Bearer <token>
```

O token é obtido através do endpoint de login.

## Endpoints

### Produtos

#### Listar Produtos

```
GET /products
```

Parâmetros de consulta:
- `category` (opcional): Filtrar por categoria
- `brand` (opcional): Filtrar por marca
- `search` (opcional): Termo de busca
- `minPrice` (opcional): Preço mínimo
- `maxPrice` (opcional): Preço máximo
- `sort` (opcional): Ordenação (price-asc, price-desc, newest, rating)
- `limit` (opcional): Número de itens por página (padrão: 10)
- `page` (opcional): Número da página (padrão: 1)

Resposta:
```json
{
  "success": true,
  "count": 5,
  "total": 20,
  "totalPages": 4,
  "currentPage": 1,
  "products": [...]
}
```

#### Obter Produto por ID

```
GET /products/:id
```

Resposta:
```json
{
  "success": true,
  "product": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Tênis Esportivo",
    "description": "Tênis ideal para corrida",
    "price": 299.99,
    "category": "calçados",
    "brand": "SportMax",
    "sizes": ["38", "39", "40", "41", "42"],
    "images": ["url1", "url2"],
    "has3DModel": true,
    "modelPath": "/models/tenis-3d.glb",
    "customizable": true,
    "defaultColors": {
      "body": "#3498db",
      "sole": "#2c3e50",
      "laces": "#ecf0f1",
      "logo": "#e74c3c"
    }
  }
}
```

#### Criar Produto (Admin)

```
POST /products
```

Corpo da requisição:
```json
{
  "name": "Tênis Esportivo",
  "description": "Tênis ideal para corrida",
  "shortDescription": "Tênis leve e confortável",
  "price": 299.99,
  "category": "calçados",
  "brand": "SportMax",
  "stock": 50,
  "sizes": ["38", "39", "40", "41", "42"],
  "images": ["url1", "url2"],
  "has3DModel": true,
  "modelPath": "/models/tenis-3d.glb",
  "customizable": true
}
```

#### Atualizar Produto (Admin)

```
PUT /products/:id
```

#### Excluir Produto (Admin)

```
DELETE /products/:id
```

#### Obter Produtos Relacionados

```
GET /products/:id/related
```

#### Buscar Produtos

```
GET /products/search?q=termo
```

### Usuários

#### Registrar Usuário

```
POST /users
```

Corpo da requisição:
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

Resposta:
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "role": "user",
    "avatar": "/uploads/default-avatar.png",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```
POST /users/login
```

Corpo da requisição:
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

#### Obter Perfil do Usuário

```
GET /users/profile
```

#### Atualizar Perfil do Usuário

```
PUT /users/profile
```

#### Gerenciar Endereços

```
POST /users/addresses
PUT /users/addresses/:id
DELETE /users/addresses/:id
```

#### Gerenciar Métodos de Pagamento

```
POST /users/payment-methods
DELETE /users/payment-methods/:id
```

### Carrinho

#### Obter Carrinho

```
GET /cart
```

Resposta:
```json
{
  "success": true,
  "cart": {
    "_id": "60d21b4667d0d8992e610c85",
    "user": "60d21b4667d0d8992e610c85",
    "items": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "product": {
          "_id": "60d21b4667d0d8992e610c87",
          "name": "Tênis Esportivo",
          "images": ["url1", "url2"],
          "category": "calçados",
          "brand": "SportMax"
        },
        "quantity": 1,
        "size": "40",
        "customization": {
          "colors": {
            "body": "#3498db",
            "sole": "#2c3e50",
            "laces": "#ecf0f1",
            "logo": "#e74c3c"
          }
        },
        "price": 299.99
      }
    ],
    "totalPrice": 299.99,
    "totalItems": 1
  }
}
```

#### Adicionar Item ao Carrinho

```
POST /cart
```

Corpo da requisição:
```json
{
  "productId": "60d21b4667d0d8992e610c87",
  "quantity": 1,
  "size": "40",
  "customization": {
    "colors": {
      "body": "#3498db",
      "sole": "#2c3e50",
      "laces": "#ecf0f1",
      "logo": "#e74c3c"
    }
  }
}
```

#### Atualizar Item do Carrinho

```
PUT /cart/:itemId
```

Corpo da requisição:
```json
{
  "quantity": 2
}
```

#### Remover Item do Carrinho

```
DELETE /cart/:itemId
```

#### Limpar Carrinho

```
DELETE /cart
```

### Pedidos

#### Criar Pedido

```
POST /orders
```

Corpo da requisição:
```json
{
  "shippingAddress": {
    "name": "Casa",
    "recipient": "João Silva",
    "address": "Rua Exemplo, 123",
    "complement": "Apto 101",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01001-000"
  },
  "paymentMethod": {
    "type": "credit_card",
    "details": {
      "brand": "Visa",
      "lastFour": "1234",
      "holderName": "JOAO SILVA"
    }
  },
  "shippingPrice": 15.00,
  "taxPrice": 30.00
}
```

#### Obter Pedidos do Usuário

```
GET /orders
```

#### Obter Pedido por ID

```
GET /orders/:id
```

#### Atualizar Status do Pedido para Pago

```
PUT /orders/:id/pay
```

Corpo da requisição:
```json
{
  "paymentResult": {
    "id": "PAYMENT123",
    "status": "COMPLETED",
    "update_time": "2023-06-02T10:30:00Z",
    "email_address": "joao@exemplo.com"
  }
}
```

#### Atualizar Status do Pedido para Enviado (Admin)

```
PUT /orders/:id/ship
```

Corpo da requisição:
```json
{
  "trackingNumber": "BR123456789"
}
```

#### Atualizar Status do Pedido para Entregue (Admin)

```
PUT /orders/:id/deliver
```

#### Cancelar Pedido

```
PUT /orders/:id/cancel
```

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos ou incompletos
- `401 Unauthorized`: Autenticação necessária
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

## Fluxos Principais

### Fluxo de Compra

1. Usuário se autentica (`POST /users/login`)
2. Usuário navega pelos produtos (`GET /products`)
3. Usuário adiciona produtos ao carrinho (`POST /cart`)
4. Usuário visualiza o carrinho (`GET /cart`)
5. Usuário ajusta quantidades (`PUT /cart/:itemId`) ou remove itens (`DELETE /cart/:itemId`)
6. Usuário finaliza a compra (`POST /orders`)
7. Usuário realiza o pagamento (`PUT /orders/:id/pay`)
8. Usuário acompanha o status do pedido (`GET /orders/:id`)

### Fluxo de Personalização de Produto

1. Usuário visualiza detalhes do produto (`GET /products/:id`)
2. Usuário personaliza o produto (cores, materiais, etc.)
3. Usuário adiciona o produto personalizado ao carrinho (`POST /cart` com campo `customization`)
4. Usuário segue o fluxo de compra normal

### Fluxo de Gerenciamento de Conta

1. Usuário se registra (`POST /users`)
2. Usuário acessa seu perfil (`GET /users/profile`)
3. Usuário atualiza informações pessoais (`PUT /users/profile`)
4. Usuário adiciona endereços (`POST /users/addresses`)
5. Usuário adiciona métodos de pagamento (`POST /users/payment-methods`)
6. Usuário visualiza histórico de pedidos (`GET /orders`)

## Integração com Frontend

Para integrar o frontend com esta API, siga estas diretrizes:

1. Armazene o token JWT após o login e inclua-o em todas as requisições autenticadas
2. Implemente tratamento de erros para todos os códigos de status
3. Utilize os endpoints de busca e filtragem para implementar a navegação de produtos
4. Implemente o fluxo de carrinho persistente usando os endpoints do carrinho
5. Utilize os endpoints de pedidos para implementar o checkout e acompanhamento de pedidos

## Exemplos de Uso

### Exemplo de Login e Obtenção de Produtos

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'joao@exemplo.com',
    password: 'senha123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.user.token;

// Obter produtos
const productsResponse = await fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const productsData = await productsResponse.json();
```

### Exemplo de Adição ao Carrinho

```javascript
const addToCartResponse = await fetch('http://localhost:5000/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: '60d21b4667d0d8992e610c87',
    quantity: 1,
    size: '40',
    customization: {
      colors: {
        body: '#3498db',
        sole: '#2c3e50',
        laces: '#ecf0f1',
        logo: '#e74c3c'
      }
    }
  })
});

const cartData = await addToCartResponse.json();


##email : fabianompedroso@hotmail.com
```
