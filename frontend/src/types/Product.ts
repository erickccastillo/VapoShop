export type Product = {
  id: number;             // en la DB es número
  name: string;
  description?: string;
  price: string;          // Postgres devuelve numeric como string
  image?: string;
  stock?: number;
  category: string;       // nueva columna en la DB
  created_at?: string;    // fechas como string ISO
  updated_at?: string;
};

/**
 * Respuesta esperada del backend para /products
 * Esto te permite tipar correctamente el hook useFetchProducts
 */
export type ProductResponse = {
  data: Product[];        // lista de productos
  totalProducts: number;  // total de productos en la DB
  totalPages: number;     // total de páginas (si usas paginación)
  page: number;           // página actual
};
