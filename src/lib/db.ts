import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'car_site_1',
  user: 'postgres',
  password: 'postgres'
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};