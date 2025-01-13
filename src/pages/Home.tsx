import { CategoryFilter } from "@/components/CategoryFilter";
import { ArticleGrid } from "@/components/ArticleGrid";
import { useState } from "react";

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "La nouvelle Tesla Model S 2024",
    imageUrl: "/placeholder.svg",
    category: "Électrique"
  },
  {
    id: 2,
    title: "BMW M4 Competition : Test complet",
    imageUrl: "/placeholder.svg",
    category: "Sport"
  },
  {
    id: 3,
    title: "Guide d'achat : Les meilleurs SUV 2024",
    imageUrl: "/placeholder.svg",
    category: "SUV"
  }
];

const CATEGORIES = ["Électrique", "Sport", "SUV", "Luxe", "Familiale"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? MOCK_ARTICLES.filter(article => article.category === selectedCategory)
    : MOCK_ARTICLES;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-magazine-black mb-4 font-roboto">
          Auto Magazine
        </h1>
        <p className="text-magazine-gray text-lg md:text-xl mb-8">
          L'actualité automobile en un clic
        </p>
      </header>
      
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <div className="mt-12">
        <ArticleGrid articles={filteredArticles} />
      </div>
    </div>
  );
};

export default Home;