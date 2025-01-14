import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Article = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
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
        .single();

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
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!article) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <img
          src={article.featured_image}
          alt={article.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="space-y-4">
          <div className="text-magazine-red text-sm font-medium">
            {article.subcategories?.categories?.name}
          </div>
          <h1 className="text-4xl font-bold font-roboto text-magazine-black">
            {article.title}
          </h1>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default Article;