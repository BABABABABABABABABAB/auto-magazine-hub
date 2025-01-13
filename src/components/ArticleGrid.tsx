import { ArticleCard } from "./ArticleCard";

interface Article {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

interface ArticleGridProps {
  articles: Article[];
}

export const ArticleGrid = ({ articles }: ArticleGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          id={article.id}
          title={article.title}
          imageUrl={article.imageUrl}
          category={article.category}
        />
      ))}
    </div>
  );
};