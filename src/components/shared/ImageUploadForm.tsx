import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useImageCompression } from "@/hooks/useImageCompression";

interface ImageUploadFormProps {
  onImageUpload: (url: string) => void;
  bucketName: string;
  folderPath: string;
  label?: string;
}

export const ImageUploadForm = ({
  onImageUpload,
  bucketName,
  folderPath,
  label = "Image",
}: ImageUploadFormProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const { uploadImage, uploading } = useImageCompression({
    bucketName,
    folderPath,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      onImageUpload(url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageUpload(url);
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="file-upload">{label}</Label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        <div className="divider">ou</div>

        <div className="space-y-2">
          <Label htmlFor="image-url">URL de l'image</Label>
          <Input
            id="image-url"
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Aperçu"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};