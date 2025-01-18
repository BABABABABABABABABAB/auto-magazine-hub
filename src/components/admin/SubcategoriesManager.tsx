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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const SubcategoriesManager = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    slug: "",
    category_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

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

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from("subcategories")
      .select(`*, categories(name)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les sous-catégories",
        variant: "destructive",
      });
      return;
    }

    setSubcategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("subcategories")
      .insert([newSubcategory])
      .select();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la sous-catégorie",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Sous-catégorie créée avec succès",
    });

    setNewSubcategory({ name: "", slug: "", category_id: "" });
    fetchSubcategories();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("subcategories").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la sous-catégorie",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Sous-catégorie supprimée avec succès",
    });

    fetchSubcategories();
  };

  return (
    <div className="space-y-6">
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

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.map((subcategory) => (
              <TableRow key={subcategory.id}>
                <TableCell className="font-medium">{subcategory.name}</TableCell>
                <TableCell>{subcategory.slug}</TableCell>
                <TableCell>{subcategory.categories?.name}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(subcategory.id)}
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