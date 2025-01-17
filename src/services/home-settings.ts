import { db } from '@/lib/db';

export const HomeSettingsService = {
  async getCurrent() {
    const result = await db.query(`
      SELECT * FROM home_settings 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    return result.rows[0];
  },

  async update(backgroundUrl: string, backgroundType: string = 'image') {
    const result = await db.query(`
      INSERT INTO home_settings (background_url, background_type)
      VALUES ($1, $2)
      RETURNING *
    `, [backgroundUrl, backgroundType]);
    return result.rows[0];
  }
};