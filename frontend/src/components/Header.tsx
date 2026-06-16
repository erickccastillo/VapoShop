// frontend/src/components/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const navigate = useNavigate();
  const { cart, totalItems, totalPrice, removeFromCart } = useCart();

  // Estados de UI
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  // Supabase Env strings
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const headers = { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` };

  // Cargar Categorías para el menú desplegable
  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,title&order=id.asc`, { headers })
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(err => console.error(err));
  }, []);

  // Búsqueda en tiempo real (Vista previa)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetch(`${SUPABASE_URL}/rest/v1/products?name=ilike.*${searchQuery}*&limit=5`, { headers })
        .then(res => res.json())
        .then(data => setSearchResults(data || []))
        .catch(err => console.error(err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Cerrar buscador al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#121414]/90 backdrop-blur-md border-b border-[#4e4639]/10 px-[20px] md:px-[64px] py-4 flex items-center justify-between">
        
        {/* LOGO CON IMAGEN */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border border-[#c5a059]/40 rounded-full flex items-center justify-center group-hover:border-[#c5a059] transition-colors p-1.5 overflow-hidden">
            <img 
              src="./public/favicon.svg" 
              alt="Glass Therapy Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Alternativa por si la imagen tarda en cargar o no existe
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-['EB_Garamond'] text-2xl tracking-wide text-[#c5a059]">Glass Therapy</span>
        </Link>

        {/* BARRA DE BÚSQUEDA */}
        <div ref={searchRef} className="relative max-w-md w-full mx-8 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search our collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-[#1a1c1c] text-[#e2e2e2] placeholder-[#9a8f80]/50 pl-12 pr-4 py-2.5 rounded-full border border-[#4e4639]/20 focus:outline-none focus:border-[#c5a059]/60 text-sm transition-all"
            />
            {/* Lupa de búsqueda como imagen opcional o material icons */}
            <span className="material-symbols-outlined absolute left-4 top-2.5 text-[#9a8f80]/50 text-xl"></span>
          </form>

          {/* Resultados Vista Previa de Búsqueda */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1c1c] border border-[#4e4639]/20 rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in-up">
              {searchResults.map((prod) => (
                <div 
                  key={prod.id} 
                  onClick={() => { setIsSearchFocused(false); navigate(`/search?q=${prod.name}`); }}
                  className="flex items-center gap-4 p-3 hover:bg-[#c5a059]/5 cursor-pointer border-b border-[#4e4639]/5 transition-colors"
                >
                  <img src={prod.image_url} alt={prod.alt_text} className="w-10 h-12 object-cover rounded bg-[#121414]" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#e2e2e2] truncate">{prod.name}</h4>
                    <p className="text-xs text-[#c5a059] mt-0.5">${prod.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ICONOS DERECHA CON IMÁGENES */}
        <div className="flex items-center gap-6">
          
          {/* BOTÓN CARRITO CON IMAGEN */}
          <button onClick={() => setIsCartOpen(true)} className="relative p-1 text-[#e2e2e2] hover:opacity-80 transition-opacity flex items-center justify-center">
            <img 
              src="./public/cart.png" 
              alt="Shopping Bag" 
              className="w-6 h-6 object-contain" 
            />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c5a059] text-[#121414] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* BOTÓN TRES PUNTOS CON IMAGEN */}
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-[#e2e2e2] hover:opacity-80 transition-opacity flex items-center justify-center">
              <img 
                src="./public/more.png" 
                alt="Menu" 
                className="w-6 h-6 object-contain" 
              />
            </button>

            {/* Desplegable de Categorías */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#1a1c1c] border border-[#4e4639]/20 rounded-xl py-2 shadow-2xl z-50">
                <div className="px-4 py-2 border-b border-[#4e4639]/10 text-xs font-semibold text-[#9a8f80] uppercase tracking-wider">
                  Categorías
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setIsMenuOpen(false); navigate(`/category/${cat.id}`); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#e2e2e2] hover:bg-[#c5a059]/10 hover:text-[#c5a059] transition-colors"
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* VISTA PREVIA LATERAL DEL CARRITO (SIDE OVERLAY) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          
          <div className="relative w-full max-w-md h-full bg-[#121414] border-l border-[#4e4639]/20 shadow-2xl flex flex-col z-10">
            <div className="p-6 border-b border-[#4e4639]/10 flex items-center justify-between">
              <h3 className="font-['EB_Garamond'] text-2xl text-[#e2e2e2]">Tu Selección</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-[#9a8f80] hover:text-[#e2e2e2]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <span className="material-symbols-outlined text-5xl mb-2">auto_stories</span>
                  <p className="text-sm uppercase tracking-widest">El carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-[#1a1c1c] border border-[#4e4639]/10 rounded-lg">
                    <img src={item.image_url} alt={item.name} className="w-16 h-20 object-cover rounded bg-[#121414]" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[#e2e2e2] truncate">{item.name}</h4>
                      <p className="text-xs text-[#c5a059] mt-1">${item.price} x {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[#9a8f80] hover:text-red-400 self-center">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[#4e4639]/10 bg-[#161818] space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#9a8f80]">Subtotal Estimado:</span>
                  <span className="font-['EB_Garamond'] text-xl text-[#c5a059]">${totalPrice}</span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
                  className="w-full py-4 bg-[#c5a059] text-[#412d00] text-center font-semibold text-xs tracking-widest uppercase hover:bg-[#c5a059]/90 transition-all rounded"
                >
                  Ver Carrito Completo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}