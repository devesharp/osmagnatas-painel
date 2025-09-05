# Documentação dos Componentes de Formulário

Esta documentação apresenta os principais componentes de formulário disponíveis na pasta `@ui` com exemplos simples de uso. Todos os componentes possuem integração nativa com `useViewForm` de `@devesharp/react-hooks-v2`, quando necessitar de formulários mais completos e maior controle sobre ele use a biblioteca, se não, apenas use os componente controlado `value`.

## Input

Componente básico para entrada de texto com integração automática ao `react-hook-form`.

### Importação
```tsx
import { Input } from "@/components/ui/input"
```

### Props
- Herda todas as props do elemento HTML `<input>`
- `className`: Classes CSS adicionais (opcional)
- `type`: Tipo do input (text, email, password, etc.)
- `title`: Label automático para o input (opcional)
- `name`: Enviar para ativar o react-hook-form deve ser encapsulado no FormProvider (opcional)
- `mask`: 'phone' | 'cellphone' | 'cpf' | 'cnpj' | 'cep' | 'rg' | 'currency' | 'percentage' | 'date' | 'time' | 'datetime' | 'credit-card' | 'pis' | 'renavam' | 'chassi' | 'placa-veiculo' | 'titulo-eleitor' | 'numero-processo'
- prefix?: React.ReactNode | string; 
- suffix?: React.ReactNode | string;

### Exemplos

#### Input básico
```tsx
<Input placeholder="Digite seu nome" />
```

#### Input com título automático
```tsx
<Input title="Nome completo" placeholder="Digite seu nome" />
```

#### Input com tipos específicos
```tsx
<Input type="email" title="Email" placeholder="seu@email.com" />
<Input type="password" title="Senha" placeholder="Sua senha" />
<Input type="number" title="Idade" placeholder="Idade" />
```

#### Input com react-hook-form
```tsx
// Dentro de um FormProvider
<Input 
  name="username"
  title="Nome de usuário"
  placeholder="Digite seu nome"
/>
```

---

## Select

Componente dropdown para seleção de opções com integração automática ao `react-hook-form`.

### Importação
```tsx
import { Select } from "@/components/ui/select"
// ou para uso manual:
import {
  SelectBase,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

### Props (Componente integrado)
- `title`: Label automático (opcional)
- `options`: Array de objetos `{ label: string, value: string }`
- `name`: Nome do campo para react-hook-form
- `placeholder`: Texto placeholder (padrão: "Selecione uma opção")
- `name`: Enviar para ativar o react-hook-form deve ser encapsulado no FormProvider (opcional)

### Exemplo
```tsx
<Select
  name="country"
  title="País"
  options={[
    { label: "Brasil", value: "br" },
    { label: "Estados Unidos", value: "us" },
    { label: "Canadá", value: "ca" }
  ]}
/>
```

---

## Radio Group

Componente para seleção única entre múltiplas opções com integração automática ao `react-hook-form`.

### Importação
```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
```

### Props (Componente integrado)
- `title`: Label automático (opcional)
- `options`: Array de objetos `{ label: string, value: string }`
- `name`: Nome do campo para react-hook-form
- `name`: Enviar para ativar o react-hook-form deve ser encapsulado no FormProvider (opcional)

### Exemplo
```tsx
<RadioGroup
  name="size"
  title="Tamanho"
  options={[
    { label: "Pequeno", value: "small" },
    { label: "Médio", value: "medium" },
    { label: "Grande", value: "large" }
  ]}
/>
```

---

## Checkbox

Componente para seleção múltipla ou confirmação com integração automática ao `react-hook-form`.

### Importação
```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

### Props
- `title`: Label automático (opcional)
- `name`: Enviar para ativar o react-hook-form deve ser encapsulado no FormProvider (opcional)

### Exemplo
```tsx
<Checkbox 
  name="terms"
  title="Aceito os termos e condições"
/>
```

---

## Switch

Componente toggle para alternar entre dois estados com integração automática ao `react-hook-form`.

### Importação
```tsx
import { Switch } from "@/components/ui/switch"
```

### Props
- `title`: Label automático (opcional)
- `name`: Enviar para ativar o react-hook-form deve ser encapsulado no FormProvider (opcional)

### Exemplo
```tsx
<Switch 
  name="notifications"
  title="Receber notificações"
/>
```

---

## Textarea

Componente para entrada de texto multilinha.

### Importação
```tsx
import { Textarea } from "@/components/ui/textarea"
```

### Props
- Herda todas as props do elemento HTML `<textarea>`
- `className`: Classes CSS adicionais (opcional)
- `name`: Enviar para ativar o react-hook-form deve ser encapsulado no FormProvider (opcional)

### Exemplo
```tsx
<Textarea placeholder="Digite sua mensagem aqui..." />
```

## Exemplo de Formulário Completo com React Hook Form

Aqui está um exemplo que combina todos os componentes com validação:

```tsx
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { RadioGroup } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  prioridade: z.enum(["baixa", "media", "alta"]),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  newsletter: z.boolean(),
  notificacoes: z.boolean(),
  volume: z.array(z.number()).length(1),
  codigo: z.string().length(6, "Código deve ter 6 dígitos"),
})

function FormularioCompleto() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      categoria: "",
      prioridade: "media",
      mensagem: "",
      newsletter: false,
      notificacoes: true,
      volume: [50],
      codigo: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Dados do formulário:", values)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
        
        {/* Input básico */}
        <Input
          title="Nome completo"
          name="nome"
        />

        {/* Input com tipo específico */}
        <Input
          title="Email"
          name="email"
          type="email"
          placeholder="seu@email.com"
        />

        {/* Select */}
        <Select
          title="Categoria"
          name="categoria"
          options={[
            { label: "Suporte", value: "suporte" },
            { label: "Vendas", value: "vendas" },
            { label: "Feedback", value: "feedback" }
          ]}
        />

        {/* Radio Group */}
        <RadioGroup
          title="Prioridade"
          name="prioridade"
          options={[
            { label: "Baixa", value: "baixa" },
            { label: "Média", value: "media" },
            { label: "Alta", value: "alta" }
          ]}
        />

        {/* Textarea */}
        <Textarea
          title="Mensagem"
          name="mensagem"
          placeholder="Descreva sua solicitação..."
        />

        {/* Checkbox */}
        <Checkbox
          title="Quero receber newsletter"
          name="newsletter"
        />

        {/* Switch */}
        <Switch
          title="Notificações por email"
          name="notificacoes"
        />

        <Button type="submit" className="w-full">
          Enviar Formulário
        </Button>
      </form>
    </FormProvider>
  )
}
```

## Form usando @devesharp/react-hooks-v2

Sistema completo de formulários baseado em `@devesharp/react-hooks-v2` com validação e gerenciamento de estado.

### Importação
```tsx
import { useViewForm, ViewFormProvider, zodWrapper } from "@devesharp/react-hooks-v2"
import * as z from "zod"
```

### Exemplo básico com Form
```tsx
import { useViewForm, ViewFormProvider, zodWrapper } from "@devesharp/react-hooks-v2"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const formSchema = z.object({
  username: z.string({
    required_error: "Nome é obrigatório", 
  }).min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string({
    required_error: "Email é obrigatório",
  }).email("Email inválido"),
})

function MyForm() {
  const viewForm = useViewForm({
    resolveAction: (data) => promise(data),
    validateData: zodWrapper(formSchema),
    onSuccess(resp, creating) {
      toast.success("Salvo")
    },
    onFailed(resp, creating) {
      toast.error("Erro", {
        description: resp.message
      })
    },
  });

  return (
    <ViewFormProvider {...viewForm}>
      <form onSubmit={viewForm.submitForm} className="space-y-8">
        <Input name="username" title="Nome de usuário" />
        <Input name="email" title="Email" />
        <Button type="submit">Enviar</Button>
      </form>
    </ViewFormProvider>
  )
}
```

## Dicas de Uso

### Integração com React Hook Form
- Todos os componentes possuem integração automática quando usados dentro de um `FormProvider`
- Use a prop `name` para conectar o campo ao formulário
- Use a prop `title` para labels automáticos
- Mensagens de erro são exibidas automaticamente

### Acessibilidade
- Sempre use `FormLabel` ou a prop `title` para labels
- Use `FormDescription` para textos de ajuda
- Use `FormMessage` para mensagens de erro
- Todos os componentes possuem suporte a `aria-*` attributes

### Validação
- Use bibliotecas como `zod` com `@hookform/resolvers/zod`
- Validação acontece automaticamente com `react-hook-form`
- Mensagens de erro são exibidas em tempo real

### Estilização
- Todos os componentes aceitam `className` para customização
- Use as classes do Tailwind CSS para ajustes rápidos
- Mantenha consistência visual em todo o formulário
- Estados de erro são aplicados automaticamente

