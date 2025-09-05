import type { Meta, StoryObj } from "@storybook/nextjs";
import { AppSidebarUser } from "./app-sidebar--user";
import { SidebarProvider } from "@/components/ui/sidebar";

const meta: Meta<typeof AppSidebarUser> = {
  title: "Components/AppSidebar/AppSidebarUser",
  component: AppSidebarUser,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Componente de usuário do sidebar com dropdown de configurações de tema e contraste.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 border rounded-lg">
        <SidebarProvider>
          <div className="bg-sidebar">
            <Story />
          </div>
        </SidebarProvider>
      </div>
    ),
  ],
  argTypes: {
    user: {
      description: "Dados do usuário",
      control: "object",
    },
    onUserClick: {
      description: "Função chamada quando o usuário clica no perfil",
      action: "userClicked",
    },
    onLogout: {
      description: "Função chamada quando o usuário quer sair",
      action: "logout",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  name: "João Silva",
  email: "joao.silva@empresa.com",
  avatar: "https://github.com/shadcn.png",
};

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const WithoutAvatar: Story = {
  args: {
    user: {
      name: "Maria Santos",
      email: "maria.santos@empresa.com",
    },
  },
};

export const LongName: Story = {
  args: {
    user: {
      name: "Ana Carolina de Oliveira Silva",
      email: "ana.carolina.oliveira@empresa.com.br",
      avatar: "https://github.com/shadcn.png",
    },
  },
}; 