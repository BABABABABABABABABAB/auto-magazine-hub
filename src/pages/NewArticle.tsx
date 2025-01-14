import { ArticleForm } from "@/components/admin/ArticleForm";

const NewArticle = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6">Nouvel Article</h2>
      <ArticleForm />
    </div>
  );
};

export default NewArticle;