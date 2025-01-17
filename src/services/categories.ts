import { db } from '@/lib/db';

export const CategoriesService = {
  async getAll() {
    const result = await db.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  },

  async create(name: string, slug: string) {
    const result = await db.query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );
    return result.rows[0];
  },

  async delete(id: string) {
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
  }
};