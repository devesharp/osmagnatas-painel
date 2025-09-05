# 🔐 API de Autenticação

Este documento descreve as APIs de autenticação implementadas no projeto.

## 📋 Visão Geral

O sistema de autenticação utiliza:
- **JWT (JSON Web Tokens)** para autenticação stateless
- **bcryptjs** para hash de senhas
- **SQLite** como banco de dados
- **Middleware** para proteção de rotas

## 🚀 Usuários de Teste

Foram criados usuários de teste automaticamente via seed:

| Email | Senha | Tipo |
|-------|-------|------|
| `admin@example.com` | `admin123` | Administrador |
| `alice@example.com` | `user123` | Usuário comum |
| `bob@example.com` | `user123` | Usuário comum |

## 📚 APIs Disponíveis

### 1. POST /api/auth/login

Faz login do usuário e retorna um token JWT.

**Request:**
```json
{
  "login": "admin@example.com",
  "password": "admin123"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "data": {
    "user": {
      "CODIGO": 1,
      "EMAIL": "admin@example.com",
      "NOME_CORRETOR": "Administrador",
      "IS_ADMIN": true,
      "IS_MASTER": true,
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "PERMISSOES": {
        "CADASTRAR_USUARIOS": true,
        "VISUALIZAR_RELATORIOS_GERENCIAIS": true,
        // ... outras permissões
      }
      // ... outros campos
    },
    "info": {
      "BAIRROS": [],
      "CIDADES": [],
      "TIPOS": [],
      "TIPOS_BUSCA": []
    }
  }
}
```

**Response (Erro):**
```json
{
  "success": false,
  "data": {
    "error": "Credenciais inválidas",
    "message": "Email ou senha incorretos"
  }
}
```

### 2. GET /api/auth/me

Obtém os dados do usuário autenticado.

**Headers obrigatórios:**
```
Authorization: Bearer <token_jwt>
```

**Response (Sucesso):**
```json
{
  "success": true,
  "data": {
    "user": {
      "CODIGO": 1,
      "EMAIL": "admin@example.com",
      "NOME_CORRETOR": "Administrador",
      "IS_ADMIN": true,
      "IS_MASTER": true,
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      // ... outros campos
    },
    "info": {
      "BAIRROS": [],
      "CIDADES": [],
      "TIPOS": [],
      "TIPOS_BUSCA": []
    }
  }
}
```

## 🛡️ Middleware de Autenticação

O middleware automaticamente protege todas as rotas da API (exceto `/api/auth/*`).

**Como usar tokens:**

```javascript
// No frontend, incluir token em todas as requisições
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## 🔧 Configuração

### Variáveis de Ambiente

Adicione ao arquivo `.env`:

```env
# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production-please"
JWT_EXPIRES_IN="7d"
```

### Scripts Úteis

```bash
# Executar seed para criar usuários de teste
yarn db:seed

# Gerar cliente Prisma
yarn db:generate

# Aplicar mudanças no banco
yarn db:push
```

## 📝 Exemplos de Uso

### Usando o arquivo de requests existente

```typescript
import { authApi } from '@/api/auth.request'

// Login
const loginResponse = await authApi.login({
  login: 'admin@example.com',
  password: 'admin123'
})

// Obter dados do usuário
const userData = await authApi.me()
```

### Usando fetch diretamente

```typescript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    login: 'admin@example.com',
    password: 'admin123'
  })
})

// Obter dados do usuário
const userResponse = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## 🏗️ Estrutura dos Arquivos

```
src/
├── api/
│   └── auth.request.ts          # Cliente para APIs de auth
├── app/api/auth/
│   ├── login/route.ts          # Rota POST /api/auth/login
│   └── me/route.ts             # Rota GET /api/auth/me
├── lib/
│   ├── auth.ts                 # Utilitários de autenticação
│   └── auth-examples.ts        # Exemplos de uso
├── types/
│   └── user.types.ts           # Tipos do usuário
├── middleware.ts               # Middleware de autenticação
prisma/
├── schema.prisma               # Schema do banco
└── seed.ts                     # Seed com usuários de teste
```

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (12 rounds)
- Tokens JWT expiram em 7 dias
- Middleware protege automaticamente todas as rotas da API
- Validação de usuários ativos
- Verificação de permissões baseada em roles

## 🚨 Tratamento de Erros

Os possíveis erros retornados pelas APIs:

- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token inválido/expirado ou credenciais incorretas
- `404 Not Found` - Usuário não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## 🔄 Próximos Passos

Para expandir o sistema de autenticação:

1. **Registro de usuários**: Criar rota `POST /api/auth/register`
2. **Refresh tokens**: Implementar tokens de refresh
3. **Redefinição de senha**: Sistema de recuperação de senha
4. **Logs de auditoria**: Registrar tentativas de login
5. **Rate limiting**: Limitar tentativas de login
6. **2FA**: Autenticação de dois fatores
