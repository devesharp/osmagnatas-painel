import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { expect, userEvent, within } from 'storybook/test'
import { PhotoUpload } from './photo-upload'
import { PhotoFile, InitialPhoto } from './photo-upload.types'

// Mock de fotos iniciais para demonstração
const mockInitialPhotos: InitialPhoto[] = [
  {
    id: 'initial-1',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    name: 'paisagem-1.jpg'
  },
  {
    id: 'initial-2', 
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
    name: 'floresta.jpg'
  },
  {
    id: 'initial-3',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
    name: 'montanha.jpg'
  }
]

const meta = {
  title: 'Components/PhotoUpload',
  component: PhotoUpload,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onUpload: {
      description: 'Função chamada para upload de cada arquivo',
    },
    initialPhotos: {
      description: 'Array de fotos iniciais já existentes (para edição)',
    },
    onFileStatusChange: {
      description: 'Callback para mudanças de status dos arquivos',
    },
    onPhotosReorder: {
      description: 'Callback para reordenação de fotos via drag and drop',
    },
    onInitialPhotoRemove: {
      description: 'Callback para remoção de fotos iniciais',
    },
    maxFiles: {
      description: 'Número máximo de arquivos',
      control: { type: 'number', min: 1, max: 20 },
    },
    maxFileSize: {
      description: 'Tamanho máximo por arquivo em bytes',
      control: { type: 'number' },
    },
    acceptedFileTypes: {
      description: 'Tipos de arquivo aceitos',
    },
    disabled: {
      description: 'Se o componente está desabilitado',
    },
  },
  args: {
    onUpload: fn(),
    onFileStatusChange: fn(),
    onPhotosReorder: fn(),
    onInitialPhotoRemove: fn(),
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PhotoUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onUpload: fn(async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Upload concluído:', file.name)
    }),
  },
  name: 'Padrão (sem fotos iniciais)',
}

export const WithInitialPhotos: Story = {
  args: {
    initialPhotos: mockInitialPhotos,
    onUpload: fn(async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Upload concluído:', file.name)
    }),
    onInitialPhotoRemove: fn((photoId: string) => {
      console.log('Foto inicial removida:', photoId)
    }),
  },
  name: 'Com fotos iniciais (edição)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // Verifica se as fotos iniciais estão sendo exibidas
    const photoCards = canvas.getAllByRole('img')
    expect(photoCards).toHaveLength(3)
    
    // Verifica se o callback de remoção é chamado
    const removeButtons = canvas.getAllByRole('button', { name: /remover/i })
    if (removeButtons.length > 0) {
      await userEvent.click(removeButtons[0])
      expect(args.onInitialPhotoRemove).toHaveBeenCalledWith('initial-1')
    }
  },
}

export const LimitedFiles: Story = {
  args: {
    initialPhotos: mockInitialPhotos.slice(0, 2), // 2 fotos iniciais
    maxFiles: 3, // Limite de 3 fotos total
    onUpload: fn(async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Upload concluído:', file.name)
    }),
  },
  name: 'Limite de arquivos (com iniciais)',
}

export const JPEGOnly: Story = {
  args: {
    onUpload: fn(async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Upload concluído:', file.name)
    }),
    acceptedFileTypes: ['image/jpeg', 'image/jpg'],
  },
  name: 'Apenas JPEG',
}

export const Disabled: Story = {
  args: {
    initialPhotos: mockInitialPhotos.slice(0, 2),
    disabled: true,
    onUpload: fn(),
  },
  name: 'Desabilitado',
}

export const WithErrors: Story = {
  args: {
    onUpload: fn(async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 30% de chance de erro
      if (Math.random() < 0.3) {
        throw new Error('Erro simulado no upload')
      }
      
      console.log('Upload concluído:', file.name)
    }),
  },
  name: 'Com Erros Simulados',
}

export const SmallFileSize: Story = {
  args: {
    onUpload: fn(async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Upload concluído:', file.name)
    }),
    maxFileSize: 1024 * 1024, // 1MB
  },
  name: 'Tamanho Máximo 1MB',
}

export const WithReorderCallback: Story = {
  args: {
    onUpload: fn(async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Upload concluído:', file.name)
    }),
    onPhotosReorder: fn((photos: PhotoFile[]) => {
      console.log('Fotos reordenadas:', photos.map((p: PhotoFile) => p.file?.name || p.id))
    }),
  },
  name: 'Com Callback de Reordenação',
}

// Story com teste de interação
export const InteractionTest: Story = {
  args: {
    maxFiles: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verificar se a área de upload está visível
    const uploadArea = canvas.getByText('Adicionar fotos')
    expect(uploadArea).toBeInTheDocument()
    
    // Verificar se o texto de instrução está presente
    const instruction = canvas.getByText('Arraste e solte ou clique para selecionar')
    expect(instruction).toBeInTheDocument()
    
    // Verificar se as informações de formato estão presentes
    const formatInfo = canvas.getByText('PNG, JPG, JPEG ou WEBP (máx. 5MB cada)')
    expect(formatInfo).toBeInTheDocument()
    
    // Simular clique na área de upload
    await userEvent.click(uploadArea)
    
    // Verificar se o callback foi chamado (o input file seria aberto)
    // Note: Não podemos testar o upload real de arquivos no Storybook
    // mas podemos verificar se a interface responde corretamente
  },
}

// Story para demonstrar diferentes estados
export const DifferentStates: Story = {
  args: {
    maxFiles: 10,
  },
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Estado Padrão</h3>
        <PhotoUpload {...args} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Desabilitado</h3>
        <PhotoUpload {...args} disabled />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Com Limite Baixo</h3>
        <PhotoUpload {...args} maxFiles={2} />
      </div>
    </div>
  ),
} 