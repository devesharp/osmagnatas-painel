import type { Meta, StoryObj } from "@storybook/nextjs";
import React, { useState } from 'react';
import { FileUploadImage } from "./file-upload-image";
import { FileUploadImageProps, ImageUpload } from "./file-upload-image.types";

const meta: Meta<typeof FileUploadImage> = {
  title: "Components/FileUploadImage",
  component: FileUploadImage,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Componente para upload de imagens com drag and drop, preview e controle de status.
        `,
      },
    },
  },
  argTypes: {
    images: {
      description: 'Array de imagens com seus respectivos status',
      control: false,
    },
    onChange: {
      description: 'Função chamada quando há mudanças nas imagens',
      action: 'onChange',
    },
    onUpload: {
      description: 'Função para fazer upload de uma imagem individual',
      action: 'onUpload',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUploadImage>;

// Função mock para simular upload com progresso
const mockUpload = async (file: File, imageId: string, onProgress?: (progress: number) => void): Promise<Partial<ImageUpload>> => {
  // Simula progresso do upload
  let progress = 0;
  while (progress < 100) {
    await new Promise(resolve => setTimeout(resolve, 500 * Math.random()));
    progress += Math.random() * 10;
    if (progress > 100) {
      progress = 100;
      onProgress?.(progress);
      break;
    }
    onProgress?.(progress);
  }
  
  // Simula falha aleatória (30% de chance)
  // if (Math.random() < 0.3) {
  //   throw new Error('Falha no upload');
  // }
  return {
    id: imageId,
    file,
    preview: 'https://picsum.photos/300/300?random=1',
    status: 'success',
    progress: 100,
    external_id: imageId,
  };
};

// Função mock que sempre falha para testar erro
const mockUploadAlwaysFails = async (file: File, imageId: string, onProgress?: (progress: number) => void): Promise<Partial<ImageUpload>> => {
  // Simula progresso do upload
  for (let progress = 0; progress <= 80; progress += 20) {
    await new Promise(resolve => setTimeout(resolve, 300));
    onProgress?.(progress);
  }
  return {
    id: imageId,
    file,
    preview: 'https://picsum.photos/300/300?random=1',
    status: 'error',
    progress: 0,
    error: 'Erro de conexão com o servidor',
    external_id: imageId,
  };
};

// Função mock que sempre sucede para testar retry
const mockUploadAlwaysSucceeds = async (file: File, imageId: string, onProgress?: (progress: number) => void): Promise<Partial<ImageUpload>> => {
  // Simula progresso do upload
  for (let progress = 0; progress <= 100; progress += 20) {
    await new Promise(resolve => setTimeout(resolve, 150));
    onProgress?.(progress);
  }
  // Sempre sucede
  return {
    id: imageId,
    file,
    preview: 'https://picsum.photos/300/300?random=1',
    status: 'success',
    progress: 100,
    external_id: imageId,
  };
};

// Componente wrapper para controlar estado
function FileUploadImageWrapper(args: FileUploadImageProps) {
  const [images, setImages] = useState<ImageUpload[]>(args.images || []);

  return (
    <FileUploadImage
      {...args}
      images={images}
      onChange={(newImages) => {
        setImages(newImages);
        args.onChange?.(newImages);
      }}
      onUpload={args.onUpload || mockUpload}
    />
  );
}

// Story padrão
export const Default: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [],
  },
};

export const WithImages: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [
      {
        id: '1',
        file: new File([''], 'image1.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=1',
        status: 'pending',
        progress: 0,
        external_id: '1',
      },
      {
        id: '2',
        file: new File([''], 'image2.png', { type: 'image/png' }),
        preview: 'https://picsum.photos/300/300?random=2',
        status: 'success',
        progress: 100,
        external_id: '2',
      },
      {
        id: '3',
        file: new File([''], 'image3.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=3',
        status: 'error',
        progress: 0,
        error: 'Falha no upload',
        external_id: '3',
      },
      {
        id: '4',
        file: new File([''], 'image3.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=4',
        status: 'uploading',
        progress: 50,
        external_id: '4',
      },
    ],
    onUpload: mockUpload,
  },
};

export const WithUploadFunction: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [
      {
        id: '1',
        file: new File([''], 'image1.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=1',
        status: 'pending',
        progress: 0,
        external_id: '1',
      },
      {
        id: '2',
        file: new File([''], 'image2.png', { type: 'image/png' }),
        preview: 'https://picsum.photos/300/300?random=2',
        status: 'pending',
        progress: 0,
        external_id: '2',
      },
    ],
    onUpload: mockUpload,
  },
};

export const UploadInProgress: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [
      {
        id: '1',
        file: new File([''], 'image1.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=1',
        status: 'uploading',
        progress: 45,
        external_id: '1',
      },
      {
        id: '2',
        file: new File([''], 'image2.png', { type: 'image/png' }),
        preview: 'https://picsum.photos/300/300?random=2',
        status: 'uploading',
        progress: 78,
        external_id: '2',
      },
    ],
  },
};

export const WithErrors: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [
      {
        id: '1',
        file: new File([''], 'image1.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=1',
        status: 'error',
        progress: 0,
        error: 'Erro de conexão com o servidor',
        external_id: '1',
      },
      {
        id: '2',
        file: new File([''], 'image2.png', { type: 'image/png' }),
        preview: 'https://picsum.photos/300/300?random=2',
        status: 'error',
        progress: 0,
        error: 'Arquivo muito grande',
        external_id: '2',
      },
      {
        id: '3',
        file: new File([''], 'image3.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=3',
        status: 'success',
        progress: 100,
        external_id: '3',
      },
    ],
    onUpload: mockUploadAlwaysSucceeds, // Para testar o retry com sucesso
  },
};

export const AlwaysFailsUpload: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [
      {
        id: '1',
        file: new File([''], 'image1.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=1',
        status: 'pending',
        progress: 0,
        external_id: '1',
      },
      {
        id: '2',
        file: new File([''], 'image2.png', { type: 'image/png' }),
        preview: 'https://picsum.photos/300/300?random=2',
        status: 'pending',
        progress: 0,
        external_id: '2',
      },
    ],
    onUpload: mockUploadAlwaysFails, // Para testar uploads que sempre falham
  },
};

export const MixedStates: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [
      {
        id: '1',
        file: new File([''], 'image1.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=1',
        status: 'pending',
        progress: 0,
        external_id: '1',
      },
      {
        id: '2',
        file: new File([''], 'image2.png', { type: 'image/png' }),
        preview: 'https://picsum.photos/300/300?random=2',
        status: 'uploading',
        progress: 65,
        external_id: '2',
      },
      {
        id: '3',
        file: new File([''], 'image3.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=3',
        status: 'success',
        progress: 100,
        external_id: '3',
      },
      {
        id: '4',
        file: new File([''], 'image4.jpg', { type: 'image/jpeg' }),
        preview: 'https://picsum.photos/300/300?random=4',
        status: 'error',
        progress: 0,
        error: 'Falha na autenticação',
        external_id: '4',
      },
    ],
    onUpload: mockUpload,
  },
};

// Story com interações para testes
export const Interactive: Story = {
  render: (args) => <FileUploadImageWrapper {...args} />,
  args: {
    images: [],
    onUpload: mockUpload,
  },
  play: async ({ canvasElement, args }) => {
    console.log('Componente renderizado para testes interativos');
  },
}; 