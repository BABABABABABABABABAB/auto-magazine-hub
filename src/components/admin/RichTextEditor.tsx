import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
          }`}
        >
          H3
        </button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
    </div>
  );
};