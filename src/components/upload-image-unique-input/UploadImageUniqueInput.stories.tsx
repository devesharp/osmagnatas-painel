import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { UploadImageUniqueInput } from './upload-image-unique-input';
import { UploadImageUniqueInputProps } from './upload-image-unique-input.types';
import { UploadImageUniqueInputExample } from './upload-image-unique-input.example';

const meta: Meta<typeof UploadImageUniqueInput> = {
  title: 'Components/UploadImageUniqueInput',
  component: UploadImageUniqueInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente para upload de uma única imagem com preview. Suporta imagens existentes (URL) e arquivos novos para diferentes fluxos de criação e edição.',
      },
    },
  },
  argTypes: {
    image: {
      description: 'URL da imagem existente (string)',
      control: { type: 'text' },
    },
    onChangeImage: {
      description: 'Função chamada quando a imagem é alterada',
      control: false,
    },
    file: {
      description: 'Arquivo de imagem carregado (novo)',
      control: false,
    },
    onChangeFile: {
      description: 'Função chamada quando o arquivo é alterado',
      control: false,
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
    alt: {
      description: 'Texto alternativo para a imagem',
      control: { type: 'text' },
    },
    previewSize: {
      description: 'Tamanho do preview da imagem',
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    className: {
      description: 'Classe CSS adicional',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UploadImageUniqueInput>;

// Componente wrapper para controlar o estado
function UploadImageUniqueInputWrapper(props: UploadImageUniqueInputProps) {
  const [image, setImage] = useState<string | null>(props.image || null);
  const [file, setFile] = useState<File | null>(props.file || null);

  return (
    <div className="w-[400px] p-4">
      <UploadImageUniqueInput
        {...props}
        image={image || undefined}
        onChangeImage={setImage}
        file={file}
        onChangeFile={setFile}
      />
      
      {/* Debug info */}
      <div className="mt-4 p-2 bg-muted rounded text-xs">
        <p><strong>Estado:</strong></p>
        <p>Image URL: {image || 'null'}</p>
        <p>File: {file ? file.name : 'null'}</p>
      </div>
    </div>
  );
}

// Story padrão - componente vazio
export const Default: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {},
};

// Story para criação de novo registro
export const NewRecord: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    uploadButtonText: 'Carregar Imagem',
    alt: 'Nova imagem do produto',
    previewSize: 'md',
  },
};

// Story para edição com imagem existente
export const ExistingImage: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    image: 'https://picsum.photos/300/300?random=1',
    uploadButtonText: 'Alterar Imagem',
    alt: 'Imagem do produto',
    previewSize: 'md',
  },
};

// Story com diferentes tamanhos
export const SmallPreview: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    image: 'https://picsum.photos/300/300?random=2',
    previewSize: 'sm',
    uploadButtonText: 'Trocar Foto',
  },
};

export const LargePreview: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    image: 'https://picsum.photos/300/300?random=3',
    previewSize: 'lg',
    uploadButtonText: 'Alterar Imagem',
  },
};

// Story com componente desabilitado
export const Disabled: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    image: 'https://picsum.photos/300/300?random=4',
    disabled: true,
    uploadButtonText: 'Upload Desabilitado',
  },
};

// Story com tipos específicos de arquivo
export const JPEGOnly: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    accept: 'image/jpeg',
    uploadButtonText: 'Apenas JPEG',
  },
};

// Story com texto customizado
export const CustomText: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    uploadButtonText: 'Selecionar Avatar',
    alt: 'Avatar do usuário',
    previewSize: 'md',
  },
};

// Story interativa para demonstrar o fluxo completo
export const InteractiveFlow: Story = {
  render: (args) => {
    const [image, setImage] = useState<string | null>('https://picsum.photos/300/300?random=5');
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState(1);

    const resetToStep1 = () => {
      setImage('https://picsum.photos/300/300?random=5');
      setFile(null);
      setStep(1);
    };

    const resetToStep2 = () => {
      setImage(null);
      setFile(null);
      setStep(2);
    };

    return (
      <div className="w-[500px] p-4 space-y-4">
        <div className="flex gap-2">
          <button 
            onClick={resetToStep1}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Simular Edição
          </button>
          <button 
            onClick={resetToStep2}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Simular Criação
          </button>
        </div>
        
        <div className="p-3 bg-muted rounded">
          <p className="text-sm font-medium">
            {step === 1 ? 'Cenário: Editando registro existente' : 'Cenário: Criando novo registro'}
          </p>
        </div>

        <UploadImageUniqueInput
          {...args}
          image={image || undefined}
          onChangeImage={setImage}
          file={file}
          onChangeFile={setFile}
          uploadButtonText={step === 1 ? 'Alterar Imagem' : 'Carregar Imagem'}
        />
        
        {/* Debug info */}
        <div className="p-2 bg-muted rounded text-xs">
          <p><strong>Estado atual:</strong></p>
          <p>Image URL: {image || 'null'}</p>
          <p>File: {file ? file.name : 'null'}</p>
        </div>
      </div>
    );
  },
  args: {
    previewSize: 'md',
    alt: 'Imagem do produto',
  },
};

// Story com testes de interação
export const WithInteractions: Story = {
  render: (args) => <UploadImageUniqueInputWrapper {...args} />,
  args: {
    image: 'https://picsum.photos/300/300?random=6',
    uploadButtonText: 'Alterar Imagem',
    previewSize: 'md',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = canvasElement;
    
    await step('Verificar se o botão de upload está presente', async () => {
      const uploadButton = canvas.querySelector('button');
      if (!uploadButton) {
        throw new Error('Botão de upload não encontrado');
      }
    });

    await step('Verificar se a imagem está sendo exibida', async () => {
      const image = canvas.querySelector('img');
      if (!image) {
        throw new Error('Imagem não encontrada');
      }
    });

    await step('Verificar se o botão de remover está presente', async () => {
      const removeButton = canvas.querySelector('button:has(svg)');
      if (!removeButton) {
        throw new Error('Botão de remover não encontrado');
      }
    });
  },
};

// Story com exemplo prático completo
export const PracticalExample: Story = {
  render: () => <UploadImageUniqueInputExample />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Exemplo prático completo demonstrando todos os cenários de uso do componente em uma interface real.',
      },
    },
  },
}; 