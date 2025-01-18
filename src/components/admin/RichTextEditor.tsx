import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MenuBar } from './rich-text-editor/MenuBar';
import { PromptSection } from './rich-text-editor/PromptSection';
import { LinkDialog } from './rich-text-editor/LinkDialog';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [generating, setGenerating] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline cursor-pointer',
        },
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[500px] p-4 focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prompt pour générer du contenu",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-from-prompt', {
        body: { prompt }
      });

      if (error) throw error;
      
      editor.commands.setContent(data.content);
      onChange(data.content);

      toast({
        title: "Succès",
        description: "Contenu généré avec succès",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    console.log("Transcription reçue:", text);
    setPrompt(text);
    if (text.trim()) {
      console.log("Lancement de la génération...");
      handleGenerateFromPrompt();
    }
  };

  const handleRegenerate = async () => {
    const content = editor.getHTML();
    if (!content) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord ajouter du contenu à régénérer",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-article', {
        body: { content }
      });

      if (error) throw error;
      
      editor.commands.setContent(data.content);
      onChange(data.content);

      toast({
        title: "Succès",
        description: "Contenu régénéré avec succès",
      });
    } catch (error) {
      console.error('Error regenerating content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de régénérer le contenu",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const setLink = () => {
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setUrl('');
    setShowLinkDialog(false);
  };

  return (
    <div className="space-y-4">
      <PromptSection
        prompt={prompt}
        onPromptChange={setPrompt}
        onVoiceTranscript={handleVoiceTranscript}
        onGenerate={handleGenerateFromPrompt}
        generating={generating}
      />

      <div className="relative border rounded-lg overflow-hidden">
        <MenuBar
          editor={editor}
          onRegenerate={handleRegenerate}
          generating={generating}
        />
        <EditorContent editor={editor} />
      </div>

      <LinkDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        url={url}
        onUrlChange={setUrl}
        onSetLink={setLink}
        isActive={editor.isActive('link')}
      />
    </div>
  );
};