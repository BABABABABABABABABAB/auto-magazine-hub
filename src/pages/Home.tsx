import { useState } from "react";
import { ArticleGrid } from "@/components/ArticleGrid";
import { CategoryFilter } from "@/components/CategoryFilter";

const mockArticles = [
  {
    id: 1,
    title: "La nouvelle BMW M4 Competition",
    imageUrl: "/placeholder.svg",
    category: "Tests",
  },
  {
    id: 2,
    title: "Le futur de l'électrique",
    imageUrl: "/placeholder.svg",
    category: "Innovation",
  },
  {
    id: 3,
    title: "Guide d'achat SUV 2024",
    imageUrl: "/placeholder.svg",
    category: "Guides",
  },
];

const mockCategories = ["Tests", "Innovation", "Guides", "Sport Auto"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? mockArticles.filter((article) => article.category === selectedCategory)
    : mockArticles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <header className="bg-gradient-to-r from-magazine-black to-gray-900 text-white py-12 shadow-xl">
        <div className="container mx-auto text-center px-4">
          <h1 className="font-roboto text-5xl font-bold mb-4 tracking-tight">
            Auto Magazine
          </h1>
          <p className="text-gray-300 text-xl font-light">
            L'actualité automobile en temps réel
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <CategoryFilter
            categories={mockCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        <ArticleGrid articles={filteredArticles} />
      </main>
    </div>
  );
};

export default Home;