import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CategorySectionProps {
  setValue: UseFormSetValue<ArticleFormData>;
  initialSubcategoryId?: string;
}

export const CategorySection = ({ setValue, initialSubcategoryId }: CategorySectionProps) => {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data, error } = await supabase
          .from("subcategories")
          .select(`
            id,
            name,
            categories (
              id,
              name
            )
          `)
          .order('name', { ascending: true });

        if (error) throw error;

        console.log("Fetched subcategories:", data);
        setSubcategories(data || []);
        
        // If there's an initial value, set it
        if (initialSubcategoryId && data?.some(subcat => subcat.id === initialSubcategoryId)) {
          setValue("subcategory_id", initialSubcategoryId);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les sous-catégories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [toast, setValue, initialSubcategoryId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : subcategories.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Aucune sous-catégorie disponible
          </div>
        ) : (
          <Select
            onValueChange={(value) => {
              console.log("Selected subcategory:", value);
              setValue("subcategory_id", value);
            }}
            defaultValue={initialSubcategoryId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat.id} value={subcat.id}>
                  {subcat.name} ({subcat.categories?.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
};