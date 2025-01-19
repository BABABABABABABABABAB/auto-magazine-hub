import { ArticleCard } from "./ArticleCard";
import { PaginationControls } from "./home/Pagination";

interface Article {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  subcategory: string;
}

interface ArticleGridProps {
  articles: Article[];
  isCategory?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const ArticleGrid = ({ 
  articles, 
  isCategory = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange 
}: ArticleGridProps) => {
  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4`}>
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
      {onPageChange && (
        <div className="mt-8">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={onPageChange}
          />
        </div>
      )}
    </div>
  );
};