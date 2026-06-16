// src/services/api.ts
import axios, { AxiosInstance } from 'axios';

const baseURL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export type ProductsResponse = {
  data: any[];
  page?: number;
  totalPages?: number;
  total?: number;
};


export const getProducts = async (params: { q?: string; category?: string; page?: number; limit?: number }) => {
  const query = new URLSearchParams();
  if (params.q) query.append('search', params.q);
  if (params.category && params.category !== 'TODOS') query.append('category', params.category);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const res = await fetch(`http://localhost:4000/products?${query.toString()}`);
  return res.json();
};

export const getFeatured = async () => {
  const res = await fetch('http://localhost:4000/featured');
  return res.json();
};


export default api;
