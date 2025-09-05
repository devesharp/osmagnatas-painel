import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { PhotoCard } from './photo-upload--card'
import { PhotoFile } from '../photo-upload.types'

// Função para criar um mock File
const createMockFile = (name: string = 'exemplo.jpg'): File => {
  return new File([''], name, { type: 'image/jpeg' })
}

// Função para criar um mock PhotoFile
const createMockPhoto = (status: PhotoFile['status'], name: string = 'exemplo.jpg'): PhotoFile => ({
  id: Math.random().toString(36).substr(2, 9),
  file: createMockFile(name),
  preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
  status,
  progress: status === 'uploading' ? 65 : status === 'success' ? 100 : 0,
  error: status === 'error' ? 'Erro no upload do arquivo' : undefined
})

// Função para criar um mock PhotoFile inicial (sem objeto File)
const createMockInitialPhoto = (): PhotoFile => ({
  id: Math.random().toString(36).substr(2, 9),
  file: undefined, // Fotos iniciais não têm objeto File
  preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
  status: 'success',
  progress: 100,
  isInitial: true
})

const meta = {
  title: 'Components/PhotoUpload/PhotoCard',
  component: PhotoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    photo: {
      description: 'Objeto com informações da foto',
    },
    onRemove: {
      description: 'Callback chamado quando o usuário remove a foto',
    },
    onRetry: {
      description: 'Callback chamado quando o usuário tenta reenviar a foto',
    },
    canDrag: {
      description: 'Se a foto pode ser arrastada (apenas success)',
    },
    isDragging: {
      description: 'Se a foto está sendo arrastada atualmente',
    },
    isDragOver: {
      description: 'Se há uma foto sendo arrastada sobre esta',
    },
  },
  args: {
    onRemove: fn(),
    onRetry: fn(),
    onDragStart: fn(),
    onDragEnd: fn(),
    onDragOver: fn(),
    onDragLeave: fn(),
    onDrop: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PhotoCard>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  args: {
    photo: createMockPhoto('pending', 'foto-pendente.jpg'),
  },
}

export const Uploading: Story = {
  args: {
    photo: createMockPhoto('uploading', 'foto-enviando.jpg'),
  },
}

export const Success: Story = {
  args: {
    photo: createMockPhoto('success', 'foto-sucesso.jpg'),
    canDrag: true,
  },
}

export const InitialPhoto: Story = {
  args: {
    photo: createMockInitialPhoto(),
    canDrag: true,
  },
  name: 'Foto Inicial (Existente)',
}

export const Error: Story = {
  args: {
    photo: createMockPhoto('error', 'foto-erro.jpg'),
  },
}

export const Dragging: Story = {
  args: {
    photo: createMockPhoto('success', 'foto-arrastando.jpg'),
    canDrag: true,
    isDragging: true,
  },
}

export const DragOver: Story = {
  args: {
    photo: createMockPhoto('success', 'foto-hover.jpg'),
    canDrag: true,
    isDragOver: true,
  },
}

// Story para demonstrar diferentes estados lado a lado
export const AllStates: Story = {
  args: {
    photo: createMockPhoto('pending'), // Valor padrão, será sobrescrito no render
  },
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 w-96">
      <div>
        <h4 className="text-sm font-medium mb-2">Pendente</h4>
        <PhotoCard {...args} photo={createMockPhoto('pending')} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Enviando</h4>
        <PhotoCard {...args} photo={createMockPhoto('uploading')} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Sucesso</h4>
        <PhotoCard {...args} photo={createMockPhoto('success')} canDrag={true} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Erro</h4>
        <PhotoCard {...args} photo={createMockPhoto('error')} />
      </div>
    </div>
  ),
}

// Story para demonstrar estados de drag and drop
export const DragStates: Story = {
  args: {
    photo: createMockPhoto('success'),
  },
  render: (args) => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
      <div>
        <h4 className="text-sm font-medium mb-2">Draggable</h4>
        <PhotoCard {...args} photo={createMockPhoto('success')} canDrag={true} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Being Dragged</h4>
        <PhotoCard {...args} photo={createMockPhoto('success')} canDrag={true} isDragging={true} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Drag Over</h4>
        <PhotoCard {...args} photo={createMockPhoto('success')} canDrag={true} isDragOver={true} />
      </div>
    </div>
  ),
  name: 'Drag and Drop States',
}

export const LongFileName: Story = {
  args: {
    photo: createMockPhoto('success', 'nome-de-arquivo-muito-longo-que-precisa-ser-truncado.jpg'),
    canDrag: true,
  },
}

export const LargeFile: Story = {
  args: {
    photo: {
      ...createMockPhoto('success', 'arquivo-grande.jpg'),
      file: createMockFile('arquivo-grande.jpg'),
    },
    canDrag: true,
  },
} 