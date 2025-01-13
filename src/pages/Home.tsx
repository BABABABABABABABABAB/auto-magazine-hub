import { useState } from "react";
import { ArticleGrid } from "@/components/ArticleGrid";
import { CategoryFilter } from "@/components/CategoryFilter";

// Données temporaires pour la démonstration
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
    <div className="min-h-screen bg-white">
      <header className="bg-magazine-black text-white py-8">
        <div className="container mx-auto text-center">
          <h1 className="font-roboto text-4xl font-bold mb-4">Auto Magazine</h1>
          <p className="text-magazine-gray">
            L'actualité automobile en temps réel
          </p>
        </div>
      </header>
      <main className="container mx-auto">
        <CategoryFilter
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ArticleGrid articles={filteredArticles} />
      </main>
    </div>
  );
};

export default Home;