# Template de Página de Formulário

Este template gera uma página de formulário completa baseada na estrutura da `condominiums-form-page`.

## 🚀 Como usar

```bash
# Comando básico
npm run generate:page-form --name="users-form"

# Ou usando plop diretamente
npx plop page-form --name="users-form"

# Especificando diretório personalizado
npm run generate:page-form --name="products-form" --dir="src/_pages"
```

## 📁 Estrutura gerada

O gerador criará a seguinte estrutura:

```
users-form-page/
├── index.tsx                    # Exportações
├── users-form-page.tsx         # Componente principal da página
├── users-form-page.ctrl.tsx    # Controller com lógica de formulário
└── users-form-page.types.tsx   # Tipos TypeScript
```

## 🎯 Características do template

### Componente principal (`users-form-page.tsx`)
- Layout responsivo com header e footer fixos
- Área de conteúdo com scroll
- Seções organizadas com títulos e bordas
- Formulário usando `ViewFormProvider`
- Componentes de UI pré-configurados:
  - `Input` (com suporte a máscaras)
  - `Textarea`
  - `UploadImagesInput`
- Loading overlay durante salvamento
- Botão de salvar no footer

### Controller (`users-form-page.ctrl.tsx`)
- Usa `useViewForm` do `@devesharp/react-hooks-v2`
- Configuração para buscar, criar e atualizar dados
- Gerenciamento de upload de imagens
- Toast notifications para sucesso/erro
- Validação com Zod
- Estrutura preparada para integração com API
- Tipos TypeScript bem definidos

### Tipos (`users-form-page.types.tsx`)
- Interface para props do componente
- Interface para dados do formulário
- Campos básicos pré-definidos (NOME, DESCRICAO, VIDEO)
- Comentários TODO para personalização

## 🔧 Personalização

Após gerar o template, você deve:

1. **Configurar a API**:
   ```typescript
   // Substituir a API temporária por uma real
   import { usersFormApi, UsersFormItem } from "@/api/users-form.request";
   ```

2. **Definir os campos do formulário**:
   ```typescript
   // Em users-form-page.types.tsx
   export interface IUsersFormPageForm {
     id?: number;
     NOME?: string;
     EMAIL?: string;
     TELEFONE?: string;
     // Seus campos específicos
   }
   ```

3. **Personalizar o layout**:
   ```tsx
   // Em users-form-page.tsx
   <div className="space-y-8">
     <div className="">
       <h2 className="font-semibold mb-4 border-b pb-2">
         Dados do Usuário
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Input name="NOME" title="Nome Completo *" />
         <Input name="EMAIL" title="E-mail *" type="email" />
         <Input name="TELEFONE" title="Telefone" mask="phone" />
       </div>
     </div>
   </div>
   ```

4. **Configurar validações**:
   ```typescript
   // Personalizar validações com zod
   validateData: zodWrapper(
     z.object({
       NOME: z.string().min(1, "Nome é obrigatório"),
       EMAIL: z.string().email("E-mail inválido"),
       TELEFONE: z.string().optional(),
     })
   ),
   ```

## 📋 Exemplo de uso completo

```bash
# Gerar uma página de formulário de usuários
npm run generate:page-form --name="users-form"

# Gerar uma página de formulário de produtos
npm run generate:page-form --name="products-form"

# Gerar em diretório específico
npm run generate:page-form --name="admin-form" --dir="src/admin/_pages"
```

## 🎨 Componentes incluídos

O template inclui imports para os componentes essenciais:

- `Input` - Campos de texto com suporte a máscaras
- `Textarea` - Campos de texto multilinha
- `Button` - Botões de ação
- `LoadingForeground` - Overlay de carregamento
- `UploadImagesInput` - Upload de imagens com preview
- `ViewFormProvider` - Provider para gerenciamento de formulário

## 🔗 Integração com API

O template está preparado para usar o padrão de API do projeto:

```typescript
// Exemplo de implementação da API
export const usersFormApi = {
  getById: async (id: number): Promise<UsersFormItem> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<UsersFormItem>): Promise<UsersFormItem> => {
    const response = await api.post('/users', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<UsersFormItem>): Promise<UsersFormItem> => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },
};
```

## 📱 Responsividade

O template é totalmente responsivo:
- Layout flexível que se adapta a diferentes tamanhos de tela
- Grid system responsivo (`grid-cols-1 md:grid-cols-2`)
- Componentes otimizados para mobile e desktop
- Scroll interno para conteúdo longo

## 🖼️ Upload de Imagens

O template inclui funcionalidade completa de upload de imagens:
- Suporte a múltiplas imagens
- Preview das imagens
- Gerenciamento de imagens existentes
- Integração com o backend via FormData

## ✅ Validação e Tratamento de Erros

- Validação de campos obrigatórios
- Mensagens de erro personalizadas
- Toast notifications para feedback do usuário
- Tratamento de erros de API

---

Este template fornece uma base sólida para páginas de formulário, seguindo os padrões estabelecidos no projeto e facilitando a manutenção e extensibilidade. 