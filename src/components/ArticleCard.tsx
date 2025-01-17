import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  subcategory: string;
}

export const ArticleCard = ({ id, title, imageUrl, category, subcategory }: ArticleCardProps) => {
  return (
    <Link to={`/article/${id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-magazine-red text-sm font-medium mb-2 flex gap-2">
            <span>{category}</span>
            <span>•</span>
            <span>{subcategory}</span>
          </div>
          <h3 className="font-roboto font-bold text-lg text-magazine-black">
            {title}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
};