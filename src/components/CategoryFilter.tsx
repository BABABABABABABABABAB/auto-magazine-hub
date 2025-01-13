import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
        className="font-roboto"
      >
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className="font-roboto"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};