// frontend/src/pages/AdminLogin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctUser = import.meta.env.VITE_ADMIN_USER;
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (user === correctUser && password === correctPassword) {
      // Guardar sesión activa (puedes llamarlo como gustes para simular un token)
      localStorage.setItem('admin_session', 'authenticated_glass_therapy_token');
      navigate('/admin/dashboard');
    } else {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="bg-[#0c0f0f] min-h-screen flex items-center justify-center font-['Hanken_Grotesk'] text-[#e2e2e2] p-4">
      <div className="w-full max-w-md bg-[#121414] border border-[#4e4639]/30 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="font-['EB_Garamond'] text-3xl text-[#c5a059] tracking-wide">Glass Therapy</h1>
          <p className="text-xs text-[#9a8f80] uppercase tracking-widest mt-2">Panel de Control Premium</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/40 text-red-400 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#9a8f80] block mb-2">Usuario</label>
            <input 
              type="text" 
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-xl px-4 py-3 text-sm text-[#e2e2e2] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
              required 
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#9a8f80] block mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1c1c] border border-[#4e4639]/20 rounded-xl px-4 py-3 text-sm text-[#e2e2e2] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#c5a059] text-[#412d00] font-semibold text-xs tracking-widest uppercase hover:bg-[#c5a059]/90 transition-all rounded-xl mt-6"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}