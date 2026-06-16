import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types/Product';

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  // Debug: imprime en consola los productos recibidos
  console.log('ProductList recibió productos:', products);

  if (!products || products.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
        gap: 16,
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
