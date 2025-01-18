import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "../RichTextEditor";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  uploading,
}: ContentSectionProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contenu de l'article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" {...register("title")} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extrait</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              rows={3}
              placeholder="Un bref résumé de l'article..."
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu</Label>
            <div className="border rounded-lg overflow-hidden">
              <RichTextEditor
                value={watch("content") || ""}
                onChange={(value) => setValue("content", value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured_image">Image à la une</Label>
            <Input
              id="featured_image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {watch("featured_image") && (
              <img
                src={watch("featured_image")}
                alt="Aperçu"
                className="mt-2 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};