import { Button } from "@/components/ui/button";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Link } from "react-router-dom";

const NewArticle = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-magazine-red text-white p-4 flex justify-between items-center shrink-0 sticky top-0 z-50">
        <h1 className="text-3xl font-bold">Nouvel Article</h1>
        <Button variant="outline" className="text-white border-white hover:bg-red-600" asChild>
          <Link to="/admin">Retour à l'admin</Link>
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <ArticleForm />
        </div>
      </main>
    </div>
  );
};

export default NewArticle;