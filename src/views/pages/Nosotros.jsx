import React from 'react';

const tutors = [
  {
    name: 'Ana Castillo',
    role: 'Tutora Desarrollo Web',
    bio: 'Ingeniera de software, 6 años de experiencia en apps web y enseñanza de React.',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Marcos Peña',
    role: 'Tutor Data Science',
    bio: 'Científico de datos especializado en pipelines y modelos en producción.',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Carolina Ríos',
    role: 'Tutora Marketing Digital',
    bio: 'Especialista en growth y analítica para startups y PYMEs.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop',
  },
];

const Nosotros = () => {
  return (
    <main>
      <section id="nosotros" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Nosotros</h1>
        <p style={{ color: '#6b7280', maxWidth: 820, margin: '0.5rem auto 1.25rem' }}>
          En Edumotion impulsamos el talento con formación práctica y acompañamiento personalizado. Conecta con proyectos reales y tutores expertos.
        </p>
      </section>

      <section style={{ padding: '1.5rem 1rem', maxWidth: 1100, margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <article style={{ flex: '1 1 320px', background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
            <h3>Quiénes somos</h3>
            <p style={{ color: '#4b5563' }}>
              Somos un equipo de educadores y profesionales de la industria dedicados a crear experiencias de aprendizaje que conecten con el mercado laboral.
            </p>
          </article>

          <article style={{ flex: '1 1 320px', background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
            <h3>Misión</h3>
            <p style={{ color: '#4b5563' }}>
              Capacitar a personas en habilidades digitales relevantes, mediante formación práctica, mentoría y proyectos aplicados que aceleren su inserción profesional.
            </p>
          </article>

          <article style={{ flex: '1 1 320px', background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
            <h3>Visión</h3>
            <p style={{ color: '#4b5563' }}>
              Ser una referencia regional en educación tecnológica y profesional, impulsando cambios reales en la trayectoria de nuestros estudiantes.
            </p>
          </article>
        </div>

        <div>
          <h3 style={{ marginTop: '0.5rem' }}>Cursos destacados</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/#cursos" className="course-pill" style={{ padding: '0.5rem 0.75rem', background: '#fff', borderRadius: 6, boxShadow: '0 4px 12px rgba(15,23,42,0.04)', textDecoration: 'none', color: '#111' }}>Desarrollo Web</a>
            <a href="/#cursos" className="course-pill" style={{ padding: '0.5rem 0.75rem', background: '#fff', borderRadius: 6, boxShadow: '0 4px 12px rgba(15,23,42,0.04)', textDecoration: 'none', color: '#111' }}>Data Science</a>
            <a href="/#cursos" className="course-pill" style={{ padding: '0.5rem 0.75rem', background: '#fff', borderRadius: 6, boxShadow: '0 4px 12px rgba(15,23,42,0.04)', textDecoration: 'none', color: '#111' }}>Marketing Digital</a>
          </div>
        </div>

        <div>
          <h3 style={{ marginTop: '0.5rem' }}>Equipo</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {tutors.map((t) => (
              <div key={t.name} style={{ flex: '1 1 220px', background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
                <img src={t.image} alt={t.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                <h4 style={{ margin: '0 0 0.25rem 0' }}>{t.name}</h4>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>{t.role}</p>
                <p style={{ marginTop: '0.5rem', color: '#4b5563', fontSize: '0.95rem' }}>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 360px' }}>
            <h3>Valores</h3>
            <ul style={{ marginTop: 8, color: '#4b5563' }}>
              <li>Enfoque práctico</li>
              <li>Aprendizaje con propósito</li>
              <li>Acompañamiento personalizado</li>
            </ul>
          </div>

          <div style={{ flex: '0 0 320px' }}>
            <div style={{ padding: '1rem', borderRadius: 8, background: '#fff', boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
              <h4 style={{ marginTop: 0 }}>¿Quieres saber más?</h4>
              <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>Contáctanos para recibir orientación personalizada sobre el curso ideal para ti.</p>
              <a href="/#contacto" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.6rem 1rem' }}>Contactar</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Nosotros;
