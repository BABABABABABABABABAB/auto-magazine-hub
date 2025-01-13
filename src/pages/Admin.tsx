import { useState } from "react";
import { ArticleManager } from "@/components/admin/ArticleManager";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SubCategoryManager } from "@/components/admin/SubCategoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panneau d'administration</h1>
      
      <Tabs defaultValue="articles" className="w-full">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="subcategories">Sous-catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <ArticleManager />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="subcategories">
          <SubCategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;