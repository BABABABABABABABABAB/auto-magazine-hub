import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { SubcategoriesManager } from "@/components/admin/SubcategoriesManager";
import { BannerManager } from "@/components/admin/BannerManager";
import { VerticalBannerManager } from "@/components/admin/VerticalBannerManager";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Admin = () => {
  const location = useLocation();
  const isNewArticlePage = location.pathname.includes('nouvel-article');

  return (
    <div className="min-h-screen flex flex-col bg-magazine-red">
      <header className="bg-magazine-red text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 sticky top-0 z-50">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="bg-white text-magazine-red hover:bg-gray-100 whitespace-nowrap" asChild>
            <Link to="/admin/nouvel-article">Nouvel Article</Link>
          </Button>
          <Button variant="outline" className="bg-white text-magazine-red hover:bg-gray-100 whitespace-nowrap" asChild>
            <Link to="/">Voir le Site</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 sm:p-6">
        {isNewArticlePage ? (
          <Outlet />
        ) : (
          <ScrollArea className="h-[calc(100vh-5rem)] rounded-lg border bg-white shadow-sm">
            <div className="p-4 sm:p-6">
              <Tabs defaultValue="articles" className="w-full">
                <TabsList className="mb-8 flex flex-wrap gap-2">
                  <TabsTrigger value="articles" className="text-lg">Articles</TabsTrigger>
                  <TabsTrigger value="categories" className="text-lg">Catégories</TabsTrigger>
                  <TabsTrigger value="subcategories" className="text-lg">Sous-catégories</TabsTrigger>
                  <TabsTrigger value="banner" className="text-lg">Bannière</TabsTrigger>
                  <TabsTrigger value="vertical-banner" className="text-lg">Bannière Verticale</TabsTrigger>
                </TabsList>
                
                <TabsContent value="articles" className="mt-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Articles</h2>
                    <Button className="bg-magazine-red text-white hover:bg-magazine-red/90" asChild>
                      <Link to="/admin/nouvel-article">Nouvel Article</Link>
                    </Button>
                  </div>
                  <ArticlesManager />
                </TabsContent>
                
                <TabsContent value="categories" className="mt-8">
                  <div className="grid grid-cols-1 gap-12">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6">Catégories</h2>
                      <CategoriesManager />
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6">Sous-catégories</h2>
                      <SubcategoriesManager />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="subcategories" className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Sous-catégories</h2>
                  <SubcategoriesManager />
                </TabsContent>

                <TabsContent value="banner" className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Bannière</h2>
                  <BannerManager />
                </TabsContent>

                <TabsContent value="vertical-banner" className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Bannière Verticale</h2>
                  <VerticalBannerManager />
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