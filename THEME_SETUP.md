# 🌙 Sistema de Temas - next-themes

Este projeto agora inclui um sistema completo de temas usando `next-themes`, permitindo alternar entre tema claro, escuro e seguir as preferências do sistema.

## 📦 Dependências Instaladas

- `next-themes@^0.4.6` - Biblioteca para gerenciamento de temas em Next.js

## 🔧 Configuração Implementada

### 1. ThemeProvider (`src/components/theme-provider.tsx`)

Wrapper do `next-themes` que fornece o contexto de tema para toda a aplicação:

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 2. Layout Principal (`src/app/layout.tsx`)

Configurado com o ThemeProvider e propriedades essenciais:

```tsx
<html lang="en" suppressHydrationWarning>
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  </body>
</html>
```

**Propriedades configuradas:**
- `attribute="class"` - Usa classes CSS para alternar temas
- `defaultTheme="system"` - Segue a preferência do sistema por padrão
- `enableSystem` - Permite detecção automática do tema do sistema
- `disableTransitionOnChange` - Evita animações durante a troca de tema
- `suppressHydrationWarning` - Previne warnings de hidratação

### 3. Tailwind CSS (`tailwind.config.js`)

Configurado para suportar dark mode via classes:

```js
module.exports = {
  darkMode: ["class"],
  // ... resto da configuração
}
```

### 4. Estilos CSS (`src/styles/globals.css`)

Já inclui variáveis CSS para ambos os temas:

```css
:root {
  /* Variáveis do tema claro */
}

.dark {
  /* Variáveis do tema escuro */
}
```

## 🎛️ Componentes de Interface

### ThemeToggle (`src/components/theme-toggle.tsx`)

Botão dropdown para alternar entre temas:

```tsx
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  // ... implementação do dropdown
}
```

**Funcionalidades:**
- Ícones animados (Sol/Lua)
- Opções: Claro, Escuro, Sistema
- Acessibilidade com `sr-only`

### ThemeDemo (`src/components/theme-demo.tsx`)

Componente de demonstração que exibe informações do tema atual:

```tsx
import { useTheme } from "next-themes"

export function ThemeDemo() {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  // ... implementação da demo
}
```

**Informações exibidas:**
- Tema selecionado pelo usuário
- Tema detectado do sistema
- Tema final resolvido

## 🎨 Como Usar

### Hook useTheme

```tsx
import { useTheme } from "next-themes"

function MeuComponente() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()
  
  return (
    <div>
      <p>Tema atual: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Tema Escuro
      </button>
    </div>
  )
}
```

### Classes CSS Condicionais

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Conteúdo que se adapta ao tema
</div>
```

### Prevenção de Flash (FOUC)

Para componentes que dependem do tema, use o padrão de mounted:

```tsx
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

function ComponenteComTema() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Carregando...</div>
  }

  return <div>Tema: {resolvedTheme}</div>
}
```

## 🔍 Propriedades do useTheme

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `theme` | `string` | Tema selecionado ('light', 'dark', 'system') |
| `setTheme` | `function` | Função para alterar o tema |
| `systemTheme` | `string` | Tema detectado do sistema |
| `resolvedTheme` | `string` | Tema final aplicado ('light' ou 'dark') |
| `themes` | `string[]` | Lista de temas disponíveis |

## 🎯 Funcionalidades Implementadas

- ✅ Alternância entre tema claro e escuro
- ✅ Detecção automática do tema do sistema
- ✅ Persistência da preferência do usuário
- ✅ Prevenção de flash durante carregamento
- ✅ Componente de toggle acessível
- ✅ Demonstração interativa
- ✅ Suporte completo ao Tailwind CSS
- ✅ Integração com shadcn/ui

## 🚀 Próximos Passos

Para expandir o sistema de temas, você pode:

1. **Adicionar mais temas:**
   ```tsx
   <ThemeProvider themes={['light', 'dark', 'blue', 'green']}>
   ```

2. **Personalizar transições:**
   ```css
   * {
     transition: background-color 0.3s ease, color 0.3s ease;
   }
   ```

3. **Criar temas personalizados:**
   ```css
   .theme-blue {
     --primary: 59 130 246;
     --background: 239 246 255;
   }
   ```

4. **Integrar com Storybook:**
   ```js
   // .storybook/preview.js
   export const parameters = {
     darkMode: {
       current: 'light',
       dark: { ...themes.dark },
       light: { ...themes.normal }
     }
   }
   ```

## 📚 Recursos Adicionais

- [Documentação do next-themes](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/dark-mode)

---

O sistema de temas está completamente configurado e pronto para uso! 🎉 