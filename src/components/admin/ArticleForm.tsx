import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "./RichTextEditor";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  subcategory_id: string;
  hidden: boolean;
}

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
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input {...register("title")} required />
          </div>

          <div>
            <label className="text-sm font-medium">Extrait</label>
            <Textarea {...register("excerpt")} rows={3} />
          </div>

          <div>
            <label className="text-sm font-medium">Contenu</label>
            <div className="border rounded-md">
              <ScrollArea className="h-[500px]">
                <RichTextEditor
                  value={watch("content") || ""}
                  onChange={(value) => setValue("content", value)}
                />
              </ScrollArea>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Image à la une</label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {watch("featured_image") && (
                <img
                  src={watch("featured_image")}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Sous-catégorie</label>
            <Select
              onValueChange={(value) => setValue("subcategory_id", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une sous-catégorie" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcat) => (
                  <SelectItem key={subcat.id} value={subcat.id}>
                    {subcat.name} ({subcat.categories?.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Options SEO</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input {...register("slug")} required />
              </div>

              <div>
                <label className="text-sm font-medium">Meta Title</label>
                <Input {...register("meta_title")} />
                <p className="text-sm text-gray-500 mt-1">
                  Recommandé: 50-60 caractères
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea {...register("meta_description")} rows={3} />
                <p className="text-sm text-gray-500 mt-1">
                  Recommandé: 150-160 caractères
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Options de publication</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={watch("hidden")}
                onCheckedChange={(checked) => setValue("hidden", checked)}
              />
              <label className="text-sm font-medium">Masquer l'article</label>
            </div>
          </div>
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