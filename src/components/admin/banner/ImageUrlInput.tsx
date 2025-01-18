import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUrlInputProps {
  imageUrl: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUrlInput = ({ imageUrl, onUrlChange }: ImageUrlInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="imageUrl">URL de l'image</Label>
      <Input
        id="imageUrl"
        type="url"
        value={imageUrl}
        onChange={onUrlChange}
        placeholder="https://example.com/image.jpg"
      />
    </div>
  );
};