import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { ArticleFormData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SEOSectionProps {
  register: UseFormRegister<ArticleFormData>;
}

export const SEOSection = ({ register }: SEOSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input id="meta_title" {...register("meta_title")} />
          <p className="text-sm text-gray-500">
            Recommandé: 50-60 caractères
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            {...register("meta_description")}
            rows={3}
          />
          <p className="text-sm text-gray-500">
            Recommandé: 150-160 caractères
          </p>
        </div>
      </CardContent>
    </Card>
  );
};