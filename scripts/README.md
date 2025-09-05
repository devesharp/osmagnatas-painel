# Scripts de Geração de Código

Esta pasta contém todos os scripts e templates para geração automática de código usando Plop, baseados na estrutura do componente `slider-images-fullscreen`.

## 🚀 Uso Rápido

```bash
# Gerador interativo
npm run generate

# Geradores específicos
npm run generate:component
npm run generate:page
npm run generate:page-config
npm run generate:page-form
npm run generate:hook
npm run generate:context
```

## 📁 Estrutura

```
scripts/
├── generators/                  # Definições dos geradores
│   ├── generator-component.js   # Gerador de componentes
│   ├── generator-page.js        # Gerador de páginas
│   └── generator-page-config.js # Gerador de páginas de configuração
└── templates/                   # Templates Handlebars
    ├── components/              # Templates para componentes
    │   ├── component-index.hbs
    │   ├── component.hbs
    │   ├── component-ctrl.hbs
    │   ├── component-types.hbs
    │   └── component-story.hbs
    └── pages/                   # Templates para páginas
        ├── page-index.hbs
        ├── page.hbs
        ├── page-ctrl.hbs
        ├── page-types.hbs
        ├── page-config-index.hbs
        ├── page-config.hbs
        ├── page-config-ctrl.hbs
        └── page-config-types.hbs
```

## 🎯 Gerador de Componentes

### Como usar

```bash
npm run plop component
```

### Estrutura gerada

O gerador criará uma estrutura de arquivos baseada no tipo de componente escolhido:

#### Componente UI (`src/components/ui/`)
```
component-name/
├── index.tsx                    # Exportações
├── component-name.tsx           # Componente principal
├── ComponentName.stories.tsx    # Stories do Storybook (opcional)
└── ComponentName.test.tsx       # Testes (opcional)
```

#### Componente Geral (`src/components/`)
```
component-name/
├── index.tsx                    # Exportações
├── component-name.tsx           # Componente principal
├── component-name.types.tsx     # Tipos TypeScript
├── component-name.ctrl.tsx      # Controller/lógica (opcional)
├── parts/                       # Subcomponentes (opcional)
├── ComponentName.stories.tsx    # Stories do Storybook (opcional)
└── ComponentName.test.tsx       # Testes (opcional)
```

#### Componente de Página (`src/_pages/`)
```
component-name/
├── index.tsx                    # Exportações
├── component-name.tsx           # Componente principal
├── component-name.types.tsx     # Tipos TypeScript
├── component-name.ctrl.tsx      # Controller/lógica (opcional)
├── parts/                       # Subcomponentes (opcional)
├── ComponentName.stories.tsx    # Stories do Storybook (opcional)
└── ComponentName.test.tsx       # Testes (opcional)
```

### Opções disponíveis

- **Nome do componente**: Nome em PascalCase ou kebab-case
- **Tipo do componente**: UI, Geral ou Página
- **Controller**: Criar arquivo de lógica separado (não disponível para UI)
- **Storybook**: Criar arquivo de stories
- **Testes**: Criar arquivo de testes
- **Parts**: Criar pasta para subcomponentes

## 🏗️ Padrões Seguidos

### Estrutura baseada no slider-images-fullscreen
- Separação clara entre apresentação e lógica
- Tipos TypeScript bem definidos
- Documentação JSDoc completa
- Testes estruturados
- Stories do Storybook detalhadas

### Convenções de nomenclatura
- **Arquivos**: `kebab-case`
- **Componentes**: `PascalCase`
- **Hooks**: `usePascalCaseCtrl`
- **Tipos**: `PascalCaseProps`

### Estrutura de arquivos
- `index.tsx`: Exportações centralizadas
- `component.tsx`: Componente principal
- `component.types.tsx`: Definições de tipos
- `component.ctrl.tsx`: Lógica e estado
- `Component.stories.tsx`: Stories do Storybook
- `Component.test.tsx`: Testes unitários

## 💡 Exemplos de Uso

### Componente UI simples
```tsx
// Gerado automaticamente
export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Componente com controller
```tsx
// component.tsx
export function DataTable(props: DataTableProps) {
  const { className } = props;
  const ctrl = useDataTableCtrl(props);

  return (
    <div className={cn("w-full", className)}>
      {/* Implementação usando ctrl */}
    </div>
  );
}

// component.ctrl.tsx
export function useDataTableCtrl(props: DataTableProps) {
  const [data, setData] = useState([]);
  
  const handleSort = useCallback(() => {
    // Lógica de ordenação
  }, []);

  return {
    data,
    handleSort,
  };
}
```

## 🎯 Gerador de Páginas de Configuração

### Como usar

```bash
npm run generate:page-config --name="user-config"
```

### Estrutura gerada

O gerador criará uma página de configuração completa baseada na estrutura da `real-estate-config-page`:

```
user-config-page/
├── index.tsx                    # Exportações
├── user-config-page.tsx        # Componente principal da página
├── user-config-page.ctrl.tsx   # Controller com lógica de formulário
└── user-config-page.types.tsx  # Tipos TypeScript
```

### Características

- Layout responsivo com header e footer fixos
- Formulário usando `ViewFormProvider` do `@devesharp/react-hooks-v2`
- Componentes de UI pré-configurados (Input, Select, Switch, etc.)
- Loading overlay durante salvamento
- Toast notifications para sucesso/erro
- Estrutura preparada para integração com API
- Tipos TypeScript bem definidos

### Exemplo de uso

```bash
# Gerar uma página de configuração de usuário
npm run generate:page-config --name="user-settings"

# Gerar uma página de configuração de sistema
npm run generate:page-config --name="system-config"

# Gerar em diretório específico
npm run generate:page-config --name="app-config" --dir="src/admin/_pages"
```

📖 **Documentação completa:** [README-page-config.md](./templates/pages/README-page-config.md)

## 🏗️ Gerador de Páginas de Formulário

### Como usar

```bash
npm run plop page-form
```

### Estrutura gerada

O gerador criará uma estrutura de arquivos baseada na `condominiums-form-page`:

```
form-page/
├── index.tsx                    # Exportações
├── form-page.tsx               # Componente principal
├── form-page.ctrl.tsx          # Controller com lógica
└── form-page.types.tsx         # Tipos TypeScript
```

### Características

- **Formulário completo** com ViewFormProvider
- **Upload de imagens** com preview
- **Validação** com Zod
- **Layout responsivo** com header e footer
- **Loading states** e toast notifications
- **Integração com API** preparada

### Exemplos de uso

```bash
# Gerar uma página de formulário de usuários
npm run generate:page-form --name="users-form"

# Gerar uma página de formulário de produtos
npm run generate:page-form --name="products-form"

# Gerar em diretório específico
npm run generate:page-form --name="admin-form" --dir="src/admin/_pages"
```

📖 **Documentação completa:** [README-page-form.md](./templates/pages/page-form/README-page-form.md)

## 🔧 Personalização

Para modificar os templates ou adicionar novos geradores, edite os arquivos nesta pasta e reinicie o comando de geração.

Consulte o arquivo `PLOP_SETUP.md` na raiz do projeto para documentação completa. 