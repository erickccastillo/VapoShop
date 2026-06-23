// frontend/src/pages/ExperiencePage.tsx
import React, { lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Carga perezosa (lazy load) de los componentes de experiencia para optimizar el rendimiento
const experiences = {
  BongsExperience: lazy(() => import('../components/BongsExperience')),
  VapesExperience: lazy(() => import('../components/VapesExperience')),
  PipasExperience: lazy(() => import('../components/PipasExperience')),
  // ... añade más según tus categorías
};

export default function ExperiencePage() {
  const { experienceName } = useParams<{ experienceName: string }>();

  // Si no se encuentra la experiencia o la URL es inválida
  if (!experienceName || !experiences[experienceName as keyof typeof experiences]) {
    return <Navigate to="/" replace />; // Redirige a inicio si la experiencia no existe
  }

  // Obtenemos el componente dinámico correspondiente
  const SelectedExperience = experiences[experienceName as keyof typeof experiences];

  return (
    <div className="bg-[#121414] text-[#e2e2e2] min-h-screen flex flex-col justify-between font-['Hanken_Grotesk']">
      <Header />
      
      <main className="flex-1 w-full relative z-0">
        {/* Usamos Suspense para mostrar una animación de carga mientras se descarga el componente */}
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center text-[#c5a059] bg-[#0c0f0f]">
            <p className="tracking-[0.3em] uppercase text-sm animate-pulse">Sincronizando experiencia premium...</p>
          </div>
        }>
          <SelectedExperience />
        </Suspense>
      </main>

      {/* Opcional: Puedes omitir el footer en estas secciones si prefieres una experiencia full-screen */}
      <Footer />
    </div>
  );
}