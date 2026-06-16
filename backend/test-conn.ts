import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    console.log('DB OK', rows);
  } catch (err) {
    console.error('DB connection error', err);
  } finally {
    await pool.end();
  }
})();
