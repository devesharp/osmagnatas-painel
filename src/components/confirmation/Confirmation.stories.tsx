import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Confirmation } from "./confirmation";
import { ConfirmationProps } from "./confirmation.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Confirmation> = {
  title: "Components/Confirmation",
  component: Confirmation,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Componente de confirmação que exibe um modal para solicitar confirmação do usuário antes de executar uma ação importante.

O componente utiliza o AlertDialog do shadcn/ui e pode ser usado tanto diretamente quanto através da função global \`confirmation()\`.

### Uso da função global:
\`\`\`tsx
import { confirmation } from '@/components/confirmation';

confirmation("Excluir item", "Tem certeza que deseja excluir?", "Excluir", "Cancelar")
  .then(() => {
    console.log('Usuário confirmou');
  })
  .catch(() => {
    console.log('Usuário cancelou');
  });
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    title: {
      description: "Título do modal de confirmação",
      control: { type: "text" },
    },
    description: {
      description: "Descrição/mensagem do modal de confirmação",
      control: { type: "text" },
    },
    confirmText: {
      description: "Texto do botão de confirmação",
      control: { type: "text" },
    },
    cancelText: {
      description: "Texto do botão de cancelamento",
      control: { type: "text" },
    },
    open: {
      description: "Se o modal está aberto",
      control: { type: "boolean" },
    },
    className: {
      description: "Classe CSS personalizada para o container",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Confirmation>;

// Story padrão
export const Default: Story = {
  args: {
    open: true,
    title: "Confirmar ação",
    description: "Tem certeza que deseja continuar com esta ação?",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: () => console.log("Confirmado"),
    onCancel: () => console.log("Cancelado"),
  },
};

// Story de exclusão
export const Delete: Story = {
  args: {
    open: true,
    title: "Excluir item",
    description: "Esta ação não pode ser desfeita. Tem certeza que deseja excluir este item permanentemente?",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    onConfirm: () => console.log("Item excluído"),
    onCancel: () => console.log("Exclusão cancelada"),
  },
  parameters: {
    docs: {
      description: {
        story: "Exemplo de confirmação para ação de exclusão com texto mais específico.",
      },
    },
  },
};

// Story de logout
export const Logout: Story = {
  args: {
    open: true,
    title: "Sair da conta",
    description: "Você será desconectado da sua conta. Deseja continuar?",
    confirmText: "Sair",
    cancelText: "Ficar conectado",
    onConfirm: () => console.log("Logout realizado"),
    onCancel: () => console.log("Logout cancelado"),
  },
  parameters: {
    docs: {
      description: {
        story: "Exemplo de confirmação para logout com textos personalizados.",
      },
    },
  },
};

// Story interativa
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>
          Abrir confirmação
        </Button>
        <Confirmation
          {...args}
          open={isOpen}
          onConfirm={() => {
            console.log("Confirmado");
            setIsOpen(false);
          }}
          onCancel={() => {
            console.log("Cancelado");
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
  args: {
    title: "Confirmação interativa",
    description: "Clique no botão para abrir o modal de confirmação.",
    confirmText: "OK",
    cancelText: "Cancelar",
  },
  parameters: {
    docs: {
      description: {
        story: "Exemplo interativo onde você pode abrir e fechar o modal de confirmação.",
      },
    },
  },
}; 