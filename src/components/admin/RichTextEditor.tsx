import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { VoiceRecognitionButton } from './VoiceRecognitionButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

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
    setPrompt(text);
    // Lancer automatiquement la génération après la transcription
    handleGenerateFromPrompt();
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

  const MenuBar = () => {
    const isTextSelected = editor.view.state.selection.content().size > 0;

    return (
      <div className={`
        border-b p-2 flex gap-2 flex-wrap items-center justify-between
        ${isTextSelected ? 'bg-gray-50' : ''}
        sticky top-0 z-10 bg-white
      `}>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('paragraph') ? 'bg-gray-200' : ''
            }`}
            title="Paragraphe"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            title="Gras"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italique"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <button
                onClick={() => setShowLinkDialog(true)}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive('link') ? 'bg-gray-200' : ''
                }`}
                title="Lien"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un lien</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={setLink}>
                    {editor.isActive('link') ? 'Mettre à jour le lien' : 'Créer le lien'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
            }`}
            title="Titre H1"
          >
            <span className="font-bold text-lg">H1</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
            }`}
            title="Titre H2"
          >
            <span className="font-semibold text-base">H2</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
            }`}
            title="Titre H3"
          >
            <span className="font-medium text-sm">H3</span>
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            title="Liste à puces"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="9" x2="20" y1="6" y2="6"/><line x1="9" x2="20" y1="12" y2="12"/><line x1="9" x2="20" y1="18" y2="18"/><line x1="5" x2="5" y1="6" y2="6"/><line x1="5" x2="5" y1="12" y2="12"/><line x1="5" x2="5" y1="18" y2="18"/></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            title="Liste numérotée"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('blockquote') ? 'bg-gray-200' : ''
            }`}
            title="Citation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleRegenerate}
            disabled={generating}
            variant="outline"
            size="sm"
          >
            {generating ? "Régénération..." : "Régénérer le contenu"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="prompt">Prompt pour générer du contenu</Label>
          <div className="flex gap-2">
            <Textarea
              id="prompt"
              placeholder="Décrivez l'article que vous souhaitez générer..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <VoiceRecognitionButton onTranscript={handleVoiceTranscript} />
          </div>
        </div>
        <Button
          onClick={handleGenerateFromPrompt}
          disabled={generating}
          className="self-end"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            "Générer"
          )}
        </Button>
      </div>

      <div className="relative border rounded-lg overflow-hidden">
        <MenuBar />
        <EditorContent editor={editor} />
      </div>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un lien</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Annuler
              </Button>
              <Button onClick={setLink}>
                {editor.isActive('link') ? 'Mettre à jour le lien' : 'Créer le lien'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
