import { Pool } from 'pg';
import mysql from 'mysql2/promise';

// Configuration PostgreSQL (Supabase) - gardée pour référence
const pgPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'car_magazine',
  password: 'postgres',
  port: 5432,
});

// Nouvelle configuration MySQL
const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // remplacez par votre nom d'utilisateur MySQL
  password: '',      // remplacez par votre mot de passe MySQL
  database: 'car_magazine',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportez la connexion MySQL par défaut
export default mysqlPool;

// Gardez l'ancienne connexion disponible si nécessaire
export { pgPool };