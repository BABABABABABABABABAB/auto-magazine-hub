import { db } from '@/lib/db';

export const SubcategoriesService = {
  async getAll() {
    const result = await db.query(`
      SELECT s.*, c.name as category_name 
      FROM subcategories s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY s.name
    `);
    return result.rows;
  },

  async create(name: string, slug: string, categoryId: string) {
    const result = await db.query(
      'INSERT INTO subcategories (name, slug, category_id) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, categoryId]
    );
    return result.rows[0];
  },

  async delete(id: string) {
    await db.query('DELETE FROM subcategories WHERE id = $1', [id]);
  }
};