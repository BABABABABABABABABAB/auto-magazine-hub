import { Separator } from "@/components/ui/separator";
import { ArticleGrid } from "@/components/ArticleGrid";

interface MainContentProps {
  selectedCategory: string | null;
  articles: any[];
}

export const MainContent = ({ selectedCategory, articles }: MainContentProps) => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-white text-left mb-4">
        {selectedCategory
          ? `Articles dans la catégorie "${selectedCategory}"`
          : "Articles récents"}
      </h2>
      <Separator className="bg-magazine-red h-1" />
      <ArticleGrid articles={articles} />
    </div>
  );
};