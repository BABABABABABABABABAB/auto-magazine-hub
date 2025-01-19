import { useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  bucketName: string;
  folderPath: string;
}

export const useImageCompression = ({
  maxSizeMB = 0.03,
  maxWidthOrHeight = 1920,
  bucketName,
  folderPath,
}: UseImageCompressionOptions) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
      fileType: 'image/webp',
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const compressedFile = await compressImage(file);
      const fileName = `${Math.random()}.webp`;
      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, compressedFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
  };
};