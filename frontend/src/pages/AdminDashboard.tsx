// frontend/src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  // Pestaña activa ahora incluye 'categories'
  const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'categories'>('products');
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado del Formulario Único (sirve para Crear y Editar en las 3 tablas)
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: '', title: '', price: 0, image_url: '', alt_text: '', stock: 0, category_id: '', tag: '', description: '', is_active: true
  });

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  // Cargar datos según la pestaña activa
  const loadData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = 'products?order=id.asc';
      else if (activeTab === 'hero') endpoint = 'hero_slides?order=id.asc';
      else if (activeTab === 'categories') endpoint = 'categories?order=id.asc';

      const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, { headers });
      const data = await res.json();
      setItems(data || []);

      // Siempre necesitamos la lista de categorías actualizada para el select de productos
      const catRes = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,title&order=id.asc`, { headers });
      const catData = await catRes.json();
      setCategories(catData || []);
    } catch (e) { 
      console.error(e); 
    }
    setLoading(false);
  };

  useEffect(() => { 
    loadData(); 
    resetForm(); 
  }, [activeTab]);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '', title: '', price: 0, image_url: '', alt_text: '', stock: 0, category_id: categories[0]?.id || '', tag: '', description: '', is_active: true
    });
  };

  const handleEditClick = (item: any) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({ ...item });
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro? Nota: Si eliminas una categoría con productos asignados, podría dar error de integridad.')) return;
    
    let table = '';
    if (activeTab === 'products') table = 'products';
    else if (activeTab === 'hero') table = 'hero_slides';
    else if (activeTab === 'categories') table = 'categories';

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method: 'DELETE', headers });
      if (!res.ok) {
        alert('No se pudo eliminar. Verifica que no existan dependencias en la base de datos.');
      }
      loadData();
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let table = '';
    if (activeTab === 'products') table = 'products';
    else if (activeTab === 'hero') table = 'hero_slides';
    else if (activeTab === 'categories') table = 'categories';

    const method = isEditing ? 'PATCH' : 'POST';
    const url = isEditing ? `${SUPABASE_URL}/rest/v1/${table}?id=eq.${currentId}` : `${SUPABASE_URL}/rest/v1/${table}`;

    // Limpieza estricta de payloads según la tabla destino
    let payload: any = {};
    if (activeTab === 'products') {
      payload = {
        name: formData.name,
        price: formData.price,
        image_url: formData.image_url,
        alt_text: formData.alt_text,
        stock: formData.stock,
        category_id: formData.category_id || categories[0]?.id
      };
    } else if (activeTab === 'hero') {
      payload = {
        title: formData.title,
        tag: formData.tag,
        description: formData.description,
        price: formData.price,
        image_url: formData.image_url,
        alt_text: formData.alt_text,
        is_active: formData.is_active
      };
    } else if (activeTab === 'categories') {
      payload = {
        title: formData.title // La tabla categoría típicamente solo usa id (auto) y title
      };
    }

    try {
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (res.ok) {
        loadData();
        resetForm();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message || 'No se pudo guardar el registro.'}`);
      }
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  return (
    <div className="bg-[#0c0f0f] min-h-screen font-['Hanken_Grotesk'] text-[#e2e2e2] flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#121414] border-b md:border-b-0 md:border-r border-[#4e4639]/20 p-6 flex flex-col justify-between">
        <div>
          <h2 className="font-['EB_Garamond'] text-2xl text-[#c5a059] mb-8 text-center md:text-left">Control Panel</h2>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('products')} 
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-[#c5a059] text-[#412d00]' : 'hover:bg-[#1a1c1c] text-[#9a8f80]'}`}
            >
               Productos Catálogo
            </button>
            <button 
              onClick={() => setActiveTab('hero')} 
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'hero' ? 'bg-[#c5a059] text-[#412d00]' : 'hover:bg-[#1a1c1c] text-[#9a8f80]'}`}
            >
               Banners Slider (Hero)
            </button>
            <button 
              onClick={() => setActiveTab('categories')} 
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-[#c5a059] text-[#412d00]' : 'hover:bg-[#1a1c1c] text-[#9a8f80]'}`}
            >
               Categorías
            </button>
          </nav>
        </div>
        <button onClick={handleLogout} className="mt-8 w-full py-3 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-xl text-xs uppercase tracking-wider transition-colors">
          Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-12 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <h1 className="font-['EB_Garamond'] text-4xl text-[#e2e2e2] border-b border-[#4e4639]/10 pb-4">
          Gestionar {activeTab === 'products' ? 'Productos' : activeTab === 'hero' ? 'Hero Slides' : 'Categorías'}
        </h1>

        {/* FORMULARIO ADAPTATIVO */}
        <div className="bg-[#121414] border border-[#4e4639]/20 p-6 rounded-2xl shadow-xl">
          <h3 className="font-['EB_Garamond'] text-xl text-[#c5a059] mb-4">
            {isEditing ? 'Editar Registro' : 'Añadir Nuevo Registro'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* CAMPOS TABLA: PRODUCTS */}
            {activeTab === 'products' && (
              <>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Nombre del Producto</label>
                  <input type="text" value={formData.name || ''} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Categoría Asignada</label>
                  <select value={formData.category_id || ''} onChange={(e)=>setFormData({...formData, category_id: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm text-[#e2e2e2] focus:outline-none focus:border-[#c5a059]/50">
                    <option value="">Selecciona una categoría...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Stock (Inventario)</label>
                  <input type="number" value={formData.stock || 0} onChange={(e)=>setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Precio ($)</label>
                  <input type="number" step="0.01" value={formData.price || 0} onChange={(e)=>setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">URL de la Imagen</label>
                  <input type="text" value={formData.image_url || ''} onChange={(e)=>setFormData({...formData, image_url: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Texto Alternativo (Alt Image)</label>
                  <input type="text" value={formData.alt_text || ''} onChange={(e)=>setFormData({...formData, alt_text: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
              </>
            )}

            {/* CAMPOS TABLA: HERO SLIDES */}
            {activeTab === 'hero' && (
              <>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Título del Slide</label>
                  <input type="text" value={formData.title || ''} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Tag Corto (Ej: Luxury Collection)</label>
                  <input type="text" value={formData.tag || ''} onChange={(e)=>setFormData({...formData, tag: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Descripción de Exhibición</label>
                  <textarea value={formData.description || ''} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm h-20 focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Precio Destacado ($)</label>
                  <input type="number" step="0.01" value={formData.price || 0} onChange={(e)=>setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">URL de la Imagen Fondo</label>
                  <input type="text" value={formData.image_url || ''} onChange={(e)=>setFormData({...formData, image_url: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#9a8f80] block mb-1">Texto Alt</label>
                  <input type="text" value={formData.alt_text || ''} onChange={(e)=>setFormData({...formData, alt_text: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" required />
                </div>
              </>
            )}

            {/* CAMPOS TABLA: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="md:col-span-2">
                <label className="text-xs uppercase text-[#9a8f80] block mb-1">Nombre de la Categoría</label>
                <input type="text" value={formData.title || ''} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#c5a059]/50" placeholder="Ej: Cristalería Fina, Edición Limitada..." required />
              </div>
            )}

            {/* BOTONES DE ENVÍO */}
            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <button type="submit" className="px-6 py-3 bg-[#c5a059] text-[#412d00] font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-[#c5a059]/90 transition-all">
                {isEditing ? 'Guardar Cambios' : 'Crear Registro'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="px-6 py-3 border border-[#4e4639]/40 text-[#9a8f80] font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-[#1a1c1c] transition-all">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLA DE VISUALIZACIÓN ADAPTATIVA */}
        <div className="bg-[#121414] border border-[#4e4639]/20 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#c5a059] animate-pulse">Cargando base de datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#e2e2e2]">
                <thead className="bg-[#1a1c1c] text-xs uppercase tracking-wider text-[#9a8f80] border-b border-[#4e4639]/10">
                  <tr>
                    {activeTab !== 'categories' && <th className="p-4">Imagen</th>}
                    <th className="p-4">Identificador / Nombre</th>
                    {activeTab !== 'categories' && <th className="p-4">Precio</th>}
                    {activeTab === 'products' && <th className="p-4">Stock</th>}
                    {activeTab === 'hero' && <th className="p-4">Tag</th>}
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4e4639]/10">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1a1c1c]/40 transition-colors">
                      
                      {/* Celda de Imagen (Omitida en categorías) */}
                      {activeTab !== 'categories' && (
                        <td className="p-4">
                          <img src={item.image_url} alt={item.alt_text} className="w-12 h-14 object-cover rounded bg-[#0c0f0f]" />
                        </td>
                      )}
                      
                      {/* Celda Principal */}
                      <td className="p-4">
                        <div className="font-semibold text-base">
                          {activeTab === 'products' ? item.name : item.title}
                        </div>
                        <div className="text-xs text-[#9a8f80]">ID de registro: {item.id}</div>
                      </td>
                      
                      {/* Celda de precio (Omitida en categorías) */}
                      {activeTab !== 'categories' && (
                        <td className="p-4 text-[#c5a059] font-medium">${item.price}</td>
                      )}
                      
                      {/* Celda condicional Stock o Tag */}
                      {activeTab === 'products' && <td className="p-4 text-sm">{item.stock} unidades</td>}
                      {activeTab === 'hero' && <td className="p-4 text-xs tracking-wider text-[#9a8f80]">{item.tag || 'N/A'}</td>}
                      
                      {/* Botones de Control */}
                      <td className="p-4 text-center whitespace-nowrap space-x-2">
                        <button onClick={() => handleEditClick(item)} className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs rounded-lg hover:bg-blue-600/30 transition-colors">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-600/20 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-600/30 transition-colors">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && (
                <div className="p-8 text-center text-sm text-[#9a8f80] opacity-50">
                  No hay registros disponibles en esta tabla.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}