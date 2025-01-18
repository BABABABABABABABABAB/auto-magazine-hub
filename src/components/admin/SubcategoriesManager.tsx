import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SubcategoryForm } from "./subcategories/SubcategoryForm";
import { SubcategoriesTable } from "./subcategories/SubcategoriesTable";

export const SubcategoriesManager = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
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

  const handleSubmit = async (newSubcategory) => {
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
    <div className="space-y-8">
      <SubcategoryForm categories={categories} onSubmit={handleSubmit} />
      <SubcategoriesTable subcategories={subcategories} onDelete={handleDelete} />
    </div>
  );
};