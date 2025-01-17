import { pool } from '../config/database';
import { ArticleFormData } from '@/components/admin/article-form/types';

export const DatabaseService = {
  // Articles
  async getArticles() {
    const query = `
      SELECT a.*, s.name as subcategory_name, c.name as category_name 
      FROM articles a
      LEFT JOIN subcategories s ON a.subcategory_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY a.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async getArticleById(id: string) {
    const query = `
      SELECT a.*, s.name as subcategory_name, c.name as category_name 
      FROM articles a
      LEFT JOIN subcategories s ON a.subcategory_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE a.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async createArticle(article: ArticleFormData) {
    const query = `
      INSERT INTO articles (
        title, content, excerpt, featured_image, 
        subcategory_id, status, hidden, meta_title, 
        meta_description, slug
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      article.title,
      article.content,
      article.excerpt,
      article.featured_image,
      article.subcategory_id,
      article.status,
      article.hidden,
      article.meta_title,
      article.meta_description,
      article.slug
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async updateArticle(id: string, article: ArticleFormData) {
    const query = `
      UPDATE articles SET
        title = $1, content = $2, excerpt = $3,
        featured_image = $4, subcategory_id = $5,
        status = $6, hidden = $7, meta_title = $8,
        meta_description = $9, slug = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `;
    const values = [
      article.title,
      article.content,
      article.excerpt,
      article.featured_image,
      article.subcategory_id,
      article.status,
      article.hidden,
      article.meta_title,
      article.meta_description,
      article.slug,
      id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async deleteArticle(id: string) {
    const query = 'DELETE FROM articles WHERE id = $1';
    await pool.query(query, [id]);
  },

  // Categories
  async getCategories() {
    const query = 'SELECT * FROM categories ORDER BY name';
    const { rows } = await pool.query(query);
    return rows;
  },

  async createCategory(name: string, slug: string) {
    const query = 'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(query, [name, slug]);
    return rows[0];
  },

  async deleteCategory(id: string) {
    const query = 'DELETE FROM categories WHERE id = $1';
    await pool.query(query, [id]);
  },

  // Subcategories
  async getSubcategories() {
    const query = `
      SELECT s.*, c.name as category_name 
      FROM subcategories s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY s.name
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async createSubcategory(name: string, slug: string, categoryId: string) {
    const query = `
      INSERT INTO subcategories (name, slug, category_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, slug, categoryId]);
    return rows[0];
  },

  async deleteSubcategory(id: string) {
    const query = 'DELETE FROM subcategories WHERE id = $1';
    await pool.query(query, [id]);
  },

  // Home Settings
  async getHomeSettings() {
    const query = `
      SELECT * FROM home_settings 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const { rows } = await pool.query(query);
    return rows[0];
  },

  async updateHomeSettings(backgroundUrl: string, backgroundType: string = 'image') {
    const query = `
      INSERT INTO home_settings (background_url, background_type)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [backgroundUrl, backgroundType]);
    return rows[0];
  }
};