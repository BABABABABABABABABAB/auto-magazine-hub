import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VerticalBanner } from "@/components/article/VerticalBanner";
import { useIsMobile } from "@/hooks/use-mobile";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!id) {
        toast({
          title: "Erreur",
          description: "ID d'article manquant",
          variant: "destructive",
        });
        throw new Error("ID d'article manquant");
      }

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          subcategories (
            name,
            categories (
              name
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!article) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-8 px-4">
      <div className="flex flex-col gap-4">
        <div className="w-full space-y-4 md:space-y-8">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-48 md:h-96 object-cover rounded-lg"
          />
          <div className="space-y-3 md:space-y-4">
            <div className="text-magazine-red text-sm font-medium">
              {article.subcategories?.categories?.name}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold font-roboto text-magazine-black">
              {article.title}
            </h1>
            {article.excerpt && (
              <div className="text-lg md:text-xl text-gray-700 font-medium italic border-l-4 border-magazine-red pl-4">
                {article.excerpt}
              </div>
            )}
          </div>
        </div>
        
        {isMobile ? (
          <>
            <div className="w-full flex justify-center my-4">
              <VerticalBanner />
            </div>
            <div className="prose max-w-none text-base md:text-lg">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </>
        ) : (
          <div className="flex gap-8">
            <div className="flex-1 prose max-w-none text-base md:text-lg">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            <div className="w-[300px] shrink-0">
              <VerticalBanner />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Article;