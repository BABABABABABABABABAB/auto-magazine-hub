import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
      return;
    }

    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("categories")
      .insert([newCategory])
      .select();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Catégorie créée avec succès",
    });

    setNewCategory({ name: "", slug: "" });
    fetchCategories();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Catégorie supprimée avec succès",
    });

    fetchCategories();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <label htmlFor="categoryName" className="text-sm font-medium">
            Nom de la catégorie
          </label>
          <Input
            id="categoryName"
            placeholder="Nom de la catégorie"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            required
            className="w-full"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="categorySlug" className="text-sm font-medium">
            Slug
          </label>
          <Input
            id="categorySlug"
            placeholder="Slug"
            value={newCategory.slug}
            onChange={(e) =>
              setNewCategory({ ...newCategory, slug: e.target.value })
            }
            required
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Ajouter une catégorie
        </Button>
      </form>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="w-full sm:w-auto"
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};