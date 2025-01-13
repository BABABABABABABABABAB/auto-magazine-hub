import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ContentSection } from "./article-form/ContentSection";
import { CategorySection } from "./article-form/CategorySection";
import { SEOSection } from "./article-form/SEOSection";
import { PublishSection } from "./article-form/PublishSection";
import { ArticleFormData } from "./article-form/types";

export const ArticleForm = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<ArticleFormData>({
    defaultValues: {
      hidden: false,
    },
  });
  const { toast } = useToast();

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from("subcategories")
      .select(`*, categories(name)`)
      .order("name", { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les sous-catégories",
        variant: "destructive",
      });
      return;
    }

    setSubcategories(data);
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('ui_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ui_images')
        .getPublicUrl(filePath);

      setValue('featured_image', publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    const { error } = await supabase.from("articles").insert([
      {
        ...data,
        status: "draft",
      },
    ]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Article créé avec succès",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ContentSection
            register={register}
            watch={watch}
            setValue={setValue}
            handleImageUpload={handleImageUpload}
            uploading={uploading}
          />
          <CategorySection setValue={setValue} subcategories={subcategories} />
        </div>

        <div className="space-y-4">
          <SEOSection register={register} />
          <PublishSection watch={watch} setValue={setValue} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-magazine-red hover:bg-red-600">
          Enregistrer l'article
        </Button>
      </div>
    </form>
  );
};