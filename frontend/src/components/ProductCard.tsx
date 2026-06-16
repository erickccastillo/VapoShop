import React from 'react';
import type { Product } from '../types/Product';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Debug: imprime el producto completo en consola
  console.log('Renderizando ProductCard con:', product);

  // Convierte price a número si viene como string
  const priceNumber = typeof product.price === 'string'
    ? parseFloat(product.price)
    : product.price;

  return (
    <article style={{ background: 'var(--card)', borderRadius: 8, padding: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <img
        src={product.image || '/placeholder-product.png'}
        alt={product.name}
        style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }}
      />
      <h3 style={{ margin: '8px 0' }}>{product.name}</h3>
      {product.description && (
        <p style={{ color: 'var(--muted)', margin: '4px 0' }}>{product.description}</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <strong>${priceNumber.toFixed(2)}</strong>
        <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>
          Agregar
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
