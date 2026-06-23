// frontend/src/pages/CatalogPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams(); // Por si entran desde las categorías del menú de tres puntos
  const searchQuery = searchParams.get('q');
  
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState('Catálogo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const headers = { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` };

    setLoading(true);
    let url = `${SUPABASE_URL}/rest/v1/products?select=*`;

    if (searchQuery) {
      url += `&name=ilike.*${searchQuery}*`;
      setTitle(`Resultados para: "${searchQuery}"`);
    } else if (categoryId) {
      url += `&category_id=eq.${categoryId}`;
      setTitle(`Colección`);
    }

    fetch(url, { headers })
      .then(res => res.json())
      .then(data => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchQuery, categoryId]);

  return (
    <div className="bg-[#121414] text-[#e2e2e2] min-h-screen flex flex-col justify-between font-['Hanken_Grotesk']">
 
      <main className="max-w-[1280px] mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-['EB_Garamond'] text-4xl text-[#c5a059] mb-12 border-b border-[#4e4639]/10 pb-4">{title}</h1>

        {loading ? (
          <p className="text-center py-20 text-sm tracking-wider uppercase animate-pulse">Sincronizando con Supabase...</p>
        ) : products.length === 0 ? (
          <p className="text-center py-20 opacity-40">No se encontraron piezas en esta selección.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col justify-between bg-[#1a1c1c]/40 border border-[#4e4639]/10 p-4 rounded-xl">
                <div className="aspect-[4/5] bg-[#1a1c1c] overflow-hidden rounded-lg relative mb-4">
                  <img src={product.image_url} alt={product.alt_text} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="font-['EB_Garamond'] text-2xl text-[#e2e2e2] truncate">{product.name}</h3>
                  <p className="text-[#c5a059] text-sm font-medium mt-1">${product.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full mt-4 py-3 bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#c5a059] hover:text-[#121414] transition-all"
                >
                  Quick Add
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}