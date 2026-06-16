// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Importamos el cliente de Supabase configurado en tu backend
import { supabase } from './supabaseClient';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// =========================================================================
// RUTA: Obtener las diapositivas del carrusel principal (Hero Slider)
// =========================================================================
app.get('/api/hero-slides', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('id, tag, title, description, price, image_url, alt_text')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    console.error('Error al consultar hero_slides en Supabase:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err?.message });
  }
});

// =========================================================================
// RUTA: Obtener Categorías agrupadas con sus respectivos Productos
// =========================================================================
app.get('/api/categories', async (req, res) => {
  try {
    // Aprovechamos las relaciones de Supabase para traer categorías y sus productos en una sola consulta
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        title,
        products (
          id,
          name,
          price,
          image_url,
          alt_text
        )
      `)
      .order('id', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    console.error('Error al consultar categorías en Supabase:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err?.message });
  }
});

// =========================================================================
// RUTA: Listado general de productos con paginación y filtros
// =========================================================================
app.get('/products', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const search = (req.query.search || '').toString().trim();
    const categoryId = (req.query.category || '').toString().trim().toLowerCase();

    // 1. Construir la query principal de productos
    let query = supabase
      .from('products')
      .select('id, category_id, name, price, image_url, alt_text', { count: 'exact' });

    // Aplicar filtros dinámicos si existen
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (categoryId && categoryId !== 'todos') {
      query = query.eq('category_id', categoryId);
    }

    // Paginación y orden
    const { data, count, error } = await query
      .order('id', { ascending: true })
      .range(from, to);

    if (error) throw error;

    const totalProducts = count || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      data,
      page,
      totalProducts,
      totalPages,
    });
  } catch (err: any) {
    console.error('Error en catálogo de productos en Supabase:', err);
    res.status(500).json({
      error: 'DB_ERROR',
      message: err?.message || 'Error en la base de datos',
    });
  }
});

// Configuración del puerto de escucha
const port = Number(process.env.PORT) || 5000;
const server = app.listen(port, () =>
  console.log(`API escuchando en http://postgres@db.supabase.co:${port}`)
);

process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  server.close();
  process.exit(0);
});