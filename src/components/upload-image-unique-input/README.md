# UploadImageUniqueInput

Componente para upload de uma única imagem com preview. Suporta imagens existentes (URL) e arquivos novos para diferentes fluxos de criação e edição.

## Características

- ✅ Upload de uma única imagem
- ✅ Suporte a imagens existentes (URL string)
- ✅ Suporte a arquivos novos (File)
- ✅ Preview da imagem com diferentes tamanhos
- ✅ Botão de remoção
- ✅ Estado vazio interativo
- ✅ Validação de tipos de arquivo
- ✅ Limpeza automática de URLs de objeto
- ✅ Suporte a desabilitação

## Fluxos de Uso

### 1. Criação de Novo Registro
```tsx
const [file, setFile] = useState<File | null>(null);

<UploadImageUniqueInput
  file={file}
  onChangeFile={setFile}
  uploadButtonText="Carregar Imagem"
/>
```

### 2. Edição de Registro Existente
```tsx
const [image, setImage] = useState<string | null>(imageUrl);
const [file, setFile] = useState<File | null>(null);

<UploadImageUniqueInput
  image={image}
  onChangeImage={setImage}
  file={file}
  onChangeFile={setFile}
  uploadButtonText="Alterar Imagem"
/>
```

### 3. Fluxo Completo (Criação + Edição)
```tsx
const [image, setImage] = useState<string | null>(existingImageUrl);
const [file, setFile] = useState<File | null>(null);

<UploadImageUniqueInput
  image={image}
  onChangeImage={setImage}
  file={file}
  onChangeFile={setFile}
  uploadButtonText={image ? "Alterar Imagem" : "Carregar Imagem"}
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|---------|-----------|
| `image` | `string` | `undefined` | URL da imagem existente |
| `onChangeImage` | `(image: string \| null) => void` | `undefined` | Callback para mudanças na imagem |
| `file` | `File \| null` | `undefined` | Arquivo de imagem carregado |
| `onChangeFile` | `(file: File \| null) => void` | `undefined` | Callback para mudanças no arquivo |
| `accept` | `string` | `'image/*'` | Tipos de arquivo aceitos |
| `disabled` | `boolean` | `false` | Se o componente está desabilitado |
| `uploadButtonText` | `string` | `'Upload Imagem'` | Texto do botão de upload |
| `className` | `string` | `undefined` | Classe CSS adicional |
| `alt` | `string` | `'Imagem carregada'` | Texto alternativo para a imagem |
| `previewSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do preview da imagem |

## Tamanhos de Preview

- `sm`: 96x96px (w-24 h-24)
- `md`: 128x128px (w-32 h-32)
- `lg`: 192x192px (w-48 h-48)

## Comportamento

### Prioridade de Exibição
1. Se `file` existe: exibe o preview do arquivo
2. Se `image` existe: exibe a imagem da URL
3. Se nenhum: exibe o estado vazio

### Lógica de Remoção
- Remove tanto `image` quanto `file`
- Chama os callbacks apropriados
- Limpa o input de arquivo

### Lógica de Upload
- Quando um arquivo é selecionado:
  1. Valida se é uma imagem
  2. Remove a imagem existente (se houver)
  3. Define o novo arquivo
  4. Limpa o input para permitir reselecionar

## Exemplos de Uso

### Avatar de Usuário
```tsx
<UploadImageUniqueInput
  image={user.avatar}
  onChangeImage={setUserAvatar}
  file={avatarFile}
  onChangeFile={setAvatarFile}
  uploadButtonText="Alterar Avatar"
  alt="Avatar do usuário"
  previewSize="sm"
/>
```

### Imagem de Produto
```tsx
<UploadImageUniqueInput
  image={product.image}
  onChangeImage={setProductImage}
  file={productImageFile}
  onChangeFile={setProductImageFile}
  uploadButtonText="Imagem do Produto"
  alt="Imagem do produto"
  previewSize="lg"
/>
```

### Apenas JPEG
```tsx
<UploadImageUniqueInput
  file={file}
  onChangeFile={setFile}
  accept="image/jpeg"
  uploadButtonText="Apenas JPEG"
/>
```

## Integração com Formulários

### Com React Hook Form
```tsx
import { useForm, Controller } from 'react-hook-form';

const { control } = useForm();

<Controller
  name="image"
  control={control}
  render={({ field }) => (
    <UploadImageUniqueInput
      file={field.value}
      onChangeFile={field.onChange}
      uploadButtonText="Carregar Imagem"
    />
  )}
/>
```

### Com Formik
```tsx
import { useFormik } from 'formik';

const formik = useFormik({
  initialValues: { image: null },
  onSubmit: (values) => console.log(values),
});

<UploadImageUniqueInput
  file={formik.values.image}
  onChangeFile={(file) => formik.setFieldValue('image', file)}
  uploadButtonText="Carregar Imagem"
/>
```

## Notas Técnicas

- URLs de objeto são automaticamente limpas para evitar vazamentos de memória
- Validação de tipo de arquivo é feita no lado cliente
- Componente não gerencia o envio para o servidor
- Suporte completo a TypeScript
- Acessível com navegação por teclado

## Storybook

O componente possui stories completas demonstrando todos os cenários:
- Estado padrão (vazio)
- Criação de novo registro
- Edição com imagem existente
- Diferentes tamanhos de preview
- Estado desabilitado
- Tipos de arquivo específicos
- Fluxo interativo completo 