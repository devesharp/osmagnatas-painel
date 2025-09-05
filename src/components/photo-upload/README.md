# PhotoUpload Component

Componente para upload de múltiplas imagens com suporte a drag & drop, preview, reordenação e controle de estado externo.

## Características

- ✅ Upload múltiplo de imagens
- ✅ Drag & drop para adicionar arquivos
- ✅ Drag & drop para reordenar imagens
- ✅ Preview das imagens
- ✅ Controle de progresso de upload
- ✅ Tratamento de erros e retry
- ✅ Validação de tipos e tamanhos de arquivo
- ✅ **Controle de estado externo**
- ✅ Compatibilidade com código existente

## Uso Básico (Controlado - Recomendado)

```tsx
import React, { useState } from 'react';
import { PhotoUpload, PhotoFile } from '@/components/photo-upload';

function MyComponent() {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);

  const handleUpload = async (file: File): Promise<void> => {
    // Sua lógica de upload aqui
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Erro no upload');
    }
  };

  return (
    <PhotoUpload
      value={photos}
      onChangeValue={setPhotos}
      onUpload={handleUpload}
      maxFiles={10}
      maxFileSize={5 * 1024 * 1024} // 5MB
    />
  );
}
```

## Uso Tradicional (Não Controlado)

Para compatibilidade com código existente:

```tsx
import { PhotoUpload } from '@/components/photo-upload';

function MyComponent() {
  const handleUpload = async (file: File): Promise<void> => {
    // Sua lógica de upload
  };

  const handlePhotosReorder = (photos: PhotoFile[]) => {
    console.log('Fotos reordenadas:', photos);
  };

  return (
    <PhotoUpload
      onUpload={handleUpload}
      onPhotosReorder={handlePhotosReorder}
      maxFiles={10}
    />
  );
}
```

## Trabalhando com Fotos Existentes

Para adicionar fotos que já existem (ex: editando um formulário):

```tsx
const [photos, setPhotos] = useState<PhotoFile[]>([
  {
    id: 'existing-1',
    preview: 'https://example.com/photo1.jpg',
    status: 'success',
    progress: 100,
    // Não incluir 'file' para fotos já existentes
  }
]);

<PhotoUpload
  value={photos}
  onChangeValue={setPhotos}
  onUpload={handleUpload}
/>
```

## Props

### Controle de Estado

| Prop | Tipo | Descrição |
|------|------|-----------|
| `value` | `PhotoFile[]` | Array de fotos controlado externamente |
| `onChangeValue` | `(photos: PhotoFile[]) => void` | Callback para mudanças no array de fotos |

### Props Principais

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `onUpload` | `(file: File) => Promise<void>` | - | **Obrigatório.** Função para upload de cada arquivo |
| `maxFiles` | `number` | `10` | Número máximo de arquivos |
| `maxFileSize` | `number` | `5MB` | Tamanho máximo por arquivo em bytes |
| `acceptedFileTypes` | `string[]` | `['image/jpeg', 'image/jpg', 'image/png', 'image/webp']` | Tipos MIME aceitos |
| `disabled` | `boolean` | `false` | Desabilita o componente |

### Props de Callback

| Prop | Tipo | Descrição |
|------|------|-----------|
| `onFileStatusChange` | `(fileId: string, status: UploadStatus, error?: string) => void` | Notifica mudanças de status |
| `onPhotosReorder` | `(photos: PhotoFile[]) => void` | **Deprecated.** Use `onChangeValue` |

## Tipos

### PhotoFile

```tsx
interface PhotoFile {
  id: string;
  file?: File; // undefined para fotos já existentes
  preview: string; // URL para preview
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number; // 0-100
  error?: string;
}
```

### UploadStatus

```tsx
type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';
```

## Vantagens do Controle Externo

### ✅ Melhor Integração com Formulários

```tsx
// Fácil integração com react-hook-form, formik, etc.
const { control, setValue, watch } = useForm();
const photos = watch('photos');

<PhotoUpload
  value={photos}
  onChangeValue={(photos) => setValue('photos', photos)}
  onUpload={handleUpload}
/>
```

### ✅ Sincronização com Estado Global

```tsx
// Redux, Zustand, Context, etc.
const photos = useSelector(state => state.photos);
const dispatch = useDispatch();

<PhotoUpload
  value={photos}
  onChangeValue={(photos) => dispatch(setPhotos(photos))}
  onUpload={handleUpload}
/>
```

### ✅ Controle Total do Estado

```tsx
// Você pode manipular as fotos como quiser
const handleClearAll = () => setPhotos([]);
const handleRemoveErrors = () => setPhotos(photos.filter(p => p.status !== 'error'));
const getSuccessPhotos = () => photos.filter(p => p.status === 'success');
const getNewPhotos = () => photos.filter(p => p.file !== undefined);
const getExistingPhotos = () => photos.filter(p => p.file === undefined);
```

## Cenários de Uso

### Upload Simples

```tsx
const [photos, setPhotos] = useState<PhotoFile[]>([]);

<PhotoUpload
  value={photos}
  onChangeValue={setPhotos}
  onUpload={uploadToServer}
/>
```

### Edição com Fotos Existentes

```tsx
const [photos, setPhotos] = useState<PhotoFile[]>([
  // Fotos já existentes
  ...existingPhotos.map(photo => ({
    id: photo.id,
    preview: photo.url,
    status: 'success' as const,
    progress: 100,
  }))
]);

<PhotoUpload
  value={photos}
  onChangeValue={setPhotos}
  onUpload={uploadNewPhoto}
/>
```

### Integração com Formulários

```tsx
function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    photos: [] as PhotoFile[]
  });

  return (
    <form>
      <input 
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />
      
      <PhotoUpload
        value={formData.photos}
        onChangeValue={(photos) => setFormData(prev => ({ ...prev, photos }))}
        onUpload={handleUpload}
      />
    </form>
  );
}
```

## Exemplos

Veja os exemplos completos em:
- `PhotoUploadControlledExample` - Uso com controle externo
- `PhotoUploadUncontrolledExample` - Uso tradicional

```tsx
import { 
  PhotoUploadControlledExample, 
  PhotoUploadUncontrolledExample 
} from '@/components/photo-upload';
``` 