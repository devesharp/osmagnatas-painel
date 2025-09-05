"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { TextareaEditor, defaultInitialValue } from "./index";

/**
 * Exemplo de uso do componente TextareaEditor
 * 
 * Este exemplo demonstra como usar o componente de forma controlada,
 * similar ao código fornecido pelo usuário.
 */
export default function TextareaEditorExample() {
  const [editorState, setEditorState] = useState<SerializedEditorState>(defaultInitialValue);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Exemplo TextareaEditor</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Editor de Texto Rico
            </label>
            <TextareaEditor
              editorSerializedState={editorState}
              onSerializedChange={(value) => setEditorState(value)}
              placeholder="Digite seu conteúdo aqui..."
              className="min-h-[200px]"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Estado atual do editor:</h3>
            <pre className="p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-64">
              {JSON.stringify(editorState, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 