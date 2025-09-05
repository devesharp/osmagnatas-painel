# TableListing

Componente de tabela responsiva com ordenação e configuração flexível de colunas, utilizando `react-super-responsive-table` para responsividade em dispositivos móveis.

## Características

- ✅ **Responsivo**: Adapta-se automaticamente a diferentes tamanhos de tela
- ✅ **Ordenação**: Suporte a ordenação por colunas com indicadores visuais
- ✅ **Configurável**: Colunas totalmente customizáveis com renderização personalizada
- ✅ **Estados**: Suporte a loading, estado vazio e mensagens customizadas
- ✅ **Interativo**: Clique em linhas e hover effects
- ✅ **Seleção**: Checkbox para seleção individual e em lote
- ✅ **Acessível**: Estrutura semântica e navegação por teclado
- ✅ **TypeScript**: Totalmente tipado com generics para type safety

## Instalação

O componente depende do `react-super-responsive-table` que já está instalado no projeto.

## Uso Básico

```tsx
import { TableListing, ColumnConfig } from '@/components/table-listing';

const data = [
  { id: 1, name: 'João', email: 'joao@example.com', age: 30 },
  { id: 2, name: 'Maria', email: 'maria@example.com', age: 25 }
];

const columns: ColumnConfig[] = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: 'Nome', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'age', title: 'Idade', sortable: true }
];

function MyTable() {
  return (
    <TableListing
      items={data}
      columns={columns}
      hoverable={true}
    />
  );
}
```

## Configuração de Colunas

### Propriedades da ColumnConfig

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `key` | `string` | Chave única da coluna (obrigatório) |
| `title` | `string` | Título exibido no cabeçalho (obrigatório) |
| `width` | `string` | Largura da coluna (ex: "100px", "20%") |
| `sortable` | `boolean` | Se a coluna pode ser ordenada |
| `render` | `function` | Função para renderização customizada |
| `sortValue` | `function` | Função para extrair valor de ordenação |
| `className` | `string` | Classes CSS para a célula |
| `headerClassName` | `string` | Classes CSS para o cabeçalho |
| `hideOnMobile` | `boolean` | Ocultar coluna em dispositivos móveis |

### Renderização Customizada

```tsx
const columns: ColumnConfig<User>[] = [
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (user) => (
      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
        {user.status === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    )
  },
  {
    key: 'actions',
    title: 'Ações',
    render: (user) => (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => edit(user)}>Editar</Button>
        <Button size="sm" variant="destructive" onClick={() => delete(user)}>Excluir</Button>
      </div>
    )
  }
];
```

## Props do Componente

### TableListingProps

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `items` | `T[]` | - | Array de itens a serem exibidos (obrigatório) |
| `columns` | `ColumnConfig<T>[]` | - | Configuração das colunas (obrigatório) |
| `defaultSort` | `SortState` | `null` | Estado inicial de ordenação |
| `sortState` | `SortState` | - | Controle externo do estado de ordenação |
| `onSortChange` | `function` | - | Callback quando a ordenação muda |
| `emptyMessage` | `string` | "Nenhum item encontrado" | Mensagem quando não há dados |
| `loading` | `boolean` | `false` | Estado de carregamento |
| `loadingMessage` | `string` | "Carregando..." | Mensagem de loading |
| `className` | `string` | - | Classes CSS para a tabela |
| `containerClassName` | `string` | - | Classes CSS para o container |
| `onRowClick` | `function` | - | Callback quando uma linha é clicada |
| `getRowKey` | `function` | - | Função para gerar key única da linha |
| `hoverable` | `boolean` | `true` | Destacar linhas ao passar o mouse |
| `striped` | `boolean` | `false` | Mostrar linhas zebradas |
| `withSelect` | `boolean` | `false` | Adicionar coluna de seleção com checkbox |
| `selecteds` | `string[]` | `[]` | Array de IDs dos itens selecionados |
| `onSelected` | `function` | - | Callback quando a seleção muda |
| `getItemId` | `function` | - | Função para extrair ID do item (obrigatória com withSelect) |

## Seleção com Checkbox

Para habilitar a funcionalidade de seleção, use as props `withSelect`, `selecteds`, `onSelected` e `getItemId`:

```tsx
import { useState } from 'react';
import { TableListing, ColumnConfig } from '@/components/table-listing';

function TableWithSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const data = [
    { id: 1, name: 'João', email: 'joao@example.com' },
    { id: 2, name: 'Maria', email: 'maria@example.com' }
  ];

  const columns: ColumnConfig[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: 'Nome', sortable: true },
    { key: 'email', title: 'Email', sortable: true }
  ];

  return (
    <div>
      {/* Informações sobre seleção */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded">
          <p>{selectedIds.length} item(s) selecionado(s)</p>
          <button onClick={() => console.log('Ação em lote:', selectedIds)}>
            Executar Ação
          </button>
        </div>
      )}

      {/* Tabela com seleção */}
      <TableListing
        items={data}
        columns={columns}
        withSelect={true}
        selecteds={selectedIds}
        onSelected={setSelectedIds}
        getItemId={(item) => String(item.id)}
      />
    </div>
  );
}
```

### Funcionalidades de Seleção

- **Checkbox no Header**: Seleciona/deseleciona todos os itens visíveis
- **Estado Indeterminado**: Quando apenas alguns itens estão selecionados
- **Checkbox Individual**: Para cada linha da tabela
- **Prevenção de Conflitos**: Cliques no checkbox não ativam `onRowClick`

## Exemplos Avançados

### Controle Externo de Ordenação

```tsx
function ControlledTable() {
  const [sortState, setSortState] = useState<SortState>({ 
    column: null, 
    direction: null 
  });

  return (
    <TableListing
      items={data}
      columns={columns}
      sortState={sortState}
      onSortChange={setSortState}
    />
  );
}
```

### Clique em Linhas

```tsx
function InteractiveTable() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <TableListing
      items={data}
      columns={columns}
      onRowClick={(item, index) => {
        setSelectedItem(item);
        console.log('Linha clicada:', item, 'Índice:', index);
      }}
    />
  );
}
```

### Estados de Loading e Vazio

```tsx
function StatefulTable() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <TableListing
      items={data}
      columns={columns}
      loading={loading}
      loadingMessage="Carregando dados..."
      emptyMessage="Nenhum resultado encontrado"
    />
  );
}
```

### Ordenação Customizada

```tsx
const columns: ColumnConfig<User>[] = [
  {
    key: 'createdAt',
    title: 'Data de Criação',
    sortable: true,
    render: (user) => user.createdAt.toLocaleDateString('pt-BR'),
    sortValue: (user) => user.createdAt // Ordena pela data, não pela string formatada
  }
];
```

## Responsividade

O componente utiliza `react-super-responsive-table` para responsividade:

- **Desktop**: Tabela normal com todas as colunas
- **Mobile**: Transforma em cards empilhados
- **Controle**: Use `hideOnMobile` para ocultar colunas específicas em mobile

```tsx
const columns: ColumnConfig[] = [
  { key: 'id', title: 'ID', hideOnMobile: true }, // Oculta em mobile
  { key: 'name', title: 'Nome' }, // Sempre visível
  { key: 'email', title: 'Email', hideOnMobile: true } // Oculta em mobile
];
```

## Estilização

O componente utiliza classes Tailwind CSS e pode ser customizado:

```tsx
<TableListing
  items={data}
  columns={columns}
  className="border-2 border-red-500" // Classes para a tabela
  containerClassName="p-4 bg-gray-50" // Classes para o container
  striped={true} // Linhas zebradas
  hoverable={true} // Efeito hover
/>
```

## TypeScript

O componente é totalmente tipado com generics:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const columns: ColumnConfig<User>[] = [
  {
    key: 'name',
    title: 'Nome',
    render: (user: User) => user.name.toUpperCase() // Type safety
  }
];

<TableListing<User>
  items={users}
  columns={columns}
  onRowClick={(user: User) => console.log(user.email)} // Type safety
/>
```

## Acessibilidade

- Estrutura semântica com elementos `table`, `thead`, `tbody`
- Navegação por teclado nos cabeçalhos ordenáveis
- Indicadores visuais de ordenação
- Mensagens de estado para leitores de tela

## Performance

- Ordenação otimizada com `useMemo`
- Callbacks memoizados com `useCallback`
- Re-renderizações minimizadas
- Suporte a `getRowKey` para otimização de listas grandes 