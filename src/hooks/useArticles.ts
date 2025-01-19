import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ARTICLES_PER_PAGE = 16;

export const useArticles = (
  selectedCategory: string | null,
  selectedSubcategoryId: string | null,
  currentPage: number
) => {
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        console.log("Selected category:", selectedCategory);
        console.log("Selected subcategory ID:", selectedSubcategoryId);

        // Calculate pagination range
        const start = (currentPage - 1) * ARTICLES_PER_PAGE;
        const end = start + ARTICLES_PER_PAGE - 1;

        let query = supabase
          .from("articles")
          .select(`
            *,
            subcategories!inner (
              id,
              name,
              categories!inner (
                id,
                name
              )
            )
          `, { count: 'exact' })
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .range(start, end);

        // Si une sous-catégorie est sélectionnée, on filtre par son ID
        if (selectedSubcategoryId) {
          console.log("Filtering by subcategory ID:", selectedSubcategoryId);
          query = query.eq("subcategory_id", selectedSubcategoryId);
        } else if (selectedCategory && selectedCategory !== "Tout") {
          // Si pas de sous-catégorie mais une catégorie sélectionnée
          query = query.eq("subcategories.categories.name", selectedCategory);
        }

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        console.log("Fetched articles:", data);

        const formattedArticles = data.map((article) => ({
          id: article.id,
          title: article.title,
          imageUrl: article.featured_image || "/placeholder.svg",
          category: article.subcategories?.categories?.name || "Non catégorisé",
          subcategory: article.subcategories?.name || "Non catégorisé",
          createdAt: article.created_at,
        }));

        setArticles(formattedArticles);
        setTotalPages(Math.ceil((count || 0) / ARTICLES_PER_PAGE));
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory, selectedSubcategoryId, currentPage, toast]);

  return { articles, totalPages, isLoading };
};