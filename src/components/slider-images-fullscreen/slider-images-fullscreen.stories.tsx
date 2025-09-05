import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SliderImagesFullScreen } from "./slider-images-fullscreen";
import { SliderImage, SliderImagesFullScreenProps } from "./slider-images-fullscreen.types";
import { Button } from "@/components/ui/button";

// Imagens de exemplo
const sampleImages: SliderImage[] = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    alt: "Paisagem montanhosa",
    title: "Montanhas Majestosas",
    description: "Uma vista deslumbrante das montanhas ao nascer do sol",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop",
    alt: "Lago sereno",
    title: "Lago Cristalino",
    description: "Águas calmas refletindo o céu azul",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
    alt: "Floresta densa",
    title: "Floresta Encantada",
    description: "Caminho serpenteando através da floresta verde",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    alt: "Praia tropical",
    title: "Paraíso Tropical",
    description: "Areia branca e águas cristalinas",
  },
];

const singleImage: SliderImage[] = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    alt: "Imagem única",
    title: "Imagem Única",
    description: "Uma única imagem para demonstração",
  },
];

const meta: Meta<typeof SliderImagesFullScreen> = {
  title: "Components/SliderImagesFullScreen",
  component: SliderImagesFullScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Componente para exibir um slider de imagens em tela cheia otimizado para máximo aproveitamento da tela:

- Navegação por botões nas bordas da tela
- Navegação por teclado
- Zoom nas imagens
- Contador de imagens
- Thumbnails opcionais
- Totalmente responsivo
- Fundo preto para máximo contraste

### Navegação por Teclado
- **Setas esquerda/direita**: navegar entre imagens
- **Escape**: fechar modal
- **+/=**: aumentar zoom
- **-**: diminuir zoom
- **0**: resetar zoom
        `,
      },
    },
  },
  argTypes: {
    images: {
      description: "Array de imagens para exibir no slider",
      control: { type: "object" },
    },
    open: {
      description: "Controla se o modal está aberto",
      control: { type: "boolean" },
    },
    initialIndex: {
      description: "Índice inicial da imagem a ser exibida",
      control: { type: "number", min: 0 },
    },
    showCounter: {
      description: "Exibir contador de imagens",
      control: { type: "boolean" },
    },
    showNavigation: {
      description: "Exibir botões de navegação nas bordas",
      control: { type: "boolean" },
    },
    showThumbnails: {
      description: "Exibir thumbnails na parte inferior",
      control: { type: "boolean" },
    },
    enableKeyboardNavigation: {
      description: "Permitir navegação por teclado",
      control: { type: "boolean" },
    },
    enableZoom: {
      description: "Permitir zoom nas imagens",
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SliderImagesFullScreen>;

// Template para stories com controle de estado
const Template = (args: Partial<SliderImagesFullScreenProps>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(args.initialIndex || 0);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Abrir Slider de Imagens
      </Button>
      
      <SliderImagesFullScreen
        {...args}
        images={args.images || sampleImages}
        open={isOpen}
        onOpenChange={setIsOpen}
        initialIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
      
      <div className="mt-4 text-sm text-muted-foreground">
        Clique no botão acima para abrir o slider. Use as setas do teclado para navegar ou clique nas bordas da tela.
      </div>
    </div>
  );
};

// Story padrão
export const Default: Story = {
  render: Template,
  args: {
    images: sampleImages,
    showCounter: true,
    showNavigation: true,
    showThumbnails: false,
    enableKeyboardNavigation: true,
    enableZoom: false,
  },
};

// Story com zoom habilitado
export const WithZoom: Story = {
  render: Template,
  args: {
    images: sampleImages,
    showCounter: true,
    showNavigation: true,
    showThumbnails: false,
    enableKeyboardNavigation: true,
    enableZoom: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Slider com funcionalidade de zoom habilitada. Clique na imagem para fazer zoom ou use os botões +/-.",
      },
    },
  },
};

// Story com thumbnails
export const WithThumbnails: Story = {
  render: Template,
  args: {
    images: sampleImages,
    showCounter: true,
    showNavigation: true,
    showThumbnails: true,
    enableKeyboardNavigation: true,
    enableZoom: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Slider com thumbnails na parte inferior para navegação rápida.",
      },
    },
  },
};

// Story minimalista
export const Minimal: Story = {
  render: Template,
  args: {
    images: sampleImages,
    showCounter: false,
    showNavigation: true,
    showThumbnails: false,
    enableKeyboardNavigation: true,
    enableZoom: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Versão minimalista do slider, apenas com navegação básica nas bordas.",
      },
    },
  },
};

// Story com uma única imagem
export const SingleImage: Story = {
  render: Template,
  args: {
    images: singleImage,
    showCounter: true,
    showNavigation: true,
    showThumbnails: false,
    enableKeyboardNavigation: true,
    enableZoom: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Slider com apenas uma imagem. Os controles de navegação ficam ocultos automaticamente.",
      },
    },
  },
};

// Story com todas as funcionalidades
export const FullFeatured: Story = {
  render: Template,
  args: {
    images: sampleImages,
    showCounter: true,
    showNavigation: true,
    showThumbnails: true,
    enableKeyboardNavigation: true,
    enableZoom: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Slider com todas as funcionalidades habilitadas: contador, navegação nas bordas, thumbnails e zoom.",
      },
    },
  },
};

// Story para teste de navegação por teclado
export const KeyboardNavigation: Story = {
  render: Template,
  args: {
    images: sampleImages,
    showCounter: true,
    showNavigation: true,
    showThumbnails: false,
    enableKeyboardNavigation: true,
    enableZoom: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Teste de navegação por teclado e bordas da tela:
- **Setas esquerda/direita**: navegar entre imagens
- **Escape**: fechar modal
- **+/=**: aumentar zoom
- **-**: diminuir zoom
- **0**: resetar zoom
- **Clique nas bordas**: navegar entre imagens
        `,
      },
    },
  },
}; 