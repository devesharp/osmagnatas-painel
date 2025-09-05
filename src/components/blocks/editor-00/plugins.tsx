import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { FontColorToolbarPlugin } from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image";
import { BlockInsertPlugin } from "@/components/editor/plugins/toolbar/block-insert-plugin";
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin";

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div>
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1 bg-black/20">
            <div className="p-1">
              <BlockFormatDropDown>
                <FormatParagraph />
                <FormatHeading levels={["h1", "h2", "h3"]} />
                <FormatNumberedList />
                <FormatBulletedList />
                <FormatQuote />
              </BlockFormatDropDown>
            </div>

            <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto p-1">
              <ElementFormatToolbarPlugin />
            </div>

            <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto p-1">
              <FontColorToolbarPlugin />
            </div>

            <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto p-1">
              <FontFormatToolbarPlugin format="bold" />
              <FontFormatToolbarPlugin format="italic" />
              <FontFormatToolbarPlugin format="underline" />
              <FontFormatToolbarPlugin format="strikethrough" />
            </div>

            <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto p-1">
              <LinkToolbarPlugin />
            </div>
            {/* <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <BlockInsertPlugin>
              <InsertImage />
            </BlockInsertPlugin>
          </div> */}
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative overflow-auto max-h-[200px] bg-white dark:bg-input">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={"Digite o conteúdo aqui..."}
                  className="min-h-[200px] p-3"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LinkPlugin />
      </div>
      <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
      {/* actions plugins */}
      <ImagesPlugin />

      <ListPlugin />
    </div>
  );
}
