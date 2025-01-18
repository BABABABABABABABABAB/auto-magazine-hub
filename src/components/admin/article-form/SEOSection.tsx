import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ArticleFormData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface SEOSectionProps {
  register: UseFormRegister<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
  watch: UseFormWatch<ArticleFormData>;
}

export const SEOSection = ({ register, setValue, watch }: SEOSectionProps) => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateSEO = async () => {
    const content = watch("content");
    const title = watch("title");

    if (!content) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord ajouter du contenu à l'article",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo', {
        body: { content, title }
      });

      if (error) throw error;
      
      // Update all fields with generated content
      setValue("title", data.title);
      setValue("slug", data.slug);
      setValue("excerpt", data.excerpt);
      setValue("meta_title", data.metaTitle);
      setValue("meta_description", data.metaDescription);

      toast({
        title: "Succès",
        description: "Contenu SEO généré avec succès",
      });
    } catch (error) {
      console.error('Error generating SEO:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu SEO",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>SEO</CardTitle>
        <Button 
          onClick={handleGenerateSEO}
          disabled={generating}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {generating && <Loader2 className="h-4 w-4 animate-spin" />}
          {generating ? "Génération..." : "Générer tout le contenu"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input id="meta_title" {...register("meta_title")} />
          <p className="text-sm text-gray-500">
            Recommandé: 50-60 caractères
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            {...register("meta_description")}
            rows={3}
          />
          <p className="text-sm text-gray-500">
            Recommandé: 150-160 caractères
          </p>
        </div>
      </CardContent>
    </Card>
  );
};