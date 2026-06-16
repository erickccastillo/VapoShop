import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import { useFetchProducts } from '../hooks/useFetchProducts';
import type { Product } from '../types/Product';

const Catalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('TODOS');
  const [page, setPage] = useState(1);

  // Ajusta tu hook para que devuelva también totalProducts
  const { products, loading, error, totalPages, totalProducts } = useFetchProducts({
    page,
    q: query,
    category,
  });

  const categories = [ 'TODOS','PISOS', 'AZULEJOS', 'DECORATIVOS', 'MONOMANDOS', 'MEZCLADORAS'];

  return (
    <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0a2a5e' }}>
        CATÁLOGO
      </h2>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#FFD700' }}>
        Nuestra colección completa
      </h3>
      <p style={{ marginBottom: '2rem', color: '#555', fontSize: '1rem' }}>
        Pisos y azulejos seleccionados pieza por pieza. Filtra por categoría o busca por nombre.
      </p>

      <SearchBar
        value={query}
        onChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
        
      />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: category === cat ? '2px solid #FFD700' : '1px solid #ccc',
              backgroundColor: category === cat ? '#FFD700' : '#fff',
              color: category === cat ? '#0a2a5e' : '#333',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <ProductList products={products as Product[]} />}

      {/* Texto inferior */}
      {!loading && !error && (
        <div style={{ marginTop: '2rem', fontWeight: 500, color: '#0a2a5e' }}>
          Mostrando {products?.length ?? 0} de {totalProducts ?? 0} productos
        </div>
      )}
    </section>
  );
};

export default Catalog;
