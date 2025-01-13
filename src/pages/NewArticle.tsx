import { ArticleForm } from "@/components/admin/ArticleForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NewArticle = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-magazine-red text-white p-4 flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-bold">New Article</h1>
        <Button variant="outline" className="text-white border-white hover:bg-red-600" asChild>
          <Link to="/admin">Back to Dashboard</Link>
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="container mx-auto">
          <ArticleForm />
        </div>
      </div>
    </div>
  );
};

export default NewArticle;