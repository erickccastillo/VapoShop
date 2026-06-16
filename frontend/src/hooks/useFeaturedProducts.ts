import { useEffect, useState } from 'react';
import { getFeatured } from '../services/api';
import type { Product } from '../types/Product';

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getFeatured();
        setProducts(data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { products, loading };
};
