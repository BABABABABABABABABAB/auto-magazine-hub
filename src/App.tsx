import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NewArticle from "./pages/NewArticle";
import EditArticle from "./pages/EditArticle";
import Article from "./pages/Article";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/nouvel-article" element={<NewArticle />} />
          <Route path="/admin/articles/:id/edit" element={<EditArticle />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;