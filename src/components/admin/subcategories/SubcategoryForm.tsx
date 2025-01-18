import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubcategoryFormProps {
  categories: any[];
  onSubmit: (subcategory: { name: string; slug: string; category_id: string }) => void;
}

export const SubcategoryForm = ({ categories, onSubmit }: SubcategoryFormProps) => {
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    slug: "",
    category_id: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newSubcategory);
    setNewSubcategory({ name: "", slug: "", category_id: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="subcategoryName" className="text-sm font-medium">
          Nom de la sous-catégorie
        </label>
        <Input
          id="subcategoryName"
          placeholder="Nom de la sous-catégorie"
          value={newSubcategory.name}
          onChange={(e) =>
            setNewSubcategory({ ...newSubcategory, name: e.target.value })
          }
          required
          className="w-full"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="subcategorySlug" className="text-sm font-medium">
          Slug
        </label>
        <Input
          id="subcategorySlug"
          placeholder="Slug"
          value={newSubcategory.slug}
          onChange={(e) =>
            setNewSubcategory({ ...newSubcategory, slug: e.target.value })
          }
          required
          className="w-full"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="categorySelect" className="text-sm font-medium">
          Catégorie parente
        </label>
        <Select
          value={newSubcategory.category_id}
          onValueChange={(value) =>
            setNewSubcategory({ ...newSubcategory, category_id: value })
          }
        >
          <SelectTrigger id="categorySelect" className="w-full">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Ajouter une sous-catégorie
      </Button>
    </form>
  );
};