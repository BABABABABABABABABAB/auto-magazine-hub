import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ARTICLES_PER_PAGE = 12;

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
        console.log("Fetching articles with category:", selectedCategory);

        // Base query for articles
        let query = supabase
          .from("articles")
          .select(`
            *,
            subcategories (
              id,
              name,
              categories (
                id,
                name
              )
            )
          `)
          .eq("hidden", false);

        // Add category filter if selected
        if (selectedCategory) {
          query = query.eq("subcategories.categories.name", selectedCategory);
        }

        // Add subcategory filter if selected
        if (selectedSubcategoryId) {
          query = query.eq("subcategory_id", selectedSubcategoryId);
        }

        // Get total count
        const { count: totalCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("hidden", false);

        if (totalCount !== null) {
          setTotalPages(Math.ceil(totalCount / ARTICLES_PER_PAGE));
        }

        // Calculate pagination range
        const start = (currentPage - 1) * ARTICLES_PER_PAGE;
        const end = start + ARTICLES_PER_PAGE - 1;

        // Get paginated data
        const { data, error } = await query
          .range(start, end)
          .order("created_at", { ascending: false });

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