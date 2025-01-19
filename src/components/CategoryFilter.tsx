import { useState } from "react";
import { useSubcategories } from "@/hooks/useSubcategories";
import { DesktopMenu } from "./category-filter/DesktopMenu";
import { MobileMenu } from "./category-filter/MobileMenu";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectSubcategory?: (subcategoryId: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectSubcategory,
}: CategoryFilterProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const { subcategories } = useSubcategories();

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubcategoryClick = (subcategoryId: string, category: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Subcategory clicked:", subcategoryId, "Category:", category);
    if (onSelectSubcategory) {
      onSelectSubcategory(subcategoryId);
      setActiveSubcategory(subcategoryId);
      setIsMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (category: string | null) => {
    setActiveSubcategory(null);
    
    if (category === "Tout") {
      onSelectCategory(null);
      setIsMobileMenuOpen(false);
      return;
    }

    onSelectCategory(category);
    if (subcategories[category || ""]?.length > 0) {
      toggleCategory(category || "");
    }
    
    if (!subcategories[category || ""]?.length) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative">
      <DesktopMenu
        categories={categories}
        selectedCategory={selectedCategory}
        activeSubcategory={activeSubcategory}
        subcategories={subcategories}
        onCategoryClick={handleCategoryClick}
        onSubcategoryClick={handleSubcategoryClick}
      />
      
      <MobileMenu
        categories={categories}
        selectedCategory={selectedCategory}
        activeSubcategory={activeSubcategory}
        subcategories={subcategories}
        expandedCategories={expandedCategories}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onCategoryClick={handleCategoryClick}
        onSubcategoryClick={handleSubcategoryClick}
        toggleCategory={toggleCategory}
      />
    </div>
  );
};