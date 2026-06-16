import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';

const Home: React.FC = () => {
  const { products, loading } = useFeaturedProducts();

  return (
    <>
      {/* Hero principal */}
      <main
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'left',
          color: '#fff',
          overflow: 'hidden',
          paddingTop: '80px',
          paddingLeft: '5%',
        }}
      >
        {/* Fondo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/src/images/home.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.55)',
            zIndex: -1,
          }}
        />

        {/* Contenido principal */}
        <div style={{ maxWidth: '700px', padding: '2rem 0' }}>
          <h2 style={{ fontSize: '1rem', letterSpacing: '2px', marginBottom: '1rem', color: '#e6c400' }}>
            PISOS Y AZULEJOS · DESDE 1988
          </h2>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
            Revestimientos que transforman espacios.
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6, color: '#f0f0f0' }}>
            Selección curada de pisos y azulejos para hogares y proyectos que buscan elegancia,
            calidad y carácter.
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/catalog"
              style={{
                backgroundColor: '#e1b71f',
                color: '#0a2a5e',
                padding: '0.75rem 1.5rem',
                borderRadius: '2px',
                textDecoration: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              VER CATÁLOGO →
            </Link>
            <Link
              to="/about"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '2px',
                textDecoration: 'none',
                fontWeight: 600,
                border: '1px solid #ffffff',
              }}
            >
              CONÓCENOS
            </Link>
          </div>
        </div>
      </main>

      {/* Sección Sobre Nosotros */}
      <section
        style={{
          backgroundColor: '#f5f0e8',
          color: '#333',
          textAlign: 'center',
          padding: '4rem 2rem',
        }}
      >
        <h2 style={{ fontSize: '1rem', letterSpacing: '2px', marginBottom: '1rem', color: '#c9a200' }}>
          SOBRE NOSOTROS
        </h2>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 700, color: '#222' }}>
          Calidad sin concesiones, diseño con propósito.
        </h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6, color: '#555' }}>
          En Revestimento creemos que un piso o azulejo es mucho más que un material: 
          es la base que define la atmósfera de cada espacio. Trabajamos con fabricantes 
          europeos y artesanos locales para ofrecerte piezas que combinan durabilidad, 
          estética contemporánea y un servicio cercano.
        </p>
      </section>

      {/* Sección Destacados */}
      <section style={{ backgroundColor: '#fff', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', letterSpacing: '2px', color: '#c9a200' }}>DESTACADOS</h2>
          <Link to="/catalog" style={{ color: '#0a2a5e', fontWeight: 600 }}>Ver todo el catálogo →</Link>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 700, color: '#222' }}>
          Colecciones del momento
        </h1>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {products.map((p) => (
              <div key={p.id} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{p.category} {p.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#555' }}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sección Beneficios */}
      <section
        style={{
          backgroundColor: '#f5f0e8',
          padding: '4rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '2rem', color: '#c9a200', marginBottom: '1rem' }}>🎨</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Diseño curado</h3>
          <p style={{ color: '#555' }}>Cada pieza es seleccionada por nuestro equipo de diseño.</p>
        </div>
        <div>
          <div style={{ fontSize: '2rem', color: '#c9a200', marginBottom: '1rem' }}>🛡️</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Garantía total</h3>
          <p style={{ color: '#555' }}>Materiales certificados con garantía extendida de 10 años.</p>
        </div>
        <div>
          <div style={{ fontSize: '2rem', color: '#c9a200', marginBottom: '1rem' }}>⚡</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Entrega ágil</h3>
          <p style={{ color: '#555' }}>Logística propia para entregas rápidas en obra.</p>
        </div>
      </section>
      {/* Sección Call to Action */}
<section
  style={{
    backgroundColor: '#0a2a5e', // azul profundo
    color: '#fff',
    padding: '4rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem',
  }}
>
  {/* Texto */}
  <div style={{ flex: '1 1 400px' }}>
    <h1
      style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        fontWeight: 700,
        color: '#ffffff',
      }}
    >
      ¿Listo para diseñar tu espacio?
    </h1>
    <p
      style={{
        fontSize: '1.1rem',
        lineHeight: 1.6,
        color: '#f0f0f0',
      }}
    >
      Explora el catálogo.
    </p>
  </div>

  {/* Botón */}
  <div>
    <Link
      to="/catalog"
      style={{
        backgroundColor: '#e1b71f', // dorado
        color: '#0a2a5e',           // azul profundo
        padding: '0.75rem 1.5rem',
        borderRadius: '2px',
        textDecoration: 'none',
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'inline-block',
      }}
    >
      EXPLORAR CATÁLOGO →
    </Link>
  </div>
</section>

    </>
  );
};

export default Home;
