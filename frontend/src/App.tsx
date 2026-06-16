import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CatalogPage from './pages/CatalogPage';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<CatalogPage />} />
          <Route path="/category/:categoryId" element={<CatalogPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}