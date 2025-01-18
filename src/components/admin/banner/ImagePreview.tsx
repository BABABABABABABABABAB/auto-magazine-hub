interface ImagePreviewProps {
  imageUrl: string;
  file: File | null;
}

export const ImagePreview = ({ imageUrl, file }: ImagePreviewProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : imageUrl;

  return previewUrl ? (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Aperçu
      </label>
      <div className="w-full h-[200px] border border-gray-300 rounded-md overflow-hidden">
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ) : null;
};