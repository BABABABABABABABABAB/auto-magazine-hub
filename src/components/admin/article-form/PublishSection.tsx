import { Switch } from "@/components/ui/switch";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";

interface PublishSectionProps {
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
}

export const PublishSection = ({ watch, setValue }: PublishSectionProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-4">Options de publication</h3>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={watch("hidden")}
          onCheckedChange={(checked) => setValue("hidden", checked)}
        />
        <label className="text-sm font-medium">Masquer l'article</label>
      </div>
    </div>
  );
};