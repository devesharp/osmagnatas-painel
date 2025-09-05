import type { Meta, StoryObj } from "@storybook/nextjs";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const meta: Meta<typeof AppSidebar> = {
  title: "Components/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Componente de sidebar da aplicação com menu de navegação, logo e informações do usuário.",
      },
    },
  },
  decorators: [
    (Story, { args }) => (
      <div className="flex h-screen">
        <SidebarProvider
          defaultOpen={
            args.defaultCollapsed !== undefined ? !args.defaultCollapsed : true
          }
          open={args.collapsed !== undefined ? !args.collapsed : undefined}
          onOpenChange={
            args.onCollapsedChange
              ? (open) => args.onCollapsedChange?.(!open)
              : undefined
          }
        >
          <Story />
        </SidebarProvider>
      </div>
    ),
  ],
  argTypes: {
    user: {
      description: "Dados do usuário logado",
      control: "object",
    },

    currentPath: {
      description: "Pathname atual para destacar item ativo",
      control: "text",
    },
    defaultCollapsed: {
      description: "Estado inicial do collapse",
      control: "boolean",
    },
    collapsed: {
      description: "Controle externo do estado de collapse",
      control: "boolean",
    },
    onMenuItemClick: {
      description: "Função chamada quando um item do menu é clicado",
      action: "menuItemClicked",
    },
    onUserClick: {
      description: "Função chamada quando o usuário clica no perfil",
      action: "userClicked",
    },
    onCollapsedChange: {
      description: "Função chamada quando o estado de collapse muda",
      action: "collapsedChanged",
    },
    onLogout: {
      description: "Função chamada quando o usuário quer sair",
      action: "logout",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

// Dados de exemplo para as stories
const mockUser = {
  name: "João Silva",
  email: "joao.silva@imobiliaria.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
};

const mockUserWithoutAvatar = {
  name: "Maria Santos",
  email: "maria.santos@imobiliaria.com",
};

const mockUserWithLongName = {
  name: "Ana Beatriz Oliveira dos Santos Silva",
  email: "ana.beatriz.oliveira@imobiliaria.com.br",
  avatar:
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
};

export const Default: Story = {
  args: {
    user: mockUser,
    currentPath: "/",
  },
};

export const WithCustomLogo: Story = {
  args: {
    user: mockUser,
    currentPath: "/properties/listing",
  },
};

export const UserWithoutAvatar: Story = {
  args: {
    user: mockUserWithoutAvatar,
  },
};

export const UserWithLongName: Story = {
  args: {
    user: mockUserWithLongName,
  },
};

export const ActiveMenuItems: Story = {
  args: {
    user: mockUser,
  },
};

export const WebsiteSection: Story = {
  args: {
    user: mockUser,
  },
};

export const ConfigurationSection: Story = {
  args: {
    user: mockUser,
  },
};

export const DefaultCollapsed: Story = {
  args: {
    user: mockUser,
    defaultCollapsed: true,
  },
};

export const ControlledCollapsed: Story = {
  args: {
    user: mockUser,
    collapsed: true,
  },
};

export const CollapsedWithActiveItem: Story = {
  args: {
    user: mockUser,
    defaultCollapsed: true,
  },
};

export const DarkTheme: Story = {
  args: {
    user: mockUser,
  },
};
