import { ArticleCard } from "./ArticleCard";

interface Article {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  subcategory: string;
}

interface ArticleGridProps {
  articles: Article[];
}

export const ArticleGrid = ({ articles }: ArticleGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {articles.map((article) => (
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
  );
};