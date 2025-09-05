"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/blocks/editor-00/editor";
import { TextareaEditorProps } from "./textarea-editor.types";
import { useTextareaEditorCtrl } from "./textarea-editor.ctrl";

/**
 * Componente TextareaEditor
 * 
 * Um editor de texto rico baseado no Lexical que permite edição de conteúdo
 * com funcionalidades avançadas de formatação.
 * 
 * Exemplo de uso:
 * ```tsx
 * const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);
 * 
 * <TextareaEditor
 *   editorSerializedState={editorState}
 *   onSerializedChange={(value) => setEditorState(value)}
 *   placeholder="Digite seu conteúdo aqui..."
 * />
 * ```
 */
export function TextareaEditor(props: TextareaEditorProps) {
  return (
    <div
      className={cn(
        "bg-background overflow-hidden rounded-lg border border-input shadow",
        // className
      )}
    >
      <Editor
        value={props.value}
        onValueChange={props.onValueChange}
      />
    </div>
  );
}
