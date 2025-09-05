import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { InputColor } from "./input-color";

const meta: Meta<typeof InputColor> = {
  title: "UI/InputColor",
  component: InputColor,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Componente de entrada de cor que combina um seletor visual (react-colorful) com um campo de texto para entrada manual de códigos hexadecimais."
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Título/label do campo",
    },
    placeholder: {
      control: "text",
      description: "Placeholder do input",
    },
    disabled: {
      control: "boolean",
      description: "Se o componente está desabilitado",
    },
    value: {
      control: "text",
      description: "Valor da cor (sem #)",
    },
    onValueChange: {
      action: "onValueChange",
      description: "Callback chamado quando o valor muda",
    },
    onChange: {
      action: "onChange", 
      description: "Callback onChange tradicional",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story básica
export const Default: Story = {
  args: {
    title: "Escolha uma cor",
    placeholder: "000000",
  },
};

// Story com valor inicial
export const WithInitialValue: Story = {
  args: {
    title: "Cor Principal",
    value: "ff0000",
    placeholder: "000000",
  },
};

// Story desabilitada
export const Disabled: Story = {
  args: {
    title: "Cor Desabilitada",
    value: "00ff00",
    disabled: true,
  },
};

// Story controlada
export const Controlled: Story = {
  render: (args) => {
    const [color, setColor] = useState("3366cc");
    
    return (
      <div className="space-y-4">
        <InputColor
          {...args}
          value={color}
          onValueChange={setColor}
        />
        <div className="text-sm text-gray-600">
          Valor atual: #{color}
        </div>
        <div 
          className="w-16 h-16 rounded border border-gray-300"
          style={{ backgroundColor: `#${color}` }}
        />
      </div>
    );
  },
  args: {
    title: "Cor Controlada",
    placeholder: "000000",
  },
};

// Story com validação
export const ValidationExample: Story = {
  render: (args) => {
    const [color, setColor] = useState("");
    
    return (
      <div className="space-y-4 max-w-md">
        <InputColor
          {...args}
          value={color}
          onValueChange={setColor}
        />
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Teste de validação:</strong></p>
          <p>✅ Cores válidas: ff0000, 00ff00, 123, abc</p>
          <p>❌ Cores inválidas: xyz123, gggggg, 12345</p>
          <p>Tente digitar cores inválidas - elas serão rejeitadas</p>
        </div>
        {color && (
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: `#${color}` }}
            />
            <span className="text-sm">#{color}</span>
          </div>
        )}
      </div>
    );
  },
  args: {
    title: "Teste de Validação",
    placeholder: "Digite uma cor",
  },
};

// Story com múltiplas cores
export const MultipleColors: Story = {
  render: () => {
    const [colors, setColors] = useState({
      primary: "ff0000",
      secondary: "00ff00", 
      accent: "0000ff",
      background: "f5f5f5",
    });

    const updateColor = (key: string) => (value: string) => {
      setColors(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div className="space-y-6 max-w-md">
        <h3 className="text-lg font-semibold">Paleta de Cores</h3>
        
        <InputColor
          title="Cor Primária"
          value={colors.primary}
          onValueChange={updateColor('primary')}
        />
        
        <InputColor
          title="Cor Secundária"
          value={colors.secondary}
          onValueChange={updateColor('secondary')}
        />
        
        <InputColor
          title="Cor de Destaque"
          value={colors.accent}
          onValueChange={updateColor('accent')}
        />
        
        <InputColor
          title="Cor de Fundo"
          value={colors.background}
          onValueChange={updateColor('background')}
        />

        <div className="mt-6">
          <h4 className="text-md font-medium mb-3">Preview da Paleta</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-12 h-12 rounded border border-gray-300 mx-auto mb-1"
                  style={{ backgroundColor: `#${value}` }}
                />
                <p className="text-xs capitalize">{key}</p>
                <p className="text-xs text-gray-500">#{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
}; 