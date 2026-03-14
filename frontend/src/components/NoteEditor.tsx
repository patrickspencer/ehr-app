"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface NoteEditorProps {
  onGetEditor?: (getHtml: () => string) => void;
}

export default function NoteEditor({ onGetEditor }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none h-full px-4 py-3",
      },
    },
    content: "",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && onGetEditor) {
      onGetEditor(() => editor.getHTML());
    }
  }, [editor, onGetEditor]);

  if (!editor) return null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="B"
          className="font-bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="I"
          className="italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label="S"
          className="line-through"
        />
        <div className="mx-1 w-px bg-gray-300" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="H2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="H3"
        />
        <div className="mx-1 w-px bg-gray-300" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="&bull; List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="1. List"
        />
      </div>

      {/* Editor */}
      <div
        className="min-h-0 flex-1 cursor-text overflow-y-auto"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent
          editor={editor}
          className="flex h-full flex-col [&_.tiptap]:flex-1"
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
  className,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs transition-colors ${className ?? ""} ${
        active
          ? "bg-slate-600 text-white"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      }`}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
}
