import pool from './config';

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connexion à PostgreSQL réussie !');
    
    // Test simple query
    const result = await client.query('SELECT NOW()');
    console.log('Test query result:', result.rows[0]);
    
    client.release();
  } catch (err) {
    console.error('Erreur de connexion à PostgreSQL:', err);
  } finally {
    // Fermer le pool à la fin du test
    await pool.end();
  }
};

// Exécuter le test
testConnection();