import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { LinkNode } from "@lexical/link"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"
import { ListItemNode } from "@lexical/list"
import { ListNode } from "@lexical/list"
import { ImageNode } from "@/components/editor/nodes/image-node"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [HeadingNode, ParagraphNode, TextNode, QuoteNode, LinkNode, ListNode, ListItemNode, ImageNode]
