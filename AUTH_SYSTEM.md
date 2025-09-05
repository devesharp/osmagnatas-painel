# Sistema de Autenticação Modular

Este projeto inclui um sistema de autenticação completo e modular que pode ser facilmente habilitado ou desabilitado conforme necessário.

## 🚀 Características

- **Sistema Modular**: Pode ser completamente desabilitado com uma única configuração
- **Proteção de Rotas**: Rotas automáticas protegidas e públicas
- **Interface Moderna**: Páginas de login/registro com design responsivo
- **Context API**: Gerenciamento de estado global de autenticação
- **TypeScript**: Totalmente tipado para melhor experiência de desenvolvimento
- **Configuração Centralizada**: Todas as configurações em um local

## 📁 Estrutura do Sistema

```
src/
├── contexts/
│   └── auth-context.tsx          # Context de autenticação
├── components/
│   └── auth/
│       └── auth-guard.tsx        # Componente de proteção de rotas
├── app/
│   ├── (public)/                 # Rotas públicas (login, register)
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (app)/                    # Rotas protegidas (dashboard, etc)
│   │   ├── dashboard/
│   │   └── layout.tsx
│   └── providers.tsx             # Configuração dos providers
├── config/
│   └── auth.ts                   # Configurações centralizadas
└── api/
    ├── auth.request.ts           # Requisições de autenticação
    └── base.ts                   # Configuração base do axios
```

## ⚙️ Como Usar

### 1. Sistema Habilitado (Padrão)

Por padrão, o sistema de autenticação está **habilitado**. Neste modo:

- Rotas em `(app)` são protegidas e requerem login
- Rotas em `(public)` são acessíveis apenas para usuários não logados
- Redirecionamentos automáticos baseados no estado de autenticação

### 2. Desabilitar o Sistema

Para desabilitar completamente o sistema de autenticação:

**Opção 1: Arquivo de Configuração (Recomendado)**
```typescript
// src/config/auth.ts
export const AUTH_CONFIG = {
  AUTH_ENABLED: false, // Mude para false
  // ... resto da configuração
}
```

**Opção 2: Diretamente no Provider**
```typescript
// src/app/providers.tsx
<AuthProvider enabled={false}>
  {children}
</AuthProvider>
```

### 3. Usando o Hook de Autenticação

```typescript
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { 
    user,           // Dados do usuário logado
    isLoading,      // Estado de carregamento
    isAuthenticated, // Se está autenticado
    login,          // Função de login
    register,       // Função de registro
    logout,         // Função de logout
    checkAuth       // Verificar autenticação
  } = useAuth()

  // Seu código aqui...
}
```

## 🛡️ Proteção de Rotas

### Rotas Protegidas
Coloque suas páginas que precisam de autenticação em `src/app/(app)/`:

```typescript
// src/app/(app)/minha-pagina/page.tsx
export default function MinhaPageProtegida() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>Olá, {user?.name}!</h1>
      {/* Conteúdo protegido */}
    </div>
  )
}
```

### Rotas Públicas
Coloque páginas públicas (que só devem ser acessadas por usuários não logados) em `src/app/(public)/`:

```typescript
// src/app/(public)/sobre/page.tsx
export default function SobrePage() {
  return (
    <div>
      <h1>Sobre nós</h1>
      {/* Conteúdo público */}
    </div>
  )
}
```

### Proteção Manual
Para proteção customizada, use o componente `AuthGuard`:

```typescript
import { AuthGuard } from '@/components/auth/auth-guard'

function MinhaPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/custom-login">
      {/* Conteúdo protegido */}
    </AuthGuard>
  )
}
```

## 🔧 Configurações

### Arquivo de Configuração
```typescript
// src/config/auth.ts
export const AUTH_CONFIG = {
  // Habilita/desabilita o sistema
  AUTH_ENABLED: true,
  
  // Rotas de redirecionamento
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/',
    HOME: '/',
  },
  
  // Configurações de token
  TOKEN: {
    KEY: 'auth_token',
    USER_KEY: 'auth_user',
  },
  
  // Mensagens do sistema
  MESSAGES: {
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    REGISTER_SUCCESS: 'Conta criada com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    LOGIN_ERROR: 'Erro ao fazer login',
    REGISTER_ERROR: 'Erro ao criar conta',
    AUTH_ERROR: 'Erro ao verificar autenticação',
  }
}
```

## 🌐 API Backend

O sistema espera uma API backend com os seguintes endpoints:

### POST /auth/login
```typescript
// Request
{
  email: string
  password: string
}

// Response
{
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}
```

### POST /auth/register
```typescript
// Request
{
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Response
{
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}
```

### Configuração da API
```typescript
// src/utils/environment.ts
export function getUrl() {
  if (process.env.NEXT_PUBLIC_URL_API) {
    return process.env.NEXT_PUBLIC_URL_API;
  }
  return "http://localhost:3001"; // URL padrão
}
```

## 🎨 Personalização

### Temas
O sistema usa o sistema de temas do `next-themes` e é totalmente compatível com modo claro/escuro.

### Componentes
Todos os componentes usam `shadcn/ui` e podem ser facilmente personalizados:

- `src/app/(public)/login/page.tsx` - Página de login
- `src/app/(public)/register/page.tsx` - Página de registro
- `src/app/(app)/dashboard/page.tsx` - Dashboard exemplo
- `src/components/auth/auth-guard.tsx` - Proteção de rotas

### Estilos
Os estilos seguem o design system do `shadcn/ui` e podem ser personalizados através do arquivo `tailwind.config.js`.

## 🚨 Importante

1. **Segurança**: Este é um sistema de autenticação frontend. Sempre valide tokens no backend.
2. **HTTPS**: Use HTTPS em produção para proteger tokens.
3. **Tokens**: Os tokens são armazenados no localStorage. Considere usar httpOnly cookies para maior segurança.
4. **Validação**: Implemente validação adequada no backend para todos os endpoints.

## 🔄 Fluxo de Autenticação

1. **Login**: Usuário faz login → Token salvo no localStorage → Redirecionado para dashboard
2. **Registro**: Usuário se registra → Token salvo no localStorage → Redirecionado para dashboard
3. **Logout**: Token removido do localStorage → Redirecionado para home
4. **Verificação**: A cada carregamento da página, verifica se há token válido no localStorage
5. **Proteção**: AuthGuard verifica autenticação e redireciona conforme necessário

## 📝 Exemplos de Uso

### Desabilitar Auth para Desenvolvimento
```typescript
// src/config/auth.ts
export const AUTH_CONFIG = {
  AUTH_ENABLED: false, // Desabilita auth
  // ... resto da configuração
}
```

### Verificar se Usuário está Logado
```typescript
function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginButton />
  }
  
  return (
    <div>
      <span>Olá, {user?.name}</span>
      <button onClick={logout}>Sair</button>
    </div>
  )
}
```

### Proteção Condicional
```typescript
function MyPage() {
  const { isAuthenticated } = useAuth()
  
  return (
    <div>
      <h1>Minha Página</h1>
      {isAuthenticated ? (
        <ProtectedContent />
      ) : (
        <PublicContent />
      )}
    </div>
  )
}
```

Este sistema fornece uma base sólida e flexível para autenticação em aplicações Next.js, mantendo a simplicidade de uso e a facilidade de manutenção. 