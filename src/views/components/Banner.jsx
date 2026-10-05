import React from 'react';

const Banner = ({ title = 'Aprende con Edumotion', subtitle = 'Cursos prácticos para impulsar tu carrera' }) => {
  const handleScrollOrNav = (targetId) => {
    // targetId examples: 'cursos', 'testimonios', 'nosotros', 'contacto'
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Si el elemento no está en esta página, navega a la raíz con hash
    // (se codifica el id para evitar inyectar valores arbitrarios en la URL).
    window.location.assign(`/#${encodeURIComponent(targetId)}`);
  };

  return (
    <header
      className="hero-banner"
      style={{
        padding: '4rem 1rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
      aria-label="Banner principal"
    >
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.25rem' }}>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary" style={{ padding: '0.6rem 1.1rem' }} onClick={() => handleScrollOrNav('cursos')}>Ver cursos</button>
        <button className="btn-secondary" style={{ padding: '0.6rem 1.1rem' }} onClick={() => handleScrollOrNav('testimonios')}>Testimonios</button>
        <button className="btn-secondary" style={{ padding: '0.6rem 1.1rem' }} onClick={() => handleScrollOrNav('nosotros')}>Nosotros</button>
        <button className="btn-outline" style={{ padding: '0.6rem 1.1rem' }} onClick={() => handleScrollOrNav('contacto')}>Contáctanos</button>
      </div>
    </header>
  );
};

export default Banner;
