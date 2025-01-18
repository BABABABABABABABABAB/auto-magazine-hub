import { Separator } from "@/components/ui/separator";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleCard } from "@/components/ArticleCard";

interface MainContentProps {
  selectedCategory: string | null;
  articles: any[];
}

export const MainContent = ({ selectedCategory, articles }: MainContentProps) => {
  if (selectedCategory) {
    // Page catégorie : grille 4x4
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold text-white text-left mb-4">
          {`Articles dans la catégorie "${selectedCategory}"`}
        </h2>
        <Separator className="bg-magazine-red h-1" />
        <ArticleGrid articles={articles} isCategory={true} />
      </div>
    );
  }

  // Page d'accueil : layout spécifique
  const topArticles = articles.slice(0, 3);
  const featuredArticle = articles[3];
  const leftGridArticles = articles.slice(4, 10);
  const rightArticles = articles.slice(10, 12);
  const bottomArticles = articles.slice(12, 15);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-white text-left mb-4">
        Articles récents
      </h2>
      <Separator className="bg-magazine-red h-1" />
      
      {/* Top 3 articles */}
      <div className="grid grid-cols-3 gap-4 mb-4">
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

      <div className="grid grid-cols-4 gap-4">
        {/* Left grid - 6 articles in a more compact layout */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
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
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {rightArticles.map((article) => (
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
      </div>

      {/* Bottom 3 articles */}
      <div className="grid grid-cols-3 gap-4 mt-4">
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
    </div>
  );
};