import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VerticalBannerSettings {
  image_url: string;
  link_url: string | null;
  is_active: boolean;
}

export const VerticalBanner = () => {
  const [bannerSettings, setBannerSettings] = useState<VerticalBannerSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBannerSettings = async () => {
      const { data, error } = await supabase
        .from("vertical_banner_settings")
        .select("*")
        .eq('is_active', true)
        .order("created_at", { ascending: false })
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
        setBannerSettings(data);
      }
    };

    fetchBannerSettings();
  }, [toast]);

  if (!bannerSettings?.image_url || !bannerSettings.is_active) return null;

  const BannerContent = () => (
    <div
      className="w-[300px] h-[600px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bannerSettings.image_url})`,
      }}
    />
  );

  return bannerSettings.link_url ? (
    <a
      href={bannerSettings.link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-opacity hover:opacity-90"
    >
      <BannerContent />
    </a>
  ) : (
    <BannerContent />
  );
};