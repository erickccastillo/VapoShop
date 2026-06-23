// frontend/src/pages/CartPage.tsx
import React from 'react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CartPage() {
  const { cart, totalPrice, removeFromCart, clearCart } = useCart();

  return (
    <div className="bg-[#121414] text-[#e2e2e2] min-h-screen flex flex-col justify-between font-['Hanken_Grotesk']">

      <main className="max-w-[1280px] mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-['EB_Garamond'] text-4xl text-[#c5a059] mb-12 border-b border-[#4e4639]/10 pb-4">Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p className="text-lg">No has seleccionado ningún artículo premium todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 bg-[#1a1c1c] border border-[#4e4639]/10 rounded-xl items-center">
                  <img src={item.image_url} alt={item.name} className="w-24 h-28 object-cover rounded-lg bg-[#121414]" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-['EB_Garamond'] text-2xl text-[#e2e2e2]">{item.name}</h3>
                    <p className="text-[#c5a059] mt-1">${item.price} c/u</p>
                    <p className="text-xs text-[#9a8f80] mt-2">Cantidad: {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="px-4 py-2 border border-red-500/20 text-red-400 text-xs uppercase tracking-wider rounded hover:bg-red-500/10 transition-colors">
                    Eliminar
                  </button>
                </div>
              ))}
              <button onClick={clearCart} className="text-xs text-[#9a8f80] hover:text-[#e2e2e2] uppercase tracking-wider underline">
                Vaciar Carrito
              </button>
            </div>

            <div className="bg-[#1a1c1c] border border-[#4e4639]/10 p-6 rounded-xl h-fit space-y-6">
              <h2 className="font-['EB_Garamond'] text-2xl text-[#e2e2e2] border-b border-[#4e4639]/10 pb-3">Resumen del Pedido</h2>
              <div className="flex justify-between text-sm">
                <span className="text-[#9a8f80]">Total artículos:</span>
                <span>{cart.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-[#4e4639]/5">
                <span className="text-sm text-[#9a8f80]">Total General:</span>
                <span className="font-['EB_Garamond'] text-3xl text-[#c5a059]">${totalPrice}</span>
              </div>
              <button className="w-full py-4 bg-[#c5a059] text-[#412d00] font-bold text-xs uppercase tracking-widest rounded shadow-xl hover:bg-[#c5a059]/90 transition-all">
                Proceder al Pago Seguro
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}