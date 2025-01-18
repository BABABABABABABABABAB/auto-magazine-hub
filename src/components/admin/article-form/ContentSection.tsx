import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "../RichTextEditor";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ContentSectionProps {
  register: UseFormRegister<ArticleFormData>;
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
}

export const ContentSection = ({
  register,
  watch,
  setValue,
  handleImageUpload,
  uploading,
}: ContentSectionProps) => {
  const [sourceUrl, setSourceUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!sourceUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une URL",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data: { publicUrl: functionUrl } } = supabase.functions;
      const response = await fetch(`${functionUrl}/generate-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ url: sourceUrl }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const article = await response.json();
      
      setValue("title", article.title);
      setValue("content", article.content);
      setValue("excerpt", article.excerpt);
      setValue("meta_title", article.meta_title);
      setValue("meta_description", article.meta_description);

      toast({
        title: "Succès",
        description: "Article généré avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'article",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contenu de l'article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="source_url">URL source (optionnel)</Label>
              <Input
                id="source_url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/article"
              />
            </div>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="bg-magazine-red hover:bg-red-600"
            >
              {generating ? "Génération..." : "Générer"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" {...register("title")} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extrait</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              rows={3}
              placeholder="Un bref résumé de l'article..."
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu</Label>
            <div className="border rounded-lg overflow-hidden">
              <RichTextEditor
                value={watch("content") || ""}
                onChange={(value) => setValue("content", value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured_image">Image à la une</Label>
            <Input
              id="featured_image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {watch("featured_image") && (
              <img
                src={watch("featured_image")}
                alt="Aperçu"
                className="mt-2 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};