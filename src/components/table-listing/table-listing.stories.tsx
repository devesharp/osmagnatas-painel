import type { Meta, StoryObj } from "@storybook/nextjs";
import { TableListing } from "./table-listing";

const meta: Meta<typeof TableListing<typeof sampleData[0]>> = {
  title: "Components/TableListing",
  component: TableListing,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Componente de tabela responsiva com ordenação e configuração flexível de colunas.",
      },
    },
  },
  argTypes: {
    items: {
      description: "Array de itens a serem exibidos na tabela",
      control: "object",
    },
    columns: {
      description: "Configuração das colunas da tabela",
      control: "object",
    },
    loading: {
      description: "Estado de carregamento",
      control: "boolean",
    },
    striped: {
      description: "Se deve mostrar linhas zebradas",
      control: "boolean",
    },
    loadingMessage: {
      description: "Mensagem de carregamento",
      control: "text",
    },
    withSelect: {
      description: "Se deve adicionar coluna de seleção com checkbox",
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableListing>;

// Dados de exemplo
const sampleData = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    age: 30,
    status: "active",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@example.com",
    age: 25,
    status: "inactive",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@example.com",
    age: 35,
    status: "pending",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@example.com",
    age: 28,
    status: "active",
  },
];

// Configuração básica das colunas
const basicColumns = [
  { key: "id", title: "ID", sortable: true, width: "80px" },
  { key: "name", title: "Nome", sortable: true },
  { key: "email", title: "Email", sortable: true, hideOnMobile: true },
  { key: "age", title: "Idade", sortable: true, width: "100px" },
  { key: "status", title: "Status", sortable: true, width: "120px" },
];

export const Default: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    columns: basicColumns,
  },
};

export const Loading: Story = {
  args: {
    items: [],
    columns: basicColumns,
    loading: true,
    loadingMessage: "Carregando dados...",
  },
};

export const Striped: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    striped: true,
  },
};

export const WithSorting: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    defaultSort: { column: "name", direction: "asc" },
  },
};

export const WithSelection: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    withSelect: true,
    selecteds: ["1", "3"],
    onSelected: (selectedIds: (string | number)[]) => {
      console.log("Selecionados:", selectedIds);
    },
    getItemId: (item) => String((item as (typeof sampleData)[0]).id.toString()),
    striped: true,
  },
};
