import { useState, useEffect } from "react";
import { ArticleGrid } from "@/components/ArticleGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name");

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories",
          variant: "destructive",
        });
        return;
      }

      setCategories(data.map(cat => cat.name));
    };

    fetchCategories();
  }, [toast]);

  useEffect(() => {
    const fetchArticles = async () => {
      let query = supabase
        .from("articles")
        .select(`
          id,
          title,
          featured_image,
          subcategories!inner (
            name,
            categories!inner (
              name
            )
          )
        `)
        .eq("hidden", false)
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("subcategories.categories.name", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive",
        });
        return;
      }

      const formattedArticles = data.map(article => ({
        id: article.id,
        title: article.title,
        imageUrl: article.featured_image || "/placeholder.svg",
        category: article.subcategories?.categories?.name || "Non catégorisé"
      }));

      setArticles(formattedArticles);
    };

    fetchArticles();
  }, [selectedCategory, toast]);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-magazine-black text-white py-8">
        <div className="container mx-auto text-center">
          <h1 className="font-roboto text-4xl font-bold mb-4">Auto Magazine</h1>
          <p className="text-magazine-gray">
            L'actualité automobile en temps réel
          </p>
        </div>
      </header>
      <main className="container mx-auto">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ArticleGrid articles={articles} />
      </main>
    </div>
  );
};

export default Home;