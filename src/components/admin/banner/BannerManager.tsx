import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadForm } from "./ImageUploadForm";
import { ImageUrlInput } from "./ImageUrlInput";
import { ImagePreview } from "./ImagePreview";

export const BannerManager = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentBanner();
  }, []);

  const fetchCurrentBanner = async () => {
    const { data, error } = await supabase
      .from('vertical_banner_settings')
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
      setImageUrl(data.image_url);
      setLinkUrl(data.link_url || "");
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
        .from('vertical_banner_settings')
        .insert([
          {
            image_url: finalImageUrl,
            link_url: linkUrl
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
        <h2 className="text-2xl font-bold">Bannière verticale</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <ImageUploadForm onFileChange={handleFileChange} />
          
          <div className="divider">ou</div>
          
          <ImageUrlInput 
            imageUrl={imageUrl}
            onUrlChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="space-y-2">
            <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700">
              URL du lien (optionnel)
            </label>
            <input
              type="url"
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-magazine-red focus:border-magazine-red"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <ImagePreview imageUrl={imageUrl} file={file} />

        <Button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour la bannière"}
        </Button>
      </form>
    </div>
  );
};