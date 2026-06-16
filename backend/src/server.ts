// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { pool } from './db';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').toString().trim();
    const category = (req.query.category || '').toString().trim().toUpperCase();

    // Base SQL y parámetros
    let sql = 'SELECT * FROM products';
    let countSql = 'SELECT COUNT(*) FROM products';
    const params: any[] = [];
    const countParams: any[] = [];

    // Construir condiciones dinámicas
    const conditions: string[] = [];

    if (search) {
      conditions.push(`name ILIKE $${params.length + 1}`);
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    if (category && category !== 'TODOS') {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
      countParams.push(category);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
      countSql += ' WHERE ' + conditions.join(' AND ');
    }

    // Añadir orden, límite y offset
    const limitPlaceholderIndex = params.length + 1;
    const offsetPlaceholderIndex = params.length + 2;

    sql += ` ORDER BY id LIMIT $${limitPlaceholderIndex} OFFSET $${offsetPlaceholderIndex}`;
    params.push(limit, offset);

    console.log('SQL:', sql, 'params:', params);

    // Consulta de productos
    const { rows } = await pool.query(sql, params);

    
    const countResult = await pool.query(countSql, countParams);
    const totalProducts = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalProducts / limit);
    console.log('Resultados de la consulta:', rows);
    res.json({
      data: rows,
      page,
      totalProducts,
      totalPages,
    });
  } catch (err: any) {
    console.error('DB query error', err);
    res.status(500).json({
      error: 'DB_ERROR',
      message: err?.message || 'Error en la base de datos',
    });
  }
});

const port = Number(process.env.PORT) || 4000;
const server = app.listen(port, () =>
  console.log(`API escuchando en http://localhost:${port}`)
);

process.on('SIGINT', async () => {
  console.log('Cerrando servidor y pool...');
  server.close();
  await pool.end();
  process.exit(0);
});

app.get('/featured', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, description, image, category FROM products WHERE featured = true ORDER BY id LIMIT 6'
    );
    res.json({ data: rows });
  } catch (err: any) {
    console.error('DB query error', err);
    res.status(500).json({ error: 'DB_ERROR', message: err?.message });
  }
});
