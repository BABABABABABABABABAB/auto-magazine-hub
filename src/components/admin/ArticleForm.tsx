import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ContentSection } from "./article-form/ContentSection";
import { CategorySection } from "./article-form/CategorySection";
import { SEOSection } from "./article-form/SEOSection";
import { PublishSection } from "./article-form/PublishSection";
import { ArticleFormData } from "./article-form/types";
import { useNavigate } from "react-router-dom";
import { useImageCompression } from "@/hooks/useImageCompression";

interface ArticleFormProps {
  initialData?: ArticleFormData;
}

export const ArticleForm = ({ initialData }: ArticleFormProps) => {
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<ArticleFormData>({
    defaultValues: {
      hidden: false,
      status: "draft",
      ...initialData,
    },
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { uploadImage } = useImageCompression({
    bucketName: "ui_images",
    folderPath: "articles",
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadImage(file);
      setValue('featured_image', publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const { error } = initialData 
        ? await supabase.from("articles").update(data).eq('id', initialData.id)
        : await supabase.from("articles").insert([data]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: initialData ? "Article modifié avec succès" : "Article créé avec succès",
      });
      
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Erreur",
        description: initialData ? "Impossible de modifier l'article" : "Impossible de créer l'article",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ContentSection
            register={register}
            watch={watch}
            setValue={setValue}
            handleImageUpload={handleImageUpload}
            uploading={uploading}
          />
        </div>

        <div className="space-y-8">
          <CategorySection setValue={setValue} />
          <SEOSection register={register} setValue={setValue} watch={watch} />
          <PublishSection watch={watch} setValue={setValue} />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" className="bg-magazine-red hover:bg-red-600">
          {initialData ? "Modifier l'article" : "Enregistrer l'article"}
        </Button>
      </div>
    </form>
  );
};