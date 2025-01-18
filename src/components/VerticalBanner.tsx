import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const VerticalBanner = () => {
  const { data: banner } = useQuery({
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

  if (!banner) return null;

  const BannerContent = () => (
    <div className="w-full h-full">
      <img
        src={banner.image_url}
        alt="Banner"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );

  return banner.link_url ? (
    <a
      href={banner.link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-[600px] sticky top-4"
    >
      <BannerContent />
    </a>
  ) : (
    <div className="w-full h-[600px] sticky top-4">
      <BannerContent />
    </div>
  );
};