import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategories, createCategory } from "@/db/operations";
import { toast } from "sonner";

export const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie créée avec succès");
      setName("");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de la catégorie");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(name);
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Nom de la catégorie"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit">Créer la catégorie</Button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Catégories existantes</h2>
        <div className="grid gap-4">
          {categories?.map((category: any) => (
            <div key={category.id} className="border p-4 rounded flex justify-between items-center">
              <span>{category.name}</span>
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