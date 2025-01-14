import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ArticleFormData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PublishSectionProps {
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
}

export const PublishSection = ({ watch, setValue }: PublishSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="hidden"
            checked={watch("hidden")}
            onCheckedChange={(checked) => setValue("hidden", checked)}
          />
          <Label htmlFor="hidden">Masquer l'article</Label>
        </div>
      </CardContent>
    </Card>
  );
};