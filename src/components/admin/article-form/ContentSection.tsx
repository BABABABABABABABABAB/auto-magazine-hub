import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichTextEditor } from "../RichTextEditor";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";

interface ContentSectionProps {
  register: UseFormRegister<ArticleFormData>;
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
}

export const ContentSection = ({ 
  register, 
  watch, 
  setValue,
  handleImageUpload,
  uploading 
}: ContentSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Titre</label>
        <Input {...register("title")} required />
      </div>

      <div>
        <label className="text-sm font-medium">Extrait</label>
        <Textarea {...register("excerpt")} rows={3} />
      </div>

      <div>
        <label className="text-sm font-medium">Contenu</label>
        <div className="border rounded-md">
          <ScrollArea className="h-[500px] w-full">
            <div className="p-4">
              <RichTextEditor
                value={watch("content") || ""}
                onChange={(value) => setValue("content", value)}
              />
            </div>
          </ScrollArea>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Image à la une</label>
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {watch("featured_image") && (
            <img
              src={watch("featured_image")}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md"
            />
          )}
        </div>
      </div>
    </div>
  );
};