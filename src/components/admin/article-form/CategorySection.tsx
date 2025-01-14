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

interface CategorySectionProps {
  setValue: UseFormSetValue<ArticleFormData>;
  subcategories: any[];
}

export const CategorySection = ({ setValue, subcategories }: CategorySectionProps) => {
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