"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $getRoot,
  $insertNodes,
  EditorState,
  SerializedEditorState,
} from "lexical";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { FloatingLinkContext } from "@/components/editor/context/floating-link-context";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import useDeepEffect from "@lucarestagno/use-deep-effect";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

function HTMLLoaderPlugin({ htmlString }) {
  const [editor] = useLexicalComposerContext();

  useDeepEffect(() => {
    if (!htmlString) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, "text/html");
      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();
      // Insert them at a selection.
      $insertNodes(nodes);

    });
  }, [htmlString, editor]);

  return null;
}

function EditorStateToHTMLPlugin({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      ignoreSelectionChange={true}
      onChange={(editorState) => {
        editor.read(() => {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onValueChange(htmlString);
        });
      }}
    />
  );
}

export function Editor({
  value,
  editorState,
  editorSerializedState,
  onValueChange,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  return (
    <div>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <HTMLLoaderPlugin htmlString={value} />
        <TooltipProvider>
          <FloatingLinkContext>
            <Plugins />

            <EditorStateToHTMLPlugin onValueChange={onValueChange} />

            {/* <OnChangePlugin
              ignoreSelectionChange={true}
              onChange={(editorState) => {
                editorState.read(() => {
                  const htmlString = $generateHtmlFromNodes(editorState, null);
                  console.log(htmlString);
                });
                // onChange?.(editorState);
                // onSerializedChange?.(editorState.toJSON());
              }}
            /> */}
          </FloatingLinkContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
