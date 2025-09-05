"use client";

import { useState, useEffect, useCallback } from "react";
import { $getRoot, $insertNodes, createEditor, SerializedEditorState } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { TextareaEditorProps } from "./textarea-editor.types";

// Valor inicial padrão para o editor
export const defaultInitialValue = {
  root: {
    children: [],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export function useTextareaEditorCtrl(props: TextareaEditorProps) {
  const {
    initialValue = defaultInitialValue,
    
    onSerializedChange,
    placeholder = "Digite aqui...",
    disabled = false,
    autoFocus = false,
  } = props;

  // Estado interno do editor quando não controlado externamente
  const [editorSerializedState, setEditorSerializedState] = useState<any>(null);
  const [editor, setEditor] = useState<any>(null);
  
  useEffect(() => {
    // if (initialValue) {
    //   // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser();
      const dom = parser.parseFromString('<b>teste</b>', "text/html");

      
    // editor.update(() => {
    //   const nodes = $generateNodesFromDOM(editor, dom);
    //   $insertNodes(nodes);
    //   setTimeout(() => {
    //     setEditorSerializedState(nodes);
    //   }, 1000);
    // });
    // }
  }, []);

  console.log(editor);

  // Callback para lidar com mudanças no editor
  const handleEditorChange = useCallback(
    (value: SerializedEditorState) => {
      console.log(value);
      setEditorSerializedState(value);
    },
    []
  );

  return {
    // Estado do editor
    editorSerializedState,
    editor,
    setEditor,

    // Configurações
    placeholder,
    disabled,
    autoFocus,

    // Ações
    handleEditorChange,
  };
}
