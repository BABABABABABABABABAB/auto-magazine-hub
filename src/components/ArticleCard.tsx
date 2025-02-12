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
  isCompact?: boolean;
}

export const ArticleCard = ({ 
  id, 
  title, 
  imageUrl, 
  category, 
  subcategory, 
  createdAt,
  isCompact = false 
}: ArticleCardProps) => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const articleUrl = `/article/${id}${categoryParam ? `?category=${categoryParam}` : ''}`;

  return (
    <Link to={articleUrl} className="h-full block">
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader className="p-0 flex-none">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full object-cover rounded-t-lg ${isCompact ? 'h-32' : 'h-48'}`}
          />
        </CardHeader>
        <CardContent className={`p-4 ${isCompact ? 'space-y-1' : 'space-y-2'} flex-grow flex flex-col justify-between`}>
          <div>
            <div className="text-magazine-red text-sm font-medium flex gap-2">
              <span>{category}</span>
              <span>•</span>
              <span>{subcategory}</span>
            </div>
            <h3 className={`font-roboto font-bold text-magazine-black ${isCompact ? 'text-sm line-clamp-2' : 'text-lg'}`}>
              {title}
            </h3>
          </div>
          {createdAt && (
            <p className={`text-magazine-black font-medium ${isCompact ? 'text-sm' : 'text-base'}`}>
              {format(new Date(createdAt), "d MMMM yyyy", { locale: fr })}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};