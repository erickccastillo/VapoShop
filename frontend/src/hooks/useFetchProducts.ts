import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import type { Product } from '../types/Product';

type Params = { q?: string; category?: string; page?: number; limit?: number };

export const useFetchProducts = (params: Params) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts(params);
        // Esperamos que el backend devuelva { data: [...], totalProducts, totalPages }
        setProducts(data.data || []);
        setTotalProducts(data.totalProducts || (data.data?.length ?? 0));
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        setError(err.message || 'Error al cargar productos');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [params?.q, params?.category, params?.page, params?.limit]);

  return { products, loading, error, totalProducts, totalPages };
};
