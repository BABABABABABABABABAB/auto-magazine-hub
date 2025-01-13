import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

export const ArticleCard = ({ id, title, imageUrl, category }: ArticleCardProps) => {
  return (
    <Link to={`/article/${id}`}>
      <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="p-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-56 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="p-6">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-magazine-red rounded-full mb-4">
            {category}
          </span>
          <h3 className="font-roboto font-bold text-xl text-magazine-black hover:text-magazine-red transition-colors duration-200">
            {title}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
};