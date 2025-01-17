import pool from './config';

// Opérations pour les articles
export const getArticles = async () => {
  const result = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
  return result.rows;
};

export const getArticleById = async (id: number) => {
  const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
  return result.rows[0];
};

export const createArticle = async (title: string, content: string, imageUrl: string, categoryId: number, subCategoryId: number) => {
  const result = await pool.query(
    'INSERT INTO articles (title, content, featured_image, category_id, subcategory_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, content, imageUrl, categoryId, subCategoryId]
  );
  return result.rows[0];
};

// Opérations pour les catégories
export const getCategories = async () => {
  const result = await pool.query('SELECT * FROM categories');
  return result.rows;
};

export const createCategory = async (name: string, slug: string) => {
  const result = await pool.query(
    'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
    [name, slug]
  );
  return result.rows[0];
};

// Opérations pour les sous-catégories
export const getSubCategories = async (categoryId: number) => {
  const result = await pool.query('SELECT * FROM sub_categories WHERE category_id = $1', [categoryId]);
  return result.rows;
};

export const createSubCategory = async (name: string, slug: string, categoryId: number) => {
  const result = await pool.query(
    'INSERT INTO subcategories (name, slug, category_id) VALUES ($1, $2, $3) RETURNING *',
    [name, slug, categoryId]
  );
  return result.rows[0];
};

// Opérations pour les paramètres de la page d'accueil
export const getHomeSettings = async () => {
  const result = await pool.query('SELECT * FROM home_settings LIMIT 1');
  return result.rows[0];
};

export const updateHomeSettings = async (backgroundType: string, backgroundUrl: string) => {
  const result = await pool.query(
    'UPDATE home_settings SET background_type = $1, background_url = $2, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *',
    [backgroundType, backgroundUrl]
  );
  return result.rows[0];
};