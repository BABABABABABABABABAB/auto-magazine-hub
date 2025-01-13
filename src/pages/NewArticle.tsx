import { Button } from "@/components/ui/button";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const NewArticle = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-magazine-red text-white p-4 flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-bold">New Article</h1>
        <Button variant="outline" className="text-white border-white hover:bg-red-600" asChild>
          <Link to="/admin">Back to Admin</Link>
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="container mx-auto py-6">
          <ArticleForm />
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewArticle;