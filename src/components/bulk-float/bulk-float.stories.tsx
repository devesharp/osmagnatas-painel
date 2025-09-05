import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test';
import { expect, userEvent, within } from '@storybook/test'
import { Edit, Trash2, Download, Share, Copy, Archive } from 'lucide-react'
import { BulkFloat } from './bulk-float'
import { BulkFloatAction } from './bulk-float.types'

const meta: Meta<typeof BulkFloat> = {
  title: 'Components/BulkFloat',
  component: BulkFloat,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente flutuante que aparece quando itens são selecionados, oferecendo ações em lote. É responsivo, mostrando apenas ícones com tooltips quando ocupa mais de 90% da largura da tela.',
      },
    },
  },
  argTypes: {
    itemsSelected: {
      description: 'Número de itens selecionados',
      control: { type: 'number', min: 0 },
    },
    onClearSelect: {
      description: 'Função para limpar a seleção',
      action: 'cleared',
    },
    actions: {
      description: 'Array de ações disponíveis',
      control: { type: 'object' },
    },
    className: {
      description: 'Classe CSS adicional',
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof BulkFloat>

// Ações de exemplo
const defaultActions: BulkFloatAction[] = [
  {
    icon: <Edit className="h-4 w-4" />,
    title: 'Editar',
    onClick: fn(),
  },
  {
    icon: <Trash2 className="h-4 w-4" />,
    title: 'Excluir',
    onClick: fn(),
  },
  {
    icon: <Download className="h-4 w-4" />,
    title: 'Baixar',
    onClick: fn(),
  },
]

const manyActions: BulkFloatAction[] = [
  {
    icon: <Edit className="h-4 w-4" />,
    title: 'Editar Selecionados',
    onClick: fn(),
  },
  {
    icon: <Trash2 className="h-4 w-4" />,
    title: 'Excluir Selecionados',
    onClick: fn(),
  },
  {
    icon: <Download className="h-4 w-4" />,
    title: 'Baixar Arquivos',
    onClick: fn(),
  },
  {
    icon: <Share className="h-4 w-4" />,
    title: 'Compartilhar',
    onClick: fn(),
  },
  {
    icon: <Copy className="h-4 w-4" />,
    title: 'Copiar Links',
    onClick: fn(),
  },
  {
    icon: <Archive className="h-4 w-4" />,
    title: 'Arquivar Itens',
    onClick: fn(),
  },
]

export const Default: Story = {
  args: {
    itemsSelected: 3,
    onClearSelect: fn(),
    actions: defaultActions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verificar se o componente está visível
    const bulkFloat = canvas.getByText('3 itens selecionados')
    expect(bulkFloat).toBeInTheDocument()
    
    // Verificar se as ações estão presentes
    expect(canvas.getByText('Editar')).toBeInTheDocument()
    expect(canvas.getByText('Excluir')).toBeInTheDocument()
    expect(canvas.getByText('Baixar')).toBeInTheDocument()
  },
}

export const SingleItem: Story = {
  args: {
    itemsSelected: 1,
    onClearSelect: fn(),
    actions: defaultActions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verificar singular
    const bulkFloat = canvas.getByText('1 item selecionado')
    expect(bulkFloat).toBeInTheDocument()
  },
}

export const ManyActions: Story = {
  args: {
    itemsSelected: 5,
    onClearSelect: fn(),
    actions: manyActions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo com muitas ações que pode ativar o modo responsivo quando o componente ocupar mais de 90% da largura da tela.',
      },
    },
  },
}

export const WithoutIcons: Story = {
  args: {
    itemsSelected: 2,
    onClearSelect: fn(),
    actions: [
      {
        title: 'Ação sem ícone',
        onClick: fn(),
      },
      {
        title: 'Outra ação',
        onClick: fn(),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo com ações que não possuem ícones.',
      },
    },
  },
}

export const NoItemsSelected: Story = {
  args: {
    itemsSelected: 0,
    onClearSelect: fn(),
    actions: defaultActions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quando não há itens selecionados, o componente não é renderizado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verificar se o componente não está presente
    expect(canvas.queryByText(/item/)).not.toBeInTheDocument()
  },
}

export const InteractionTest: Story = {
  args: {
    itemsSelected: 3,
    onClearSelect: fn(),
    actions: defaultActions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Testar clique nas ações
    const editButton = canvas.getByText('Editar')
    await userEvent.click(editButton)
    
    const deleteButton = canvas.getByText('Excluir')
    await userEvent.click(deleteButton)
    
    // Testar botão de limpar seleção
    const clearButton = canvas.getByRole('button', { name: /limpar seleção/i })
    await userEvent.click(clearButton)
  },
}

export const CustomClassName: Story = {
  args: {
    itemsSelected: 3,
    onClearSelect: fn(),
    actions: defaultActions,
    className: 'border-2 border-red-500',
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo com className customizada para estilização adicional.',
      },
    },
  },
} 