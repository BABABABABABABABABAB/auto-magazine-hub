import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ArticleCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  subcategory: string;
  createdAt?: string;
}

export const ArticleCard = ({ id, title, imageUrl, category, subcategory, createdAt }: ArticleCardProps) => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const articleUrl = `/article/${id}${categoryParam ? `?category=${categoryParam}` : ''}`;

  return (
    <Link to={articleUrl}>
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
          <h3 className="font-roboto font-bold text-lg text-magazine-black mb-2">
            {title}
          </h3>
          {createdAt && (
            <p className="text-base text-magazine-black font-medium">
              {format(new Date(createdAt), "d MMMM yyyy", { locale: fr })}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};