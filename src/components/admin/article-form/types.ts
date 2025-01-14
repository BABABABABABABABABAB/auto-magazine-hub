export interface ArticleFormData {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  slug: string;
  subcategory_id: string;
  hidden: boolean;
  status?: string;
}