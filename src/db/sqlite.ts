// Simulation d'une base de données en mémoire pour le navigateur
let inMemoryDb = {
  articles: [],
  categories: [],
  subcategories: [],
  home_settings: []
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Fonctions CRUD pour les articles
export const articles = {
  findAll: async () => {
    return inMemoryDb.articles;
  },
  findOne: async (id: string) => {
    return inMemoryDb.articles.find(article => article.id === id);
  },
  findLatest: async () => {
    return inMemoryDb.articles[inMemoryDb.articles.length - 1];
  },
  create: async (data: any) => {
    const id = generateUUID();
    const article = { id, ...data, created_at: new Date(), updated_at: new Date() };
    inMemoryDb.articles.push(article);
    return article;
  },
  update: async (id: string, data: any) => {
    const index = inMemoryDb.articles.findIndex(article => article.id === id);
    if (index === -1) throw new Error('Article not found');
    inMemoryDb.articles[index] = { ...inMemoryDb.articles[index], ...data, updated_at: new Date() };
    return inMemoryDb.articles[index];
  },
  delete: async (id: string) => {
    inMemoryDb.articles = inMemoryDb.articles.filter(article => article.id !== id);
    return true;
  }
};

// Fonctions CRUD pour les catégories
export const categories = {
  findAll: async () => {
    return inMemoryDb.categories;
  },
  create: async (data: any) => {
    const id = generateUUID();
    const category = { id, ...data, created_at: new Date(), updated_at: new Date() };
    inMemoryDb.categories.push(category);
    return category;
  },
  delete: async (id: string) => {
    inMemoryDb.categories = inMemoryDb.categories.filter(category => category.id !== id);
    return true;
  }
};

// Fonctions CRUD pour les sous-catégories
export const subcategories = {
  findAll: async () => {
    return inMemoryDb.subcategories;
  },
  create: async (data: any) => {
    const id = generateUUID();
    const subcategory = { id, ...data, created_at: new Date(), updated_at: new Date() };
    inMemoryDb.subcategories.push(subcategory);
    return subcategory;
  },
  delete: async (id: string) => {
    inMemoryDb.subcategories = inMemoryDb.subcategories.filter(subcategory => subcategory.id !== id);
    return true;
  }
};

// Fonctions CRUD pour les paramètres de la page d'accueil
export const homeSettings = {
  findLatest: async () => {
    return inMemoryDb.home_settings[inMemoryDb.home_settings.length - 1];
  },
  create: async (data: any) => {
    const id = generateUUID();
    const settings = { id, ...data, created_at: new Date(), updated_at: new Date() };
    inMemoryDb.home_settings.push(settings);
    return settings;
  },
  update: async (id: string, data: any) => {
    const index = inMemoryDb.home_settings.findIndex(setting => setting.id === id);
    if (index === -1) throw new Error('Settings not found');
    inMemoryDb.home_settings[index] = { ...inMemoryDb.home_settings[index], ...data, updated_at: new Date() };
    return inMemoryDb.home_settings[index];
  }
};