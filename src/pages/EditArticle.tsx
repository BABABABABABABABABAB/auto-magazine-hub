import { useParams } from "react-router-dom";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6">Modifier l'Article</h2>
      <ArticleForm initialData={article} />
    </div>
  );
};

export default EditArticle;