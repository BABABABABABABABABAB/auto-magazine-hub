import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadForm } from "@/components/shared/ImageUploadForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const VerticalBannerManager = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
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
      .maybeSingle();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de la bannière verticale",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setImageUrl(data.image_url);
      setLinkUrl(data.link_url || "");
      setIsActive(data.is_active ?? true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('vertical_banner_settings')
        .insert([
          {
            image_url: imageUrl,
            link_url: linkUrl,
            is_active: isActive
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La bannière verticale a été mise à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la bannière verticale",
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
          folderPath="vertical-banners"
          label="Image de la bannière verticale"
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

        <div className="flex items-center space-x-2">
          <Switch
            id="is-active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="is-active">Activer la bannière</Label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour la bannière"}
        </Button>
      </form>
    </div>
  );
};