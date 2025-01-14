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

  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select(`*, categories(name)`);

      if (error) {
        console.error("Error fetching subcategories:", error);
        return;
      }

      // Group subcategories by category
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
    <NavigationMenu className="max-w-full w-full justify-center">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => onSelectCategory(null)}
            className="bg-white text-magazine-black hover:bg-magazine-red hover:text-white transition-colors font-semibold"
          >
            Tous
          </Button>
        </NavigationMenuItem>
        {categories.map((category) => (
          <NavigationMenuItem key={category}>
            <NavigationMenuTrigger
              className={`${
                selectedCategory === category
                  ? "bg-magazine-red text-white"
                  : "bg-white text-magazine-black"
              } hover:bg-magazine-red hover:text-white transition-colors font-semibold`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </NavigationMenuTrigger>
            {subcategories[category] && subcategories[category].length > 0 && (
              <NavigationMenuContent>
                <div className="absolute top-full left-0 w-[200px] rounded-md shadow-lg bg-white border border-gray-100 mt-1 py-2">
                  {subcategories[category].map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-magazine-red hover:text-white transition-colors"
                      onClick={() => {
                        // You can handle subcategory selection here
                        console.log("Selected subcategory:", subcategory.name);
                      }}
                    >
                      {subcategory.name}
                    </Button>
                  ))}
                </div>
              </NavigationMenuContent>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};