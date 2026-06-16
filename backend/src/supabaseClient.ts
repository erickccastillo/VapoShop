import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config(); // Asegura que lea el archivo .env del backend

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Faltan las credenciales de Supabase en el archivo .env del backend");
}

export const supabase = createClient(supabaseUrl, supabaseKey);