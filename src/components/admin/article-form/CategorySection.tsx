import { UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CategorySectionProps {
  setValue: UseFormSetValue<ArticleFormData>;
  subcategories: any[];
}

export const CategorySection = ({ setValue, subcategories }: CategorySectionProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [localSubcategories, setLocalSubcategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data, error } = await supabase
          .from("subcategories")
          .select(`*, categories(name)`)
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setLocalSubcategories(data || []);
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
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          onValueChange={(value) => setValue("subcategory_id", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une sous-catégorie" />
          </SelectTrigger>
          <SelectContent>
            {localSubcategories.map((subcat) => (
              <SelectItem key={subcat.id} value={subcat.id}>
                {subcat.name} ({subcat.categories?.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};