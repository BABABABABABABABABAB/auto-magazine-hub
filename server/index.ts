import express from 'express';
import cors from 'cors';
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from './db/operations';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes pour les articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await getArticleById(parseInt(req.params.id));
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Article non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, imageUrl, categoryId, subCategoryId } = req.body;
    const newArticle = await createArticle(title, content, imageUrl, categoryId, subCategoryId);
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
    const { title, content, imageUrl, categoryId, subCategoryId } = req.body;
    const updatedArticle = await updateArticle(parseInt(req.params.id), title, content, imageUrl, categoryId, subCategoryId);
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    await deleteArticle(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});