import pool from './config';

// Opérations sur les articles
export const getArticles = async () => {
  const result = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
  return result.rows;
};

export const getArticleById = async (id: number) => {
  const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
  return result.rows[0];
};

export const createArticle = async (
  title: string,
  content: string,
  imageUrl: string,
  categoryId: number,
  subCategoryId: number
) => {
  const result = await pool.query(
    'INSERT INTO articles (title, content, image_url, category_id, sub_category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, content, imageUrl, categoryId, subCategoryId]
  );
  return result.rows[0];
};

export const updateArticle = async (
  id: number,
  title: string,
  content: string,
  imageUrl: string,
  categoryId: number,
  subCategoryId: number
) => {
  const result = await pool.query(
    'UPDATE articles SET title = $1, content = $2, image_url = $3, category_id = $4, sub_category_id = $5 WHERE id = $6 RETURNING *',
    [title, content, imageUrl, categoryId, subCategoryId, id]
  );
  return result.rows[0];
};

export const deleteArticle = async (id: number) => {
  await pool.query('DELETE FROM articles WHERE id = $1', [id]);
};

// Opérations sur les catégories
export const getCategories = async () => {
  const result = await pool.query('SELECT * FROM categories ORDER BY name');
  return result.rows;
};

export const createCategory = async (name: string) => {
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

export const updateCategory = async (id: number, name: string) => {
  const result = await pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
};

export const deleteCategory = async (id: number) => {
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
};

// Opérations sur les sous-catégories
export const getSubCategories = async () => {
  const result = await pool.query('SELECT * FROM sub_categories ORDER BY name');
  return result.rows;
};

export const createSubCategory = async (name: string, categoryId: number) => {
  const result = await pool.query(
    'INSERT INTO sub_categories (name, category_id) VALUES ($1, $2) RETURNING *',
    [name, categoryId]
  );
  return result.rows[0];
};

export const updateSubCategory = async (id: number, name: string, categoryId: number) => {
  const result = await pool.query(
    'UPDATE sub_categories SET name = $1, category_id = $2 WHERE id = $3 RETURNING *',
    [name, categoryId, id]
  );
  return result.rows[0];
};

export const deleteSubCategory = async (id: number) => {
  await pool.query('DELETE FROM sub_categories WHERE id = $1', [id]);
};