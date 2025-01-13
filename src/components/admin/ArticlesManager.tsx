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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const ArticlesManager = () => {
  const [articles, setArticles] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    featured_image: "",
    subcategory_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .order("name", { ascending: true });

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

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select(`*, subcategories(name)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
      return;
    }

    setArticles(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("articles")
      .insert([newArticle])
      .select();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Article créé avec succès",
    });

    setNewArticle({ title: "", content: "", featured_image: "", subcategory_id: "" });
    fetchArticles();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Article supprimé avec succès",
    });

    fetchArticles();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Titre"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
          required
        />
        <Textarea
          placeholder="Contenu"
          value={newArticle.content}
          onChange={(e) =>
            setNewArticle({ ...newArticle, content: e.target.value })
          }
          required
        />
        <Input
          placeholder="URL de l'image"
          value={newArticle.featured_image}
          onChange={(e) =>
            setNewArticle({ ...newArticle, featured_image: e.target.value })
          }
          required
        />
        <Select
          value={newArticle.subcategory_id}
          onValueChange={(value) =>
            setNewArticle({ ...newArticle, subcategory_id: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une sous-catégorie" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Ajouter un article</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Sous-catégorie</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.subcategories?.name}</TableCell>
              <TableCell>
                {new Date(article.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(article.id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};