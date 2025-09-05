# FiltersContainer

Um componente container responsivo para filtros que se adapta automaticamente entre desktop e mobile.

## Características

- **Responsivo**: No desktop exibe os filtros diretamente, no mobile abre um modal
- **Flexível**: Aceita qualquer conteúdo como children
- **Customizável**: Permite personalizar título, texto do botão e comportamentos
- **Acessível**: Implementa boas práticas de acessibilidade

## Uso Básico

```tsx
import { FiltersContainer } from '@/components/filters-container';

function MyComponent() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FiltersContainer
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      onSubmit={() => console.log('Filtros aplicados')}
      title="Meus Filtros"
    >
      {/* Seu conteúdo de filtros aqui */}
      <input placeholder="Buscar..." />
      <select>
        <option>Categoria 1</option>
        <option>Categoria 2</option>
      </select>
    </FiltersContainer>
  );
}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `ReactNode` | - | Conteúdo dos filtros a ser exibido |
| `visible` | `boolean` | `false` | Controla a visibilidade do modal no mobile |
| `onRequestClose` | `() => void` | - | Função chamada quando o usuário solicita fechar o modal |
| `onSubmit` | `() => void` | - | Função chamada quando o usuário clica no botão de submit |
| `submitButtonText` | `string` | `"Aplicar Filtros"` | Texto do botão de submit |
| `submitButtonDisabled` | `boolean` | `false` | Indica se o botão de submit deve estar desabilitado |
| `title` | `string` | `"Filtros"` | Título do modal no mobile |
| `className` | `string` | - | Classes CSS adicionais para o container |

## Comportamento

### Desktop
- Exibe o conteúdo diretamente na página
- Não mostra modal ou botão de submit
- Aplica a `className` no container principal

### Mobile
- Exibe o conteúdo em um modal (Sheet) que ocupa 90% da altura da tela
- Modal é controlado pela prop `visible`
- Mostra botão de submit fixo na parte inferior (se `onSubmit` for fornecido)
- Permite fechar o modal através do `onRequestClose`

## Exemplos

### Filtros Simples

```tsx
<FiltersContainer>
  <div className="space-y-4">
    <input placeholder="Buscar produtos..." />
    <select>
      <option>Todas as categorias</option>
      <option>Eletrônicos</option>
      <option>Roupas</option>
    </select>
  </div>
</FiltersContainer>
```

### Com Controle de Estado

```tsx
function FilteredList() {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({});

  const handleApplyFilters = () => {
    // Aplicar filtros
    console.log('Aplicando filtros:', filters);
    setFiltersVisible(false);
  };

  return (
    <>
      <button onClick={() => setFiltersVisible(true)}>
        Abrir Filtros
      </button>
      
      <FiltersContainer
        visible={filtersVisible}
        onRequestClose={() => setFiltersVisible(false)}
        onSubmit={handleApplyFilters}
        title="Filtrar Produtos"
        submitButtonText="Buscar"
      >
        {/* Seus filtros aqui */}
      </FiltersContainer>
    </>
  );
}
```

### Sem Botão de Submit

```tsx
<FiltersContainer
  visible={isVisible}
  onRequestClose={() => setIsVisible(false)}
  title="Filtros Avançados"
  // Sem onSubmit - não mostra botão
>
  {/* Filtros que aplicam automaticamente */}
</FiltersContainer>
```

## Detecção de Mobile

O componente usa o hook `useIsMobile()` que considera mobile dispositivos com largura menor que 768px.

## Dependências

- `@/hooks/use-mobile` - Hook para detecção de dispositivos móveis
- `@/components/ui/sheet` - Componente de modal para mobile
- `@/components/ui/button` - Componente de botão
- `@/lib/utils` - Utilitários (função `cn`)

## Acessibilidade

- Modal implementa foco adequado
- Botão de fechar acessível via teclado
- Títulos semânticos
- Suporte a screen readers

## Customização

### Estilos

O componente aceita `className` para customização adicional:

```tsx
<FiltersContainer className="bg-gray-50 p-4 rounded-lg">
  {/* conteúdo */}
</FiltersContainer>
```

### Comportamento do Modal

O modal no mobile:
- Abre pela parte inferior da tela
- Ocupa 90% da altura
- Tem scroll interno se o conteúdo for muito grande
- Botão de submit fixo na parte inferior

## Storybook

O componente possui stories completas no Storybook com exemplos para:
- Desktop
- Mobile (visível/oculto)
- Diferentes configurações
- Estados de loading/disabled

Para visualizar: `npm run storybook` 