import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";

interface CategorySectionProps {
  setValue: UseFormSetValue<ArticleFormData>;
  subcategories: any[];
}

export const CategorySection = ({ setValue, subcategories }: CategorySectionProps) => {
  return (
    <div>
      <label className="text-sm font-medium">Sous-catégorie</label>
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
    </div>
  );
};