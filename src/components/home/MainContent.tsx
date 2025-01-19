import { Separator } from "@/components/ui/separator";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleCard } from "@/components/ArticleCard";

interface MainContentProps {
  selectedCategory: string | null;
  articles: any[];
  selectedSubcategoryName?: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const MainContent = ({ 
  selectedCategory, 
  articles, 
  selectedSubcategoryName,
  currentPage,
  totalPages,
  onPageChange
}: MainContentProps) => {
  if (selectedCategory) {
    const title = selectedSubcategoryName 
      ? `${selectedCategory} • ${selectedSubcategoryName}`
      : `Articles dans la catégorie "${selectedCategory}"`;

    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold text-white text-left mb-4">
          {title}
        </h2>
        <Separator className="bg-magazine-red h-1" />
        <ArticleGrid 
          articles={articles} 
          isCategory={true} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    );
  }

  const topArticles = articles.slice(0, 3);
  const featuredArticle = articles[3];
  const leftGridArticles = articles.slice(4, 10);
  const rightArticles = articles.slice(10, 12);
  const bottomArticles = articles.slice(12, 15);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white text-left">
          Articles récents
        </h2>
        <Separator className="bg-magazine-red h-1 mt-2" />
      </div>
      
      {/* Top 3 articles - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {topArticles.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            imageUrl={article.imageUrl}
            category={article.category}
            subcategory={article.subcategory}
          />
        ))}
      </div>

      {/* Featured article */}
      {featuredArticle && (
        <div className="mb-4">
          <ArticleCard
            id={featuredArticle.id}
            title={featuredArticle.title}
            imageUrl={featuredArticle.imageUrl}
            category={featuredArticle.category}
            subcategory={featuredArticle.subcategory}
          />
        </div>
      )}

      {/* Main content grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Left grid - 6 articles in a more compact layout */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {leftGridArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              imageUrl={article.imageUrl}
              category={article.category}
              subcategory={article.subcategory}
              isCompact={true}
            />
          ))}
        </div>

        {/* Right column - 2 larger articles */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-1 gap-4 h-full">
          {rightArticles.map((article) => (
            <div key={article.id} className="h-full">
              <ArticleCard
                id={article.id}
                title={article.title}
                imageUrl={article.imageUrl}
                category={article.category}
                subcategory={article.subcategory}
                isCompact={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 3 articles - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {bottomArticles.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            imageUrl={article.imageUrl}
            category={article.category}
            subcategory={article.subcategory}
          />
        ))}
      </div>
      <Separator className="bg-magazine-red h-1 mt-8" />
    </div>
  );
};