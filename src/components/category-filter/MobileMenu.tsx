import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

interface MobileMenuProps {
  categories: string[];
  selectedCategory: string | null;
  activeSubcategory: string | null;
  subcategories: Record<string, any[]>;
  expandedCategories: string[];
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onCategoryClick: (category: string | null) => void;
  onSubcategoryClick: (subcategoryId: string, category: string, event: React.MouseEvent) => void;
  toggleCategory: (category: string) => void;
}

export const MobileMenu = ({
  categories,
  selectedCategory,
  activeSubcategory,
  subcategories,
  expandedCategories,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onCategoryClick,
  onSubcategoryClick,
  toggleCategory,
}: MobileMenuProps) => {
  const allCategories = ["Tout", ...categories];

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-magazine-black text-white hover:bg-magazine-red"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] bg-white p-0 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b bg-magazine-black text-white">
          <h2 className="font-bold text-lg">Catégories</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:bg-magazine-red text-white rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            {allCategories.map((category) => (
              <div key={category} className="border-b border-gray-100">
                <button
                  onClick={() => onCategoryClick(category === "Tout" ? null : category)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                    ((category === "Tout" && !selectedCategory) || 
                    (selectedCategory === category && !activeSubcategory))
                      ? "text-magazine-red"
                      : "text-gray-800"
                  } ${subcategories[category]?.length ? "cursor-pointer" : ""}`}
                >
                  <span className="font-medium">{category}</span>
                  {category !== "Tout" && subcategories[category]?.length > 0 && (
                    expandedCategories.includes(category) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </button>
                
                {category !== "Tout" && subcategories[category] && expandedCategories.includes(category) && (
                  <div className="bg-gray-50">
                    {subcategories[category].map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={(e) => onSubcategoryClick(subcategory.id, category, e)}
                        className="w-full text-left px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-magazine-red"
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};