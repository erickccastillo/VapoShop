// frontend/src/pages/CatalogPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  alt_text: string;
  category_id?: string;
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q');
  
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('Catálogo de Piezas');
  const [subtitle, setSubtitle] = useState('Colección premium forjada a mano para el ritual diario.');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inyectar fuentes tipográficas sofisticadas dinámicamente si no existen
    if (!document.getElementById('glass-therapy-fonts')) {
      const linkFonts = document.createElement("link");
      linkFonts.id = "glass-therapy-fonts";
      linkFonts.href = "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Hanken+Grotesk:wght@300;400;500;600;700&family=Oswald:wght@400;700&display=swap";
      linkFonts.rel = "stylesheet";
      document.head.appendChild(linkFonts);
    }

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const headers = { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` };

    setLoading(true);
    let url = `${SUPABASE_URL}/rest/v1/products?select=*`;

    if (searchQuery) {
      url += `&name=ilike.*${searchQuery}*`;
      setTitle('Búsqueda de Piezas');
      setSubtitle(`Resultados rigurosos para la búsqueda: "${searchQuery}"`);
    } else if (categoryId) {
      url += `&category_id=eq.${categoryId}`;
      setTitle('Colección Exclusiva');
      setSubtitle('Filtrado por la categoría seleccionada bajo rigurosos estándares.');
    } else {
      setTitle('Catálogo de Piezas');
      setSubtitle('Colección premium forjada a mano para el ritual diario.');
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
    <div className="bg-[#121414] text-[#e2e2e2] selection:bg-[#c5a059]/30 min-h-screen flex flex-col justify-between font-['Hanken_Grotesk'] text-[16px] leading-[1.6] overflow-x-hidden">
      
      {/* Estilos locales para transiciones suaves y efectos premium */}
      <style dangerouslySetInnerHTML={{ __html: `
        .product-catalog-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .product-catalog-card:hover { transform: translateY(-8px); }
        .product-catalog-card:hover .catalog-image-box { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7); }
      `}} />



      <main className="max-w-[1280px] mx-auto px-6 md:px-[64px] py-24 w-full flex-1">
        
        {/* Encabezado Principal */}
        <div className="border-b border-[#4e4639]/10 pb-8 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-[#c5a059] text-[11px] font-semibold tracking-[0.25em] uppercase block mb-2">
              GLASS THERAPY // ESTUDIO DE VIDRIO
            </span>
            <h1 className="font-['EB_Garamond'] text-[42px] md:text-[52px] font-normal leading-[1.1] tracking-tight text-[#e2e2e2]">
              {title}
            </h1>
            <p className="text-[#9a8f80]/70 text-[15px] mt-2 font-light">
              {subtitle}
            </p>
          </div>
          
          {(searchQuery || categoryId) && (
            <button 
              onClick={() => navigate('/CatalogPage')} 
              className="text-[12px] font-medium tracking-[0.1em] text-[#9a8f80] hover:text-[#c5a059] uppercase transition-all duration-300 self-start md:self-end bg-transparent border-none cursor-pointer flex items-center gap-2"
            >
              {/* SVG de flecha izquierda nativo */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Ver catálogo completo
            </button>
          )}
        </div>

        {/* Estado de Carga (Loading) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-[#c5a059] tracking-[0.25em] uppercase text-xs animate-pulse font-medium">
              Sincronizando con la bóveda de cristalería...
            </p>
          </div>
        ) : products.length === 0 ? (
          /* Catálogo Vacío */
          <div className="text-center py-24 border border-dashed border-[#4e4639]/15 rounded-xl bg-[#1a1c1c]/20 px-4">
            <p className="font-['EB_Garamond'] text-[26px] text-[#9a8f80] mb-2 font-normal">
              Sin piezas disponibles
            </p>
            <p className="text-sm text-[#9a8f80]/60 max-w-md mx-auto font-light">
              No se han encontrado piezas bajo este criterio en este momento. Intente regresar al catálogo general.
            </p>
          </div>
        ) : (
          /* Grilla de Productos Activa */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <div key={product.id} className="product-catalog-card flex flex-col justify-between group">
                
                {/* Contenedor de la Imagen */}
                <div className="catalog-image-box aspect-[4/5] bg-[#171919] overflow-hidden relative mb-6 rounded-lg transition-all duration-500 border border-white/[0.02]">
                  <img 
                    src={product.image_url} 
                    alt={product.alt_text || product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  
                  {/* Capa oscurecedora y botón "Añadir" en Hover de escritorio */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 hidden lg:flex">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full py-3 bg-[#c5a059] text-[#221802] font-['Hanken_Grotesk'] text-[13px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 hover:bg-[#d6b26d]"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>

                {/* Información de la pieza */}
                <div className="space-y-1.5 px-1">
                  <h3 className="font-['EB_Garamond'] text-[23px] font-normal leading-[1.2] text-[#e2e2e2] group-hover:text-[#c5a059] transition-colors duration-300 truncate">
                    {product.name}
                  </h3>
                  <p className="text-[#c5a059] font-['Hanken_Grotesk'] text-[15px] font-medium tracking-wide">
                    ${product.price}
                  </p>
                </div>

                {/* Botón visible solo en tablets/móviles (donde no existe el hover del mouse) */}
                <div className="mt-4 block lg:hidden">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2.5 bg-[#1a1c1c] border border-[#4e4639]/40 text-[#e2e2e2] text-xs font-medium uppercase tracking-wider rounded"
                  >
                    Agregar +
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}