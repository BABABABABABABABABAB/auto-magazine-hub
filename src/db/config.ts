import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',      // votre nom d'utilisateur PostgreSQL
  host: 'localhost',     // l'hôte de votre base de données
  database: 'car_magazine', // le nom de la base de données
  password: 'postgres',  // votre mot de passe PostgreSQL
  port: 5432,           // le port par défaut de PostgreSQL
});

export default pool;