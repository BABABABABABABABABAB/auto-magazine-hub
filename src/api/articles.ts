import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchArticles = async () => {
  const response = await axios.get(`${API_URL}/articles`);
  return response.data;
};

export const fetchArticleById = async (id: number) => {
  const response = await axios.get(`${API_URL}/articles/${id}`);
  return response.data;
};

export const createArticle = async (articleData: any) => {
  const response = await axios.post(`${API_URL}/articles`, articleData);
  return response.data;
};

export const updateArticle = async (id: number, articleData: any) => {
  const response = await axios.put(`${API_URL}/articles/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id: number) => {
  await axios.delete(`${API_URL}/articles/${id}`);
};