import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { SubcategoriesManager } from "@/components/admin/SubcategoriesManager";
import { BannerManager } from "@/components/admin/BannerManager";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Admin = () => {
  const location = useLocation();
  const isNewArticlePage = location.pathname.includes('nouvel-article');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-magazine-red text-white p-4 flex justify-between items-center shrink-0 sticky top-0 z-50">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Button variant="outline" className="text-white border-white hover:bg-red-600" asChild>
            <Link to="/admin/nouvel-article">Nouvel Article</Link>
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-red-600" asChild>
            <Link to="/">Voir le Site</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        {isNewArticlePage ? (
          <Outlet />
        ) : (
          <ScrollArea className="h-[calc(100vh-5rem)] rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <Tabs defaultValue="articles" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="articles" className="text-lg">Articles</TabsTrigger>
                  <TabsTrigger value="categories" className="text-lg">Catégories</TabsTrigger>
                  <TabsTrigger value="subcategories" className="text-lg">Sous-catégories</TabsTrigger>
                  <TabsTrigger value="banner" className="text-lg">Bannière</TabsTrigger>
                </TabsList>
                
                <TabsContent value="articles" className="mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Articles</h2>
                    <Button className="bg-magazine-red hover:bg-red-600" asChild>
                      <Link to="/admin/nouvel-article">Nouvel Article</Link>
                    </Button>
                  </div>
                  <ArticlesManager />
                </TabsContent>
                
                <TabsContent value="categories" className="mt-6">
                  <CategoriesManager />
                </TabsContent>
                
                <TabsContent value="subcategories" className="mt-6">
                  <SubcategoriesManager />
                </TabsContent>

                <TabsContent value="banner" className="mt-6">
                  <BannerManager />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        )}
      </main>
    </div>
  );
};

export default Admin;