"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TiptapDoc } from "@/lib/rich-text";

const defaultDoc: TiptapDoc = {
  type: "doc",
  content: [{ type: "paragraph", content: [] }],
};

const toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-1 border-b p-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(editor.isActive("bold") && "bg-muted")}
      >
        Bold
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(editor.isActive("italic") && "bg-muted")}
      >
        Italic
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(editor.isActive("bulletList") && "bg-muted")}
      >
        List
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(editor.isActive("orderedList") && "bg-muted")}
      >
        Numbered
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = window.prompt("URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={cn(editor.isActive("link") && "bg-muted")}
      >
        Link
      </Button>
    </div>
  );
};

export interface RichTextEditorProps {
  value: TiptapDoc | null | undefined;
  onChange: (doc: TiptapDoc) => void;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Describe your request…",
  className,
  "data-testid": testId,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener" },
      }),
    ],
    content: value ?? defaultDoc,
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] w-full resize-y rounded-b-md border-0 bg-transparent px-3 py-2 outline-none prose prose-sm max-w-none dark:prose-invert",
      },
    },
  });

  const notifyChange = useCallback(() => {
    const json = editor?.getJSON();
    if (json && (json as TiptapDoc).type === "doc") {
      onChange(json as TiptapDoc);
    }
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) return;

    editor.on("update", notifyChange);

    return () => {
      editor.off("update", notifyChange);
    };
  }, [editor, notifyChange]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getJSON() as TiptapDoc;
    const next = value ?? defaultDoc;
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      editor.commands.setContent(next);
    }
  }, [editor, value]);

  return (
    <div
      className={cn("rounded-md border bg-background", className)}
      data-testid={testId}
    >
      {toolbar({ editor })}
      <EditorContent editor={editor} />
    </div>
  );
}
