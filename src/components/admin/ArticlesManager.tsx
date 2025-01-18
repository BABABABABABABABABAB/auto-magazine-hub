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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const ArticlesManager = () => {
  const [articles, setArticles] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select(`*, subcategories(name, category:categories(name))`)
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

  const handleEdit = (id) => {
    navigate(`/admin/articles/${id}/edit`);
  };

  const toggleHidden = async (id, currentValue) => {
    const { error } = await supabase
      .from("articles")
      .update({ hidden: !currentValue })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'article",
        variant: "destructive",
      });
      return;
    }

    fetchArticles();
  };

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hidden</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>{article.title}</TableCell>
              <TableCell>
                {article.subcategories?.category?.name} / {article.subcategories?.name}
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  {article.status || "draft"}
                </span>
              </TableCell>
              <TableCell>
                <Switch
                  checked={article.hidden}
                  onCheckedChange={() => toggleHidden(article.id, article.hidden)}
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(article.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};