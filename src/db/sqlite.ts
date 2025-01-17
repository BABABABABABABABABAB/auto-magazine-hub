import Database from 'better-sqlite3';
import path from 'path';

// Créer une connexion à la base de données SQLite
const db = new Database(path.join(process.cwd(), 'magazine.db'));

// Créer les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    subcategory_id TEXT,
    status TEXT DEFAULT 'draft',
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    preview_token TEXT,
    hidden BOOLEAN DEFAULT FALSE,
    meta_title TEXT,
    meta_description TEXT,
    slug TEXT,
    "order" INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subcategories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS home_settings (
    id TEXT PRIMARY KEY,
    background_type TEXT DEFAULT 'image',
    background_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Fonction utilitaire pour générer un UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Fonctions CRUD pour les articles
export const articles = {
  findAll: () => {
    return db.prepare('SELECT * FROM articles ORDER BY created_at DESC').all();
  },
  findOne: (id: string) => {
    return db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  },
  create: (data: any) => {
    const id = generateUUID();
    const stmt = db.prepare(`
      INSERT INTO articles (id, title, content, excerpt, featured_image, subcategory_id, status, hidden, meta_title, meta_description, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.title, data.content, data.excerpt, data.featured_image, data.subcategory_id, data.status, data.hidden, data.meta_title, data.meta_description, data.slug);
    return { id, ...data };
  },
  update: (id: string, data: any) => {
    const stmt = db.prepare(`
      UPDATE articles 
      SET title = ?, content = ?, excerpt = ?, featured_image = ?, subcategory_id = ?, status = ?, hidden = ?, meta_title = ?, meta_description = ?, slug = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(data.title, data.content, data.excerpt, data.featured_image, data.subcategory_id, data.status, data.hidden, data.meta_title, data.meta_description, data.slug, id);
    return { id, ...data };
  },
  delete: (id: string) => {
    return db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  }
};

// Fonctions CRUD pour les catégories
export const categories = {
  findAll: () => {
    return db.prepare('SELECT * FROM categories ORDER BY name').all();
  },
  create: (data: any) => {
    const id = generateUUID();
    const stmt = db.prepare('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)');
    stmt.run(id, data.name, data.slug);
    return { id, ...data };
  },
  delete: (id: string) => {
    return db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  }
};

// Fonctions CRUD pour les sous-catégories
export const subcategories = {
  findAll: () => {
    return db.prepare(`
      SELECT s.*, c.name as category_name 
      FROM subcategories s 
      LEFT JOIN categories c ON s.category_id = c.id 
      ORDER BY s.name
    `).all();
  },
  create: (data: any) => {
    const id = generateUUID();
    const stmt = db.prepare('INSERT INTO subcategories (id, name, slug, category_id) VALUES (?, ?, ?, ?)');
    stmt.run(id, data.name, data.slug, data.category_id);
    return { id, ...data };
  },
  delete: (id: string) => {
    return db.prepare('DELETE FROM subcategories WHERE id = ?').run(id);
  }
};

// Fonctions CRUD pour les paramètres de la page d'accueil
export const homeSettings = {
  findLatest: () => {
    return db.prepare('SELECT * FROM home_settings ORDER BY created_at DESC LIMIT 1').get();
  },
  create: (data: any) => {
    const id = generateUUID();
    const stmt = db.prepare('INSERT INTO home_settings (id, background_type, background_url) VALUES (?, ?, ?)');
    stmt.run(id, data.background_type, data.background_url);
    return { id, ...data };
  },
  update: (id: string, data: any) => {
    const stmt = db.prepare('UPDATE home_settings SET background_type = ?, background_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(data.background_type, data.background_url, id);
    return { id, ...data };
  }
};

export default db;