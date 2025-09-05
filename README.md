# Boilerplate Next.js + Tailwind CSS v4 + shadcn/ui

Este é um projeto boilerplate configurado com as tecnologias mais modernas para desenvolvimento web.

## 🚀 Tecnologias

- **Next.js 15.3.3** - Framework React com App Router
- **Tailwind CSS v4** - Framework CSS utilitário de nova geração
- **shadcn/ui** - Biblioteca de componentes modernos
- **next-themes** - Sistema de temas avançado
- **TypeScript** - Tipagem estática
- **React 19** - Biblioteca de interface de usuário

## ✨ Características

- ✅ **Tailwind CSS v4** configurado e funcionando
- ✅ **shadcn/ui** integrado com tema personalizado
- ✅ **Sistema de temas completo** (claro/escuro/sistema)
- ✅ **next-themes** configurado com persistência
- ✅ **TypeScript** configurado
- ✅ **ESLint** para qualidade de código
- ✅ **Componentes prontos** para uso
- ✅ **Storybook** configurado para desenvolvimento

## 🛠️ Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

## 🌙 Sistema de Temas

O projeto inclui um sistema completo de temas usando `next-themes`:

- **Tema Claro** - Interface clara e moderna
- **Tema Escuro** - Interface escura para baixa luminosidade
- **Tema Sistema** - Segue automaticamente a preferência do sistema

### Componentes de Tema

- `ThemeProvider` - Provedor de contexto de tema
- `ThemeToggle` - Botão para alternar entre temas
- `ThemeDemo` - Demonstração das informações do tema

### Como Usar

```tsx
import { useTheme } from "next-themes"

function MeuComponente() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div className="bg-background text-foreground">
      <p>Tema atual: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Alternar para escuro
      </button>
    </div>
  )
}
```

📖 **Documentação completa:** [THEME_SETUP.md](./THEME_SETUP.md)

## 🤖 Geração Automática de Código

O projeto inclui um sistema completo de geração de código usando **Plop**:

```bash
# Gerador interativo
npm run generate

# Geradores específicos
npm run generate:component  # Criar componentes React
npm run generate:page      # Criar páginas Next.js
npm run generate:hook      # Criar hooks personalizados
npm run generate:context   # Criar contexts React
```

### Tipos de Geradores

- **Componentes**: UI, Gerais ou de Página com Storybook e testes
- **Páginas**: Públicas, Privadas ou Componentes com layouts
- **Hooks**: Simples, com Estado, Efeito ou Context
- **Contexts**: Simples, com Reducer ou Estado Complexo

📖 **Documentação completa:** [PLOP_SETUP.md](./PLOP_SETUP.md)

## 📦 Componentes Disponíveis

Os seguintes componentes do shadcn/ui já estão configurados:

- `Button` - Botões com múltiplas variantes
- `Card` - Cards para organizar conteúdo
- `Input` - Campos de entrada estilizados
- `Badge` - Badges para labels e status
- `Dialog` - Modais e diálogos
- `DropdownMenu` - Menus suspensos
- `ThemeToggle` - Alternador de temas
- `ThemeDemo` - Demonstração de temas

## 🎨 Adicionando Novos Componentes

Para adicionar novos componentes do shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

Exemplos:
```bash
npx shadcn@latest add avatar
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add toast
```

## 🎯 Estrutura do Projeto

```
├── scripts/             # Scripts de geração de código
│   ├── generators/      # Definições dos geradores Plop
│   └── templates/       # Templates Handlebars
├── src/
│   ├── app/
│   │   ├── globals.css      # Estilos globais e variáveis do tema
│   │   ├── layout.tsx       # Layout principal com ThemeProvider
│   │   ├── page.tsx         # Página inicial com exemplos
│   │   └── test/
│   │       └── page.tsx     # Página de teste
│   ├── components/
│   │   ├── theme-provider.tsx  # Provedor de tema
│   │   ├── theme-toggle.tsx    # Alternador de tema
│   │   ├── theme-demo.tsx      # Demonstração de tema
│   │   └── ui/              # Componentes do shadcn/ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       ├── dialog.tsx
│   │       └── dropdown-menu.tsx
│   ├── contexts/        # Contexts React (gerados via Plop)
│   ├── hooks/           # Hooks personalizados (gerados via Plop)
│   ├── _pages/          # Componentes de página (gerados via Plop)
│   └── lib/
│       └── utils.ts         # Utilitários (cn function)
└── plopfile.js          # Configuração do Plop
```

## 📝 Configurações

### Tailwind CSS v4
- Configurado em `tailwind.config.js` com `darkMode: ["class"]`
- PostCSS configurado em `postcss.config.mjs`
- Variáveis de tema em `src/styles/globals.css`

### shadcn/ui
- Configurado em `components.json`
- Tema: New York style
- Cor base: Neutral
- CSS Variables habilitadas

### next-themes
- Configurado no layout principal
- Atributo: `class`
- Tema padrão: `system`
- Detecção automática do sistema habilitada

## 🚀 Deploy

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 📖 Recursos Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias e sugestões!

---

Feito com ❤️ usando as melhores tecnologias do ecossistema React.
