import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { SubcategoriesManager } from "@/components/admin/SubcategoriesManager";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Admin = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-magazine-red text-white p-4 flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Button variant="outline" className="text-white border-white hover:bg-red-600">
            New Article
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-red-600" asChild>
            <Link to="/">View Site</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full container mx-auto p-6">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="articles" className="text-lg">Articles</TabsTrigger>
              <TabsTrigger value="categories" className="text-lg">Category Manager</TabsTrigger>
              <TabsTrigger value="subcategories" className="text-lg">Subcategory Manager</TabsTrigger>
            </TabsList>
            <TabsContent value="articles">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Articles</h2>
                <Button className="bg-magazine-red hover:bg-red-600">New Article</Button>
              </div>
              <ArticlesManager />
            </TabsContent>
            <TabsContent value="categories">
              <CategoriesManager />
            </TabsContent>
            <TabsContent value="subcategories">
              <SubcategoriesManager />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Admin;