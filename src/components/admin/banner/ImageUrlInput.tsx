interface ImageUrlInputProps {
  imageUrl: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUrlInput = ({ imageUrl, onUrlChange }: ImageUrlInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
        URL de l'image
      </label>
      <input
        type="url"
        id="imageUrl"
        value={imageUrl}
        onChange={onUrlChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-magazine-red focus:border-magazine-red"
        placeholder="https://example.com/image.jpg"
      />
    </div>
  );
};