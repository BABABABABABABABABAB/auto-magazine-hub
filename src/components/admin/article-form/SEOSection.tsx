import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { ArticleFormData } from "./types";

interface SEOSectionProps {
  register: UseFormRegister<ArticleFormData>;
}

export const SEOSection = ({ register }: SEOSectionProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-4">Options SEO</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Slug</label>
          <Input {...register("slug")} required />
        </div>

        <div>
          <label className="text-sm font-medium">Meta Title</label>
          <Input {...register("meta_title")} />
          <p className="text-sm text-gray-500 mt-1">
            Recommandé: 50-60 caractères
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Meta Description</label>
          <Textarea {...register("meta_description")} rows={3} />
          <p className="text-sm text-gray-500 mt-1">
            Recommandé: 150-160 caractères
          </p>
        </div>
      </div>
    </div>
  );
};