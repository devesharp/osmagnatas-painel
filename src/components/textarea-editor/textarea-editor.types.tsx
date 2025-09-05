import { SerializedEditorState } from "lexical";

export interface TextareaEditorProps {
  value?: string;
  onValueChange?: (value: string) => void;
} 