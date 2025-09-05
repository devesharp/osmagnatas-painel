import React, { useState } from "react";
import { Select, ISelectOption } from "./select";

/**
 * Exemplo de uso do Select com virtualização
 * Demonstra performance com listas grandes
 */
export function SelectVirtualizedExample() {
  const [selectedValue, setSelectedValue] = useState<string>("");

  // Gerar uma lista grande de opções para demonstrar a virtualização
  const generateManyOptions = (count: number): ISelectOption[] => {
    return Array.from({ length: count }, (_, index) => ({
      value: `option-${index}`,
      label: `Opção ${index + 1} - Item muito longo com texto adicional para testar o layout`,
    }));
  };

  // Diferentes tamanhos de listas para teste
  const smallList = generateManyOptions(10);
  const mediumList = generateManyOptions(50);
  const largeList = generateManyOptions(500);
  const veryLargeList = generateManyOptions(5000);

  return (
    <div className="space-y-8 p-6 max-w-md">
      <h2 className="text-2xl font-bold">Select com Virtualização</h2>
      
      {/* Lista pequena - sem virtualização */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Lista Pequena (10 itens)</h3>
        <p className="text-sm text-gray-600">
          Sem virtualização - renderização normal
        </p>
        <Select
          title="Selecione uma opção"
          options={smallList}
          value={selectedValue}
          onValueChange={setSelectedValue}
          virtualizeThreshold={50}
        />
      </div>

      {/* Lista média - limiar da virtualização */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Lista Média (50 itens)</h3>
        <p className="text-sm text-gray-600">
          No limiar - ainda sem virtualização
        </p>
        <Select
          title="Selecione uma opção"
          options={mediumList}
          value={selectedValue}
          onValueChange={setSelectedValue}
          virtualizeThreshold={50}
        />
      </div>

      {/* Lista grande - com virtualização */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Lista Grande (500 itens)</h3>
        <p className="text-sm text-gray-600">
          ✅ Com virtualização - performance otimizada
        </p>
        <Select
          title="Selecione uma opção"
          options={largeList}
          value={selectedValue}
          onValueChange={setSelectedValue}
          virtualizeThreshold={50}
          estimateSize={40}
        />
      </div>

      {/* Lista muito grande - com virtualização */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Lista Muito Grande (5000 itens)</h3>
        <p className="text-sm text-gray-600">
          ✅ Com virtualização - ainda rápido!
        </p>
        <Select
          title="Selecione uma opção"
          options={veryLargeList}
          value={selectedValue}
          onValueChange={setSelectedValue}
          virtualizeThreshold={50}
          estimateSize={45}
        />
      </div>

      {/* Configuração personalizada */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Configuração Personalizada</h3>
        <p className="text-sm text-gray-600">
          Limiar baixo (20 itens) e tamanho estimado maior (50px)
        </p>
        <Select
          title="Selecione uma opção"
          options={mediumList}
          value={selectedValue}
          onValueChange={setSelectedValue}
          virtualizeThreshold={20} // Ativa virtualização mais cedo
          estimateSize={50} // Itens maiores
        />
      </div>

      {/* Resultado selecionado */}
      {selectedValue && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <strong>Valor selecionado:</strong> {selectedValue}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Exemplo de Select com dados reais (países)
 */
export function SelectCountriesExample() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Lista de países para demonstrar uso real
  const countries: ISelectOption[] = [
    { value: "BR", label: "Brasil" },
    { value: "US", label: "Estados Unidos" },
    { value: "CA", label: "Canadá" },
    { value: "MX", label: "México" },
    { value: "AR", label: "Argentina" },
    { value: "CL", label: "Chile" },
    { value: "CO", label: "Colômbia" },
    { value: "PE", label: "Peru" },
    { value: "UY", label: "Uruguai" },
    { value: "PY", label: "Paraguai" },
    // ... mais países poderiam ser adicionados
  ];

  return (
    <div className="space-y-4 p-6 max-w-md">
      <h2 className="text-xl font-bold">Select de Países</h2>
      
      <Select
        title="Selecione seu país"
        options={countries}
        value={selectedCountry}
        onValueChange={setSelectedCountry}
        virtualizeThreshold={100} // Só virtualiza com muitos países
      />

      {selectedCountry && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            País selecionado: {countries.find(c => c.value === selectedCountry)?.label}
          </p>
        </div>
      )}
    </div>
  );
} 