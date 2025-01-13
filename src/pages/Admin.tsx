import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { SubcategoriesManager } from "@/components/admin/SubcategoriesManager";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!session) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="subcategories">Sous-catégories</TabsTrigger>
        </TabsList>
        <TabsContent value="articles">
          <ArticlesManager />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesManager />
        </TabsContent>
        <TabsContent value="subcategories">
          <SubcategoriesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;