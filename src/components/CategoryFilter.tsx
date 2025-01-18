import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

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
  const [subcategories, setSubcategories] = useState<Record<string, any[]>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select(`*, categories(name)`);

      if (error) {
        console.error("Error fetching subcategories:", error);
        return;
      }

      const grouped = data.reduce((acc: Record<string, any[]>, curr) => {
        const categoryName = curr.categories?.name;
        if (categoryName) {
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(curr);
        }
        return acc;
      }, {});

      setSubcategories(grouped);
    };

    fetchSubcategories();
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubcategoryClick = (subcategoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onSelectSubcategory) {
      onSelectSubcategory(subcategoryId);
      setIsMobileMenuOpen(false);
    }
  };

  const allCategories = ["Tout", ...categories];

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-magazine-black text-white">
        <div className="container mx-auto px-4">
          <ul className="flex items-center h-12">
            {allCategories.map((category) => (
              <li key={category} className="relative group">
                <button
                  onClick={() => onSelectCategory(category === "Tout" ? null : category)}
                  className={`text-sm font-medium px-4 transition-colors flex items-center gap-1 h-12 ${
                    (category === "Tout" && !selectedCategory) || selectedCategory === category
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
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-magazine-red hover:text-white transition-colors"
                          onClick={(e) => handleSubcategoryClick(subcategory.id, e)}
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

      {/* Mobile Navigation */}
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
                    onClick={() => {
                      if (category === "Tout") {
                        onSelectCategory(null);
                        setIsMobileMenuOpen(false);
                      } else if (!subcategories[category]?.length) {
                        onSelectCategory(category);
                        setIsMobileMenuOpen(false);
                      } else {
                        toggleCategory(category);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                      (category === "Tout" && !selectedCategory) || selectedCategory === category
                        ? "text-magazine-red"
                        : "text-gray-800"
                    } hover:bg-gray-50`}
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
                          onClick={(e) => handleSubcategoryClick(subcategory.id, e)}
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
    </div>
  );
};