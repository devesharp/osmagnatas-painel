# Filtros da Página de Logs

Este componente fornece filtros para a página de listagem de logs do sistema.

## Estrutura de Arquivos

- `logs-listing-page-filters.tsx` - Componente principal de filtros
- `logs-listing-page-filters.ctrl.tsx` - Controller com lógica de negócio
- `logs-listing-page-filters.types.tsx` - Tipos e schemas de validação

## Filtros Disponíveis

### 1. Usuário
- **Tipo**: Select dropdown
- **Descrição**: Filtra logs por usuário específico
- **Opções**: Carregadas dinamicamente da API de usuários
- **Valor padrão**: "Todos os usuários"

### 2. Ação (Tipo de Log)
- **Tipo**: Select dropdown
- **Descrição**: Filtra logs por tipo de ação realizada
- **Opções**:
  - Todas as ações
  - Login
  - Logout
  - Criar Transação
  - Atualizar Transação
  - Excluir Transação
  - Criar Cliente
  - Atualizar Cliente
  - Excluir Cliente
  - Visualizar Transação
  - Visualizar Cliente
  - Criar Inadimplência
  - Atualizar Inadimplência
  - Excluir Inadimplência
  - Visualizar Inadimplência

### 3. Data Inicial
- **Tipo**: Input com máscara de data
- **Formato**: DD/MM/AAAA
- **Descrição**: Define a data inicial para o período de busca

### 4. Data Final
- **Tipo**: Input com máscara de data
- **Formato**: DD/MM/AAAA
- **Descrição**: Define a data final para o período de busca

## Funcionalidades

- ✅ Validação de formulário com Zod
- ✅ Máscaras de data automáticas
- ✅ Suporte responsivo (desktop e mobile)
- ✅ Modal de filtros no mobile
- ✅ Botão fixo de filtros na parte inferior em mobile
- ✅ Carregamento dinâmico de usuários
- ✅ Limpar todos os filtros

## Uso

```tsx
import { LogsListingPageFilters } from "./components/logs-listing-page-filters/logs-listing-page-filters";

<LogsListingPageFilters
  filters={ctrl.viewList.filters}
  isVisibleMobile={ctrl.openFilterModal}
  onRequestClose={() => ctrl.setOpenFilterModal(false)}
  onFiltersApply={ctrl.viewList.setFilters}
/>
```

## Schema de Validação

Os filtros são validados usando Zod:

```typescript
{
  user_id?: number;
  log_type?: LogType;
  date_from?: string; // Formato: DD/MM/AAAA
  date_to?: string;   // Formato: DD/MM/AAAA
  limit?: number;
  offset?: number;
}
```

## Comportamento Mobile

- Em telas pequenas (< 768px), os filtros são exibidos em um modal
- Botão fixo na parte inferior da tela para abrir filtros
- Os filtros são aplicados ao fechar o modal

