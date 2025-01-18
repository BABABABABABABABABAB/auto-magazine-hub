import { useState, useEffect } from "react";
import { ArticleGrid } from "@/components/ArticleGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ARTICLES_PER_PAGE = 12;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({
    background_url: '',
    background_type: 'image',
    link_url: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      try {
        // Base query with joins
        let query = supabase
          .from("articles")
          .select(`
            id,
            title,
            featured_image,
            created_at,
            subcategories!inner (
              id,
              name,
              categories!inner (
                name
              )
            )
          `)
          .eq("hidden", false);

        // Apply category filter if selected
        if (selectedCategory) {
          query = query.eq("subcategories.categories.name", selectedCategory);
        }

        // Apply subcategory filter if selected
        if (selectedSubcategoryId) {
          query = query.eq("subcategory_id", selectedSubcategoryId);
        }

        // Get total count with the same conditions
        const countQuery = supabase
          .from("articles")
          .select('*', { count: 'exact', head: true })
          .eq("hidden", false);

        if (selectedCategory) {
          countQuery.eq("subcategories.categories.name", selectedCategory);
        }
        if (selectedSubcategoryId) {
          countQuery.eq("subcategory_id", selectedSubcategoryId);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
          throw countError;
        }

        setTotalPages(Math.ceil((count || 0) / ARTICLES_PER_PAGE));

        // Then fetch paginated data
        const start = (currentPage - 1) * ARTICLES_PER_PAGE;
        const end = start + ARTICLES_PER_PAGE - 1;

        const { data, error } = await query
          .range(start, end)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedArticles = data.map(article => ({
          id: article.id,
          title: article.title,
          imageUrl: article.featured_image || "/placeholder.svg",
          category: article.subcategories?.categories?.name || "Non catégorisé",
          subcategory: article.subcategories?.name || "Non catégorisé",
          createdAt: article.created_at
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive",
        });
      }
    };

    fetchArticles();
  }, [selectedCategory, selectedSubcategoryId, currentPage, toast]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategoryId(null);
    setCurrentPage(1);
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
      {bannerSettings.background_url && (
        bannerSettings.link_url ? (
          <a 
            href={bannerSettings.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-[200px] md:h-[300px] lg:h-[400px] bg-cover bg-center bg-no-repeat cursor-pointer transition-opacity hover:opacity-90"
            style={{
              backgroundImage: `url(${bannerSettings.background_url})`
            }}
          />
        ) : (
          <div 
            className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bannerSettings.background_url})`
            }}
          />
        )
      )}

      {/* Recent Articles Title and Separator */}
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold text-white text-left mb-4">
          {selectedCategory 
            ? `Articles dans la catégorie "${selectedCategory}"`
            : "Articles récents"}
        </h2>
        <Separator className="bg-magazine-red h-1" />
      </div>

      {/* Articles Grid */}
      <main className="container mx-auto py-8">
        <ArticleGrid articles={articles} />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
