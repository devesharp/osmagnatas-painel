# UsuarioImagem

Componente para upload e exibição de imagens de usuário em formato base64.

## Funcionalidades

- ✅ Upload de imagens via drag & drop ou seleção de arquivo
- ✅ Exibição de imagem atual
- ✅ Remoção de imagem
- ✅ **Redimensionamento automático para 300x300px**
- ✅ **Conversão automática para JPG (qualidade 85%)**
- ✅ Conversão automática para base64
- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Limitação de tamanho (5MB)
- ✅ Interface responsiva e acessível
- ✅ Loading states durante upload

## Uso Básico

```tsx
import { UsuarioImagem } from "@/components/usuario-imagem";

<UsuarioImagem
  value={userImage} // base64 string ou undefined
  onChange={(value) => setUserImage(value)} // chamado quando imagem muda
  onRemove={() => setUserImage(undefined)} // chamado quando imagem é removida
  disabled={false} // opcional: desabilitar componente
/>
```

## Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `value` | `string \| undefined` | ❌ | Valor atual da imagem (base64 ou URL) |
| `onChange` | `(value: string \| undefined) => void` | ❌ | Callback chamado quando imagem muda |
| `onRemove` | `() => void` | ❌ | Callback chamado quando imagem é removida |
| `disabled` | `boolean` | ❌ | Desabilita o componente |
| `className` | `string` | ❌ | Classe CSS adicional |
| `uploadButtonText` | `string` | ❌ | Texto do botão de alterar (padrão: "Alterar Foto") |
| `placeholder` | `string` | ❌ | Texto do placeholder (padrão: "Clique para adicionar foto") |

## Formatos Suportados

- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

## Otimização de Imagem

O componente automaticamente otimiza as imagens carregadas:

- **Redimensionamento**: Imagens são redimensionadas para no máximo 300x300 pixels mantendo a proporção
- **Conversão para JPG**: Todas as imagens são convertidas para formato JPG com qualidade de 85%
- **Compressão**: A combinação de redimensionamento + conversão JPG reduz significativamente o tamanho do arquivo

### Benefícios da Otimização

- **Tamanho reduzido**: Imagens tipicamente ficam 70-90% menores
- **Carregamento rápido**: Menor tamanho de arquivo = upload mais rápido
- **Armazenamento eficiente**: Economiza espaço no banco de dados
- **Compatibilidade**: JPG é suportado universalmente

## Limitações

- Tamanho máximo: 5MB por imagem (antes da otimização)
- Apenas arquivos de imagem são aceitos
- Imagens são sempre convertidas para JPG (perde transparência se for PNG/GIF)

## Exemplo de Integração com Formulário

```tsx
// No controlador do formulário
const handleImageChange = (value: string | undefined) => {
  viewForm.setFieldValue('CORRETOR.IMAGEM', value);
};

const handleImageRemove = () => {
  viewForm.setFieldValue('CORRETOR.IMAGEM', undefined);
};

// No componente
<UsuarioImagem
  value={viewForm.resource.CORRETOR?.IMAGEM}
  onChange={handleImageChange}
  onRemove={handleImageRemove}
/>
```

## Estados

- **Carregando**: Mostra indicador de loading durante conversão
- **Com imagem**: Exibe imagem atual com botão de remover
- **Sem imagem**: Mostra placeholder com ícone e texto
- **Desabilitado**: Componente fica inativo

## Estilos

O componente usa classes Tailwind CSS e segue o design system do projeto. Para personalização, use a prop `className`.
