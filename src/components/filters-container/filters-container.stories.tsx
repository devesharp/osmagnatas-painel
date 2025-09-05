import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiltersContainer } from "./filters-container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const meta: Meta<typeof FiltersContainer> = {
  title: "Components/FiltersContainer",
  component: FiltersContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Componente container para filtros que se adapta entre desktop e mobile. No desktop exibe os filtros diretamente, no mobile abre um modal com botão de submit.",
      },
    },
  },
  argTypes: {
    visible: {
      control: "boolean",
      description: "Controla a visibilidade do modal no mobile",
    },
    submitButtonText: {
      control: "text",
      description: "Texto do botão de submit",
    },
    submitButtonDisabled: {
      control: "boolean",
      description: "Indica se o botão de submit deve estar desabilitado",
    },
    title: {
      control: "text",
      description: "Título do modal no mobile",
    },
    onRequestClose: {
      description: "Função chamada quando o usuário solicita fechar o modal",
      action: "requestClose",
    },
    onSubmit: {
      description: "Função chamada quando o usuário clica no botão de submit",
      action: "submit",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FiltersContainer>;

// Componente de exemplo para os filtros
const SampleFilters = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>

    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input id="search" placeholder="Digite sua busca..." />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="category">Categoria</Label>
      <Select options={[{ value: "electronics", label: "Eletrônicos" }, { value: "clothing", label: "Roupas" }, { value: "books", label: "Livros" }, { value: "home", label: "Casa e Jardim" }]} />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="price-min">Preço Mínimo</Label>
      <Input id="price-min" type="number" placeholder="R$ 0,00" />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="price-max">Preço Máximo</Label>
      <Input id="price-max" type="number" placeholder="R$ 1000,00" />
    </div>
  </div>
);

export const Desktop: Story = {
  args: {
    children: <SampleFilters />,
    title: "Filtros de Produtos",
    submitButtonText: "Aplicar Filtros",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const MobileVisible: Story = {
  args: {
    visible: true,
    children: <SampleFilters />,
    title: "Filtros de Produtos",
    submitButtonText: "Aplicar Filtros",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const MobileHidden: Story = {
  args: {
    visible: false,
    children: <SampleFilters />,
    title: "Filtros de Produtos",
    submitButtonText: "Aplicar Filtros",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const WithCustomTitle: Story = {
  args: {
    visible: true,
    children: <SampleFilters />,
    title: "Filtros Avançados",
    submitButtonText: "Buscar Produtos",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const WithDisabledSubmit: Story = {
  args: {
    visible: true,
    children: <SampleFilters />,
    title: "Filtros de Produtos",
    submitButtonText: "Aplicar Filtros",
    submitButtonDisabled: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const WithoutSubmitButton: Story = {
  args: {
    visible: true,
    children: <SampleFilters />,
    title: "Filtros de Produtos",
    // Sem onSubmit para não mostrar o botão
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}; 