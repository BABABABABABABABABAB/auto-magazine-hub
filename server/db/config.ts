import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'car_magazine',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;