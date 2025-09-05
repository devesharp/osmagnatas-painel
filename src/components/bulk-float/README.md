# BulkFloat

Componente flutuante que aparece na parte inferior da tela quando itens são selecionados, oferecendo ações em lote. É totalmente responsivo, adaptando-se automaticamente ao tamanho da tela.

## Características

- **Responsivo**: Automaticamente alterna entre mostrar texto completo e apenas ícones com tooltips
- **Flutuante**: Posicionado fixo na parte inferior da tela
- **Animado**: Aparece com animação suave
- **Acessível**: Inclui tooltips e labels apropriados
- **Flexível**: Suporta ações customizadas com ou sem ícones

## Props

### `BulkFloatProps`

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `itemsSelected` | `number` | ✅ | Número de itens selecionados para exibir a quantidade |
| `onClearSelect` | `() => void` | ✅ | Função para limpar a seleção de itens |
| `actions` | `BulkFloatAction[]` | ✅ | Array de ações disponíveis no componente |
| `className` | `string` | ❌ | Classe CSS adicional |

### `BulkFloatAction`

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `icon` | `ReactNode` | ❌ | Ícone da ação (componente React ou string) |
| `title` | `string` | ✅ | Título da ação que será exibido |
| `onClick` | `() => void` | ✅ | Função executada ao clicar na ação |

## Uso Básico

```tsx
import { BulkFloat } from '@/components/bulk-float'
import { Edit, Trash2, Download } from 'lucide-react'

function MyComponent() {
  const [selectedCount, setSelectedCount] = useState(0)

  const actions = [
    {
      icon: <Edit className="h-4 w-4" />,
      title: 'Editar',
      onClick: () => console.log('Editando itens'),
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      title: 'Excluir',
      onClick: () => console.log('Excluindo itens'),
    },
    {
      icon: <Download className="h-4 w-4" />,
      title: 'Baixar',
      onClick: () => console.log('Baixando itens'),
    },
  ]

  return (
    <div>
      {/* Seu conteúdo aqui */}
      
      <BulkFloat
        itemsSelected={selectedCount}
        onClearSelect={() => setSelectedCount(0)}
        actions={actions}
      />
    </div>
  )
}
```

## Comportamento Responsivo

O componente detecta automaticamente quando ocupa mais de 90% da largura da tela. Quando isso acontece:

- **Componente < 90% da tela**: Mostra ícone + texto para cada ação
- **Componente ≥ 90% da tela**: Mostra apenas ícones com tooltips

## Exemplos

### Ações sem ícones

```tsx
const actions = [
  {
    title: 'Ação sem ícone',
    onClick: () => console.log('Clicou'),
  },
]
```

### Muitas ações

```tsx
const actions = [
  { icon: <Edit />, title: 'Editar', onClick: () => {} },
  { icon: <Trash2 />, title: 'Excluir', onClick: () => {} },
  { icon: <Download />, title: 'Baixar', onClick: () => {} },
  { icon: <Share />, title: 'Compartilhar', onClick: () => {} },
  { icon: <Copy />, title: 'Copiar', onClick: () => {} },
  { icon: <Archive />, title: 'Arquivar', onClick: () => {} },
]
```

### Customização de estilo

```tsx
<BulkFloat
  itemsSelected={itemCount}
  onClearSelect={clearSelection}
  actions={actions}
  className="border-2 border-blue-500"
/>
```

## Funcionalidades

### Contador inteligente

- Mostra "1 item selecionado" para singular
- Mostra "X itens selecionados" para plural

### Visibilidade condicional

- Só aparece quando há itens selecionados
- Desaparece automaticamente quando a seleção é limpa

### Animações

- Aparece com animação suave de baixo para cima
- Transições suaves entre estados

## Acessibilidade

- Tooltips em todos os botões
- Labels apropriados para screen readers
- Navegação por teclado suportada
- Contraste adequado

## Dependências

- `@/components/ui/button`
- `@/components/ui/tooltip`
- `lucide-react` (para o ícone X)
- `@/lib/utils` (função `cn`)

## Testes

O componente inclui testes abrangentes que cobrem:

- Renderização com diferentes quantidades de itens
- Comportamento de cliques
- Visibilidade condicional
- Aplicação de classes customizadas
- Funcionalidade de tooltips

Execute os testes com:

```bash
npm test bulk-float
```

## Stories

Veja todas as variações do componente no Storybook:

```bash
npm run storybook
```

Navegue para `Components/BulkFloat` para ver todos os exemplos interativos. 