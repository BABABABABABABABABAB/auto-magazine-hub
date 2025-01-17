import { db } from '@/lib/db';

export const ArticlesService = {
  async getAll() {
    const result = await db.query(`
      SELECT a.*, s.name as subcategory_name 
      FROM articles a
      LEFT JOIN subcategories s ON a.subcategory_id = s.id
      ORDER BY a.created_at DESC
    `);
    return result.rows;
  },

  async getById(id: string) {
    const result = await db.query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create(article: any) {
    const result = await db.query(`
      INSERT INTO articles (
        title, content, excerpt, featured_image, 
        subcategory_id, status, hidden, meta_title, 
        meta_description, slug
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
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
    ]);
    return result.rows[0];
  },

  async update(id: string, article: any) {
    const result = await db.query(`
      UPDATE articles 
      SET title = $1, content = $2, excerpt = $3,
          featured_image = $4, subcategory_id = $5,
          status = $6, hidden = $7, meta_title = $8,
          meta_description = $9, slug = $10
      WHERE id = $11
      RETURNING *
    `, [
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
    ]);
    return result.rows[0];
  },

  async delete(id: string) {
    await db.query('DELETE FROM articles WHERE id = $1', [id]);
  }
};