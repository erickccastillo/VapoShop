import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #eee', padding: '1rem 0' }}>
      <div className="container" style={{ textAlign: 'center', color: 'var(--muted)' }}>
        © {new Date().getFullYear()}Pisos y Azulejos Revestimento. Todos los derechos reservados.                    Hecho con cuidado.
      </div>
    </footer>
  );
};

export default Footer;
