import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { UploadImagesInput } from './upload-images-input';
import { UploadImagesInputProps, ExistingImage } from './upload-images-input.types';

const meta: Meta<typeof UploadImagesInput> = {
  title: 'Components/UploadImagesInput',
  component: UploadImagesInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente para upload de múltiplas imagens com preview e controle de valor. Suporta imagens existentes e novas com controles separados.',
      },
    },
  },
  argTypes: {
    value: {
      description: 'Array de arquivos de imagem carregados (novos)',
      control: false,
    },
    onChange: {
      description: 'Função chamada quando o valor das imagens novas é alterado',
      control: false,
    },
    valueExistingImages: {
      description: 'Array de imagens existentes com URLs',
      control: false,
    },
    onChangeExistingImages: {
      description: 'Função chamada quando imagens existentes são alteradas',
      control: false,
    },
    maxImages: {
      description: 'Número máximo de imagens permitidas (incluindo existentes)',
      control: { type: 'number', min: 1, max: 20 },
    },
    accept: {
      description: 'Tipos de arquivo aceitos',
      control: { type: 'text' },
    },
    disabled: {
      description: 'Se o componente está desabilitado',
      control: { type: 'boolean' },
    },
    uploadButtonText: {
      description: 'Texto do botão de upload',
      control: { type: 'text' },
    },
    className: {
      description: 'Classe CSS adicional',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UploadImagesInput>;

// Componente wrapper para controlar o estado
function UploadImagesInputWrapper(props: UploadImagesInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(props.valueExistingImages || []);

  return (
    <div className="w-[600px] p-4">
      <UploadImagesInput
        {...props}
        value={files}
        onChange={setFiles}
        valueExistingImages={existingImages}
        onChangeExistingImages={setExistingImages}
      />
    </div>
  );
}

// Imagens de exemplo para demonstração
const mockExistingImages: ExistingImage[] = [
  {
    id: 1,
    image: 'https://picsum.photos/300/300?random=1',
    name: 'imagem-1.jpg',
  },
  {
    id: 2,
    image: 'https://picsum.photos/300/300?random=2',
    name: 'imagem-2.jpg',
  },
];

export const Default: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {},
};

export const WithExistingImages: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {
    valueExistingImages: mockExistingImages,
    maxImages: 6,
    uploadButtonText: 'Adicionar Mais Imagens',
  },
};

export const WithMaxImages: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {
    maxImages: 3,
    uploadButtonText: 'Adicionar Fotos (máx. 3)',
  },
};

export const WithExistingAndMaxReached: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {
    valueExistingImages: mockExistingImages,
    maxImages: 2,
    uploadButtonText: 'Limite Atingido',
  },
};

export const Disabled: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {
    disabled: true,
    valueExistingImages: mockExistingImages,
    uploadButtonText: 'Upload Desabilitado',
  },
};

export const CustomAccept: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {
    accept: 'image/jpeg,image/png',
    uploadButtonText: 'Apenas JPG e PNG',
  },
};

export const WithCustomText: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {
    uploadButtonText: 'Selecionar Imagens',
    maxImages: 5,
  },
};

// Story com interação para demonstrar funcionalidade
export const Interactive: Story = {
  render: (args) => <UploadImagesInputWrapper {...args} />,
  args: {
    valueExistingImages: mockExistingImages,
    maxImages: 6,
    uploadButtonText: 'Carregar Imagens',
  },
  play: async ({ canvasElement, step }) => {
    // Testes de interação podem ser adicionados aqui
    const canvas = canvasElement;
    const uploadButton = canvas.querySelector('button');
    
    await step('Verificar se o botão de upload está presente', async () => {
      if (!uploadButton) {
        throw new Error('Botão de upload não encontrado');
      }
    });

    await step('Verificar se as imagens existentes estão sendo exibidas', async () => {
      const existingImages = canvas.querySelectorAll('[data-testid="existing-image"]');
      // Note: seria necessário adicionar data-testid no componente para este teste funcionar
    });
  },
}; 