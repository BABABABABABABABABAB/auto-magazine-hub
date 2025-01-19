import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadForm } from "@/components/shared/ImageUploadForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const BannerManager = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLinkUrl(data.link_url || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('home_settings')
        .insert([
          {
            background_url: imageUrl,
            background_type: 'image',
            link_url: linkUrl
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La bannière a été mise à jour",
      });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploadForm
          onImageUpload={setImageUrl}
          bucketName="ui_images"
          folderPath="banners"
          label="Image de la bannière"
        />

        <div className="space-y-2">
          <Label htmlFor="linkUrl">URL du lien (optionnel)</Label>
          <Input
            id="linkUrl"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour la bannière"}
        </Button>
      </form>
    </div>
  );
};