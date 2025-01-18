import { useState, useEffect } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Banner } from "@/components/home/Banner";
import { MainContent } from "@/components/home/MainContent";
import { PaginationControls } from "@/components/home/Pagination";
import { useArticles } from "@/hooks/useArticles";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { articles, totalPages, isLoading } = useArticles(
    selectedCategory,
    selectedSubcategoryId,
    currentPage
  );

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

      setCategories(data.map((cat) => cat.name));
    };

    fetchCategories();
  }, [toast]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategoryId(null);
    setCurrentPage(1);
    
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#222222] text-white">
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
            onSelectCategory={handleCategorySelect}
            onSelectSubcategory={handleSubcategorySelect}
          />
        </div>
      </nav>

      {/* Banner */}
      <Banner />

      {/* Main Content */}
      {isLoading ? (
        <div className="container mx-auto py-8 text-center">Chargement...</div>
      ) : (
        <>
          <MainContent
            selectedCategory={selectedCategory}
            articles={articles}
          />
          {selectedCategory && (
            <div className="container mx-auto">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;