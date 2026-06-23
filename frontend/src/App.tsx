// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CatalogPage from './pages/CatalogPage';
import Catalog from './pages/Catalog';
// Importaciones del Panel de Administración
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
// Importamos el Header globalmente aquí
import Header from './components/Header';

export default function App() {
  return (
    <CartProvider>
      <Router>
        {/* CONTENEDOR DE DISEÑO GLOBAL */}
        <div className="min-h-screen bg-[#121414] text-[#e2e2e2] flex flex-col relative">
          
          {/* 1. HEADER ANCLADO FIJO AL FRENTE DE TODAS LAS PÁGINAS */}
          <div className="fixed top-0 left-0 w-full z-[100]">
            <Header />
          </div>

          {/* 2. ESPACIADOR GLOBAL PARA QUE EL CONTENIDO BAJE Y NO QUEDE Detrás DEL HEADER */}
          <div className="flex-1 pt-[72px] md:pt-[80px] flex flex-col justify-between">
            <Routes>
              {/* Rutas Públicas de la Tienda */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/store" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/CatalogPage" element={<CatalogPage />} />
              <Route path="/search" element={<Catalog/>} />
              <Route path="/category/:categoryId" element={<Catalog />} />
              
              {/* Rutas de Administración */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>

        </div>
      </Router>
    </CartProvider>
  );
}