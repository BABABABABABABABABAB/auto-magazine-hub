import { useState, useEffect } from "react";
import { ArticleGrid } from "@/components/ArticleGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({
    background_url: '',
    background_type: 'image'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchBannerSettings = async () => {
      const { data, error } = await supabase
        .from('home_settings')
        .select('*')
        .order('created_at', { ascending: false })
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
            id,
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

      if (selectedSubcategoryId) {
        query = query.eq("subcategory_id", selectedSubcategoryId);
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
        category: article.subcategories?.categories?.name || "Non catégorisé",
        subcategory: article.subcategories?.name || "Non catégorisé"
      }));

      setArticles(formattedArticles);
    };

    fetchArticles();
  }, [selectedCategory, selectedSubcategoryId, toast]);

  return (
    <div className="min-h-screen bg-white">
      {/* Logo Bar */}
      <div className="bg-magazine-red py-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-serif text-white text-center">
            L'Automobile Magazine
          </h1>
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="bg-magazine-black text-white py-2 sticky top-0 z-50">
        <div className="container mx-auto">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectSubcategory={(subcategoryId) => {
              setSelectedSubcategoryId(subcategoryId);
              console.log("Selected subcategory ID:", subcategoryId);
            }}
          />
        </div>
      </nav>

      {/* Banner */}
      {bannerSettings.background_url && (
        <div 
          className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bannerSettings.background_url})`
          }}
        />
      )}

      {/* Articles Grid */}
      <main className="container mx-auto">
        <ArticleGrid articles={articles} />
      </main>
    </div>
  );
};

export default Home;