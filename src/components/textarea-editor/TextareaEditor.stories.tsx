import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { TextareaEditor, defaultInitialValue } from "./index";

const meta: Meta<typeof TextareaEditor> = {
  title: "Components/TextareaEditor",
  component: TextareaEditor,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Um editor de texto rico baseado no Lexical com funcionalidades avançadas de formatação.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Classe CSS personalizada para o container",
    },
    placeholder: {
      control: "text",
      description: "Placeholder para o editor quando vazio",
    },
    disabled: {
      control: "boolean",
      description: "Se o editor está desabilitado",
    },
    autoFocus: {
      control: "boolean",
      description: "Se o editor deve ter foco inicial",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story padrão
export const Default: Story = {
  args: {
    placeholder: "Digite aqui...",
  },
};

// Story com valor inicial customizado
export const WithCustomInitialValue: Story = {
  args: {
    initialValue: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "Este é um texto inicial customizado para demonstrar o editor.",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    } as unknown as SerializedEditorState,
    placeholder: "Digite seu conteúdo aqui...",
  },
};

// Story controlado externamente
export const Controlled: Story = {
  render: (args) => {
    const [editorState, setEditorState] = useState<SerializedEditorState>(defaultInitialValue);
    
    return (
      <div className="w-full max-w-2xl space-y-4">
        <TextareaEditor
          {...args}
          editorSerializedState={editorState}
          onSerializedChange={setEditorState}
        />
        <div className="text-sm text-gray-600">
          <strong>Estado atual:</strong>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
            {JSON.stringify(editorState, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
  args: {
    placeholder: "Editor controlado - o estado é gerenciado externamente",
  },
};

// Story desabilitado
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Este editor está desabilitado",
  },
};

// Story com foco automático
export const AutoFocus: Story = {
  args: {
    autoFocus: true,
    placeholder: "Este editor recebe foco automaticamente",
  },
};

// Story com classe personalizada
export const WithCustomStyling: Story = {
  args: {
    className: "border-2 border-blue-500 rounded-lg p-4 bg-blue-50",
    placeholder: "Editor com estilo personalizado",
  },
}; 