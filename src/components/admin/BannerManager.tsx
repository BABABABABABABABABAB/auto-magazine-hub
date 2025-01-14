import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadForm } from "./banner/ImageUploadForm";
import { ImageUrlInput } from "./banner/ImageUrlInput";
import { ImagePreview } from "./banner/ImagePreview";

export const BannerManager = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentBanner();
  }, []);

  const fetchCurrentBanner = async () => {
    const { data, error } = await supabase
      .from('home_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de la bannière",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setImageUrl(data.background_url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('ui_images')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Erreur lors du téléchargement de l\'image');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('ui_images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = imageUrl;

      if (file) {
        finalImageUrl = await uploadImage(file);
      }

      const { error } = await supabase
        .from('home_settings')
        .insert([
          {
            background_url: finalImageUrl,
            background_type: 'image'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La bannière a été mise à jour",
      });

      setImageUrl(finalImageUrl);
      setFile(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la bannière",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bannière</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <ImageUploadForm onFileChange={handleFileChange} />
          
          <div className="divider">ou</div>
          
          <ImageUrlInput 
            imageUrl={imageUrl}
            onUrlChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <ImagePreview imageUrl={imageUrl} file={file} />

        <Button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour la bannière"}
        </Button>
      </form>
    </div>
  );
};