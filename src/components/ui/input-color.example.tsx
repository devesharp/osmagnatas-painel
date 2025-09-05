import React, { useState } from "react";
import { InputColor } from "./input-color";

/**
 * Exemplo de uso do InputColor com react-colorful
 * Demonstra todas as funcionalidades do componente
 */
export function InputColorExample() {
  const [color1, setColor1] = useState<string>("ff0000");
  const [color2, setColor2] = useState<string>("");
  const [color3, setColor3] = useState<string>("00ff00");

  return (
    <div className="space-y-8 p-6 max-w-md">
      <h2 className="text-2xl font-bold">Exemplos de InputColor</h2>
      
      {/* Exemplo básico */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Exemplo Básico</h3>
        <p className="text-sm text-gray-600">
          Com valor inicial e controle externo
        </p>
        <InputColor
          title="Cor Principal"
          value={color1}
          onValueChange={setColor1}
          placeholder="Escolha uma cor"
        />
        <p className="text-xs text-gray-500">
          Valor atual: <code className="bg-gray-100 px-1 rounded">#{color1}</code>
        </p>
      </div>

      {/* Exemplo sem valor inicial */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sem Valor Inicial</h3>
        <p className="text-sm text-gray-600">
          Permite que o usuário escolha a primeira cor
        </p>
        <InputColor
          title="Cor Secundária"
          value={color2}
          onValueChange={setColor2}
          placeholder="Digite ou escolha uma cor"
        />
        <p className="text-xs text-gray-500">
          Valor atual: <code className="bg-gray-100 px-1 rounded">#{color2 || "nenhum"}</code>
        </p>
      </div>

      {/* Exemplo desabilitado */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Desabilitado</h3>
        <p className="text-sm text-gray-600">
          Componente em estado desabilitado
        </p>
        <InputColor
          title="Cor Desabilitada"
          value={color3}
          onValueChange={setColor3}
          disabled={true}
        />
        <p className="text-xs text-gray-500">
          Valor atual: <code className="bg-gray-100 px-1 rounded">#{color3}</code>
        </p>
      </div>

      {/* Demonstração de validação */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Teste de Validação</h3>
        <p className="text-sm text-gray-600">
          Digite valores inválidos para ver a validação funcionando
        </p>
        <InputColor
          title="Teste de Validação"
          placeholder="Tente digitar 'xyz' ou '12g'"
        />
        <div className="text-xs text-gray-500 space-y-1">
          <p>✅ Valores válidos: 123, abc, FF0000, 00ff00</p>
          <p>❌ Valores inválidos: xyz, 12g, hello</p>
          <p>🔄 Cores inválidas revertem para a última cor válida</p>
        </div>
      </div>

      {/* Exemplo com onChange */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Com Handler onChange</h3>
        <p className="text-sm text-gray-600">
          Demonstra o uso do onChange tradicional
        </p>
        <InputColor
          title="Com onChange"
          onChange={(e) => {
            console.log('onChange chamado:', e.target.value);
          }}
          onValueChange={(value) => {
            console.log('onValueChange chamado:', value);
          }}
        />
        <p className="text-xs text-gray-500">
          Verifique o console para ver os eventos disparados
        </p>
      </div>
    </div>
  );
} 