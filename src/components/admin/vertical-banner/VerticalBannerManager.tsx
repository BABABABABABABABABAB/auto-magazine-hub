import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VerticalBannerForm } from "./VerticalBannerForm";

export function VerticalBannerManager() {
  const { data: currentBanner } = useQuery({
    queryKey: ["vertical-banner"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vertical_banner_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bannière Verticale</h2>
      </div>

      <VerticalBannerForm
        defaultValues={
          currentBanner
            ? {
                imageUrl: currentBanner.image_url,
                linkUrl: currentBanner.link_url,
              }
            : undefined
        }
      />
    </div>
  );
}