import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories, getSubCategories, createSubCategory } from "@/db/operations";
import { toast } from "sonner";

export const SubCategoryManager = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const { data: subCategories, isLoading } = useQuery({
    queryKey: ["subCategories", categoryId],
    queryFn: () => categoryId ? getSubCategories(parseInt(categoryId)) : Promise.resolve([]),
    enabled: !!categoryId
  });

  const createSubCategoryMutation = useMutation({
    mutationFn: (data: { name: string; categoryId: number }) => 
      createSubCategory(data.name, data.categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
      toast.success("Sous-catégorie créée avec succès");
      setName("");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de la sous-catégorie");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    createSubCategoryMutation.mutate({
      name,
      categoryId: parseInt(categoryId)
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            placeholder="Nom de la sous-catégorie"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit">Créer la sous-catégorie</Button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Sous-catégories existantes</h2>
        <div className="grid gap-4">
          {subCategories?.map((subCategory: any) => (
            <div key={subCategory.id} className="border p-4 rounded flex justify-between items-center">
              <span>{subCategory.name}</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Modifier</Button>
                <Button variant="destructive" size="sm">Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};