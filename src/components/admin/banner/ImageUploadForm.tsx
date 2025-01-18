import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadFormProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadForm = ({ onFileChange }: ImageUploadFormProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="file">Importer une image</Label>
      <Input
        id="file"
        type="file"
        onChange={onFileChange}
        accept="image/*"
        className="cursor-pointer"
      />
    </div>
  );
};