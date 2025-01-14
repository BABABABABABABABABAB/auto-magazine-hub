import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight } from "lucide-react";

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
  const [subcategories, setSubcategories] = useState<Record<string, any[]>>({});
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="relative">
      {/* Barre de navigation principale */}
      <nav className="bg-magazine-black text-white py-2 px-4 flex items-center justify-between md:justify-start gap-4">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-magazine-red md:hidden"
        >
          Menu
        </Button>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-6">
            {categories.map((category) => (
              <NavigationMenuItem key={category} className="relative group">
                <button
                  onClick={() => onSelectCategory(category)}
                  className={`text-sm font-medium hover:text-magazine-red transition-colors ${
                    selectedCategory === category ? "text-magazine-red" : "text-white"
                  }`}
                >
                  {category}
                </button>
                
                {subcategories[category] && subcategories[category].length > 0 && (
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                    <div className="bg-white rounded-md shadow-lg min-w-[200px] py-2">
                      {subcategories[category].map((subcategory) => (
                        <button
                          key={subcategory.id}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-magazine-red hover:text-white transition-colors"
                          onClick={() => {
                            console.log("Selected subcategory:", subcategory.name);
                          }}
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full w-64 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Catégories</h2>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="hover:text-magazine-red"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectCategory(category);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                      selectedCategory === category
                        ? "text-magazine-red"
                        : "text-gray-800"
                    }`}
                  >
                    <span>{category}</span>
                    {subcategories[category]?.length > 0 && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {subcategories[category] && (
                    <div className="pl-4 space-y-1">
                      {subcategories[category].map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => {
                            console.log("Selected subcategory:", subcategory.name);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-magazine-red"
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
        </div>
      )}
    </div>
  );
};