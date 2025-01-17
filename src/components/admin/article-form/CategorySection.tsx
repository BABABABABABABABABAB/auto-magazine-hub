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

interface CategorySectionProps {
  setValue: UseFormSetValue<ArticleFormData>;
}

export const CategorySection = ({ setValue }: CategorySectionProps) => {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data, error } = await supabase
          .from("subcategories")
          .select(`*, categories(name)`)
          .order('name', { ascending: true });

        if (error) throw error;

        setSubcategories(data || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les sous-catégories",
          variant: "destructive",
        });
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
            {subcategories.map((subcat) => (
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