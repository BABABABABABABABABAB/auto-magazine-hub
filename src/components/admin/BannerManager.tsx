import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const BannerManager = () => {
  const [imageUrl, setImageUrl] = useState("");
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('home_settings')
      .insert([
        {
          background_url: imageUrl,
          background_type: 'image'
        }
      ]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la bannière",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "La bannière a été mise à jour",
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bannière</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="imageUrl" className="text-sm font-medium">
            URL de l'image
          </label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {imageUrl && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Aperçu</h3>
            <div 
              className="w-full h-[200px] bg-cover bg-center rounded-lg border"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour la bannière"}
        </Button>
      </form>
    </div>
  );
};