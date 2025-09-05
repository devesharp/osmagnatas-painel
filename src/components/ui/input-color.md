# InputColor

Componente de entrada de cor que combina um seletor visual (react-colorful) com um campo de texto para entrada manual de códigos hexadecimais.

## Características

- ✅ **Seletor visual**: HexColorPicker do react-colorful integrado
- ✅ **Entrada manual**: Campo de texto para códigos hex
- ✅ **Validação automática**: Rejeita cores inválidas
- ✅ **Sincronização bidirecional**: Mudanças no picker refletem no texto e vice-versa
- ✅ **Suporte a formulários**: Integração com react-hook-form via useFormField
- ✅ **Prefixo visual**: Mostra a cor selecionada e o símbolo #
- ✅ **Validação inteligente**: Remove caracteres inválidos durante digitação
- ✅ **Fallback**: Reverte para última cor válida em caso de entrada inválida
- ✅ **Suporte a paste**: Remove automaticamente # se colado
- ✅ **Cores de 3 e 6 dígitos**: Suporta formatos como "abc" e "abcdef"

## Instalação

O componente depende do react-colorful para o seletor de cores:

```bash
npm install react-colorful
```

## Uso Básico

```tsx
import { InputColor } from "@/components/ui/input-color";

function MyComponent() {
  const [color, setColor] = useState("ff0000");
  
  return (
    <InputColor
      title="Escolha uma cor"
      value={color}
      onValueChange={setColor}
      placeholder="000000"
    />
  );
}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `name` | `string` | - | Nome do campo para integração com formulários |
| `title` | `string` | - | Label/título do campo |
| `placeholder` | `string` | `"000000"` | Placeholder do input de texto |
| `value` | `string` | - | Valor controlado (código hex sem #) |
| `onChange` | `function` | - | Callback de mudança (compatibilidade) |
| `onValueChange` | `function` | - | Callback de mudança do valor |
| `disabled` | `boolean` | `false` | Se o componente está desabilitado |
| `className` | `string` | - | Classes CSS adicionais |

## Exemplos

### Componente Controlado

```tsx
function ControlledExample() {
  const [primaryColor, setPrimaryColor] = useState("3366cc");
  
  return (
    <div>
      <InputColor
        title="Cor Primária"
        value={primaryColor}
        onValueChange={setPrimaryColor}
      />
      <div 
        className="w-16 h-16 border rounded"
        style={{ backgroundColor: `#${primaryColor}` }}
      />
    </div>
  );
}
```

### Integração com Formulários

```tsx
import { useForm } from "react-hook-form";

function FormExample() {
  return (
    <form>
      <InputColor
        name="backgroundColor"
        title="Cor de Fundo"
        placeholder="ffffff"
      />
      {/* Outros campos... */}
    </form>
  );
}
```

### Múltiplas Cores

```tsx
function PaletteExample() {
  const [colors, setColors] = useState({
    primary: "ff0000",
    secondary: "00ff00",
    accent: "0000ff"
  });

  const updateColor = (key: string) => (value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <InputColor
        title="Cor Primária"
        value={colors.primary}
        onValueChange={updateColor('primary')}
      />
      <InputColor
        title="Cor Secundária"
        value={colors.secondary}
        onValueChange={updateColor('secondary')}
      />
      <InputColor
        title="Cor de Destaque"
        value={colors.accent}
        onValueChange={updateColor('accent')}
      />
    </div>
  );
}
```

## Validação

O componente valida automaticamente as cores inseridas:

### ✅ Cores Válidas
- `"ff0000"` - Vermelho (6 dígitos)
- `"abc"` - Expandido para "aabbcc" (3 dígitos)
- `"123456"` - Cor válida
- `"#00ff00"` - Remove o # automaticamente

### ❌ Cores Inválidas
- `"xyz123"` - Contém caracteres não-hex
- `"gggggg"` - 'g' não é hex
- `"12345"` - Número incorreto de dígitos
- `"1234567"` - Muitos dígitos

## Comportamentos Especiais

### Paste com #
Quando o usuário cola uma cor com #, o símbolo é removido automaticamente:
```
Cole: "#ff0000" → Resultado: "ff0000"
```

### Cores de 3 Dígitos
Cores de 3 dígitos são expandidas para 6:
```
Digite: "abc" → Armazenado: "aabbcc"
```

### Validação em Tempo Real
- Durante a digitação: Remove caracteres inválidos
- Ao perder o foco: Reverte para última cor válida se inválida
- Limite de 6 caracteres

### Sincronização Bidirecional
- Mudança no ColorPicker → Atualiza o texto
- Mudança no texto → Atualiza o ColorPicker
- Ambos propagam para `onValueChange`

## Estilos CSS

O componente usa classes Tailwind CSS. O react-colorful não requer estilos CSS adicionais, mas você pode customizar a aparência através de CSS customizado se necessário.

## Acessibilidade

- ✅ Labels apropriados
- ✅ Estados de foco
- ✅ Estados desabilitado
- ✅ Indicação de erro
- ✅ Navegação por teclado no ColorPicker

## Dependências

- `react-colorful` - Para o HexColorPicker
- `@radix-ui/react-popover` - Para o popover que contém o seletor
- `@devesharp/react-hooks-v2` - Para useFormField
- `tailwindcss` - Estilos

## Notas Técnicas

- O valor é sempre armazenado sem o prefixo #
- A validação usa regex `/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/`
- Cores são normalizadas para maiúsculas
- Suporta modo escuro via classes CSS
- Performance otimizada com hooks de estado apropriados 