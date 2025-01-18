import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BannerSettings {
  background_url: string;
  background_type: string;
  link_url: string | null;
}

export const Banner = () => {
  const [bannerSettings, setBannerSettings] = useState<BannerSettings>({
    background_url: "",
    background_type: "image",
    link_url: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchBannerSettings = async () => {
      const { data, error } = await supabase
        .from("home_settings")
        .select("*")
        .order("created_at", { ascending: false })
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
        setBannerSettings(data);
      }
    };

    fetchBannerSettings();
  }, [toast]);

  if (!bannerSettings.background_url) return null;

  return bannerSettings.link_url ? (
    <a
      href={bannerSettings.link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-[200px] md:h-[300px] lg:h-[400px] bg-cover bg-center bg-no-repeat cursor-pointer transition-opacity hover:opacity-90"
      style={{
        backgroundImage: `url(${bannerSettings.background_url})`,
      }}
    />
  ) : (
    <div
      className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bannerSettings.background_url})`,
      }}
    />
  );
};