import pool from './config';
import fs from 'fs';
import path from 'path';

const initDatabase = async () => {
  try {
    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Exécuter les requêtes SQL
    await pool.query(sqlContent);
    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};

export default initDatabase;