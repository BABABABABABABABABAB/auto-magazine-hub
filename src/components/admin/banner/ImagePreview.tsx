interface ImagePreviewProps {
  imageUrl?: string;
  file?: File | null;
}

export const ImagePreview = ({ imageUrl, file }: ImagePreviewProps) => {
  if (!imageUrl && !file) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Aperçu</h3>
      <div 
        className="w-full h-[200px] bg-cover bg-center rounded-lg border"
        style={{ 
          backgroundImage: file 
            ? `url(${URL.createObjectURL(file)})` 
            : `url(${imageUrl})`
        }}
      />
    </div>
  );
};