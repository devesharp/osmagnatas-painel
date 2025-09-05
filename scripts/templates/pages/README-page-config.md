# Template de Página de Configuração

Este template gera uma página de configuração completa baseada na estrutura da `real-estate-config-page`.

## 🚀 Como usar

```bash
# Comando básico
npm run generate:page-config --name="user-config"

# Ou usando plop diretamente
npx plop page-config --name="user-config"

# Especificando diretório personalizado
npm run generate:page-config --name="system-config" --dir="src/_pages"
```

## 📁 Estrutura gerada

O gerador criará a seguinte estrutura:

```
user-config-page/
├── index.tsx                    # Exportações
├── user-config-page.tsx        # Componente principal da página
├── user-config-page.ctrl.tsx   # Controller com lógica de formulário
└── user-config-page.types.tsx  # Tipos TypeScript
```

## 🎯 Características do template

### Componente principal (`user-config-page.tsx`)
- Layout responsivo com header e footer fixos
- Área de conteúdo com scroll
- Seções organizadas com títulos e bordas
- Formulário usando `ViewFormProvider`
- Componentes de UI pré-configurados:
  - `Input` (com suporte a máscaras)
  - `Select`
  - `Switch`
  - `Textarea`
  - `Checkbox`
  - `RadioGroup`
- Loading overlay durante salvamento
- Botão de salvar no footer

### Controller (`user-config-page.ctrl.tsx`)
- Usa `useViewForm` do `@devesharp/react-hooks-v2`
- Configuração para buscar e salvar dados
- Toast notifications para sucesso/erro
- Estrutura preparada para integração com API
- Tipos TypeScript bem definidos

### Tipos (`user-config-page.types.tsx`)
- Interface para props do componente
- Interface para dados do formulário
- Campos básicos pré-definidos
- Comentários TODO para personalização

## 🔧 Personalização

Após gerar o template, você deve:

1. **Configurar a API**:
   ```typescript
   // Substituir a API temporária por uma real
   import { userConfigApi, UserConfigData } from "@/api/user-config.request";
   ```

2. **Definir os campos do formulário**:
   ```typescript
   // Em user-config-page.types.tsx
   export interface IUserConfigForm {
     companyName?: string;
     email?: string;
     phone?: string;
     // Seus campos específicos
   }
   ```

3. **Personalizar o layout**:
   ```tsx
   // Em user-config-page.tsx
   <div className="space-y-8">
     <div className="">
       <h2 className="font-semibold mb-4 border-b pb-2">
         Dados da Empresa
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Input name="companyName" title="Nome da Empresa" />
         <Input name="cnpj" title="CNPJ" mask="cnpj" />
       </div>
     </div>
   </div>
   ```

4. **Configurar validações** (opcional):
   ```typescript
   // Adicionar validações com zod ou yup
   import { z } from "zod";
   
   const schema = z.object({
     companyName: z.string().min(1, "Nome é obrigatório"),
     email: z.string().email("E-mail inválido"),
   });
   ```

## 📋 Exemplo de uso completo

```bash
# Gerar uma página de configuração de usuário
npm run generate:page-config --name="user-settings"

# Gerar uma página de configuração de sistema
npm run generate:page-config --name="system-config"

# Gerar em diretório específico
npm run generate:page-config --name="app-config" --dir="src/admin/_pages"
```

## 🎨 Componentes incluídos

O template inclui imports para todos os componentes de UI necessários:

- `Input` - Campos de texto com suporte a máscaras
- `Select` - Seletores dropdown
- `Switch` - Interruptores on/off
- `Textarea` - Campos de texto multilinha
- `Checkbox` - Caixas de seleção
- `RadioGroup` - Grupos de opções
- `Button` - Botões de ação
- `LoadingForeground` - Overlay de carregamento

## 🔗 Integração com API

O template está preparado para usar o padrão de API do projeto:

```typescript
// Exemplo de implementação da API
export const userConfigApi = {
  get: async (): Promise<UserConfigData> => {
    const response = await api.get('/user-config');
    return response.data;
  },
  
  update: async (data: Partial<UserConfigData>): Promise<UserConfigData> => {
    const response = await api.put('/user-config', data);
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

---

Este template fornece uma base sólida para páginas de configuração, seguindo os padrões estabelecidos no projeto e facilitando a manutenção e extensibilidade. 