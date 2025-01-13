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
    'INSERT INTO articles (title, content, image_url, category_id, sub_category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, content, imageUrl, categoryId, subCategoryId]
  );
  return result.rows[0];
};

// Opérations pour les catégories
export const getCategories = async () => {
  const result = await pool.query('SELECT * FROM categories');
  return result.rows;
};

export const createCategory = async (name: string) => {
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

// Opérations pour les sous-catégories
export const getSubCategories = async (categoryId: number) => {
  const result = await pool.query('SELECT * FROM sub_categories WHERE category_id = $1', [categoryId]);
  return result.rows;
};

export const createSubCategory = async (name: string, categoryId: number) => {
  const result = await pool.query(
    'INSERT INTO sub_categories (name, category_id) VALUES ($1, $2) RETURNING *',
    [name, categoryId]
  );
  return result.rows[0];
};