import { ChevronDown } from "lucide-react";

interface DesktopMenuProps {
  categories: string[];
  selectedCategory: string | null;
  activeSubcategory: string | null;
  subcategories: Record<string, any[]>;
  onCategoryClick: (category: string | null) => void;
  onSubcategoryClick: (subcategoryId: string, category: string, event: React.MouseEvent) => void;
}

export const DesktopMenu = ({
  categories,
  selectedCategory,
  activeSubcategory,
  subcategories,
  onCategoryClick,
  onSubcategoryClick,
}: DesktopMenuProps) => {
  const allCategories = ["Tout", ...categories];

  return (
    <nav className="hidden md:block bg-magazine-black text-white">
      <div className="container mx-auto px-4">
        <ul className="flex items-center h-12">
          {allCategories.map((category) => (
            <li key={category} className="relative group">
              <button
                onClick={() => onCategoryClick(category === "Tout" ? null : category)}
                className={`text-sm font-medium px-4 transition-colors flex items-center gap-1 h-12 ${
                  ((category === "Tout" && !selectedCategory) || 
                  (selectedCategory === category && !activeSubcategory))
                    ? "text-magazine-red"
                    : "text-white hover:text-magazine-red"
                }`}
              >
                {category}
                {category !== "Tout" && subcategories[category]?.length > 0 && (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              
              {category !== "Tout" && subcategories[category]?.length > 0 && (
                <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50">
                  <div className="bg-white rounded-md shadow-lg min-w-[200px] py-1">
                    {subcategories[category].map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={(e) => onSubcategoryClick(subcategory.id, category, e)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-magazine-red hover:text-white transition-colors"
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};