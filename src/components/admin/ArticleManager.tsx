import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getArticles, createArticle } from "@/db/operations";
import { toast } from "sonner";

export const ArticleManager = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles
  });

  const createArticleMutation = useMutation({
    mutationFn: (newArticle: { title: string; content: string; imageUrl: string; categoryId: number; subCategoryId: number }) =>
      createArticle(newArticle.title, newArticle.content, newArticle.imageUrl, newArticle.categoryId, newArticle.subCategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article créé avec succès");
      setTitle("");
      setContent("");
      setImageUrl("");
      setCategoryId("");
      setSubCategoryId("");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'article");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createArticleMutation.mutate({
      title,
      content,
      imageUrl,
      categoryId: parseInt(categoryId),
      subCategoryId: parseInt(subCategoryId)
    });
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Titre de l'article"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Textarea
            placeholder="Contenu de l'article"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="URL de l'image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {/* Les catégories seront ajoutées dynamiquement */}
              <SelectItem value="1">Catégorie 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={subCategoryId} onValueChange={setSubCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {/* Les sous-catégories seront ajoutées dynamiquement */}
              <SelectItem value="1">Sous-catégorie 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Créer l'article</Button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Articles existants</h2>
        <div className="grid gap-4">
          {articles?.map((article: any) => (
            <div key={article.id} className="border p-4 rounded">
              <h3 className="font-bold">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.content.substring(0, 100)}...</p>
              <div className="mt-2 space-x-2">
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