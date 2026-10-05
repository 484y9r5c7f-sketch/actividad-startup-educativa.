import React from 'react';

const AboutSection = () => {
  return (
    <section id="nosotros" style={{ padding: '3rem 1rem', background: '#f8fafc' }} aria-labelledby="nosotros-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 id="nosotros-heading" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Nosotros</h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginTop: 0, marginBottom: '1.5rem' }}>
          En Edumotion impulsamos talento con formación práctica, mentoría y proyectos reales.
        </p>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginBottom: '1.5rem' }}>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
            <h3 style={{ marginTop: 0 }}>Misión</h3>
            <p style={{ color: '#4b5563', marginBottom: 0 }}>Capacitar con programas prácticos que conecten al estudiante con oportunidades laborales reales.</p>
          </div>

          <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
            <h3 style={{ marginTop: 0 }}>Visión</h3>
            <p style={{ color: '#4b5563', marginBottom: 0 }}>Ser referentes en educación tecnológica en la región y generar impacto en la empleabilidad.</p>
          </div>

          <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
            <h3 style={{ marginTop: 0 }}>Fundación</h3>
            <p style={{ color: '#4b5563', marginBottom: 0 }}>Fundada en 2020 por profesionales de tecnología y pedagogía con foco en aprendizaje activo.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Nuestros logros</h3>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, minWidth: 120 }}>
              <strong style={{ fontSize: '1.5rem', color: '#0284c7' }}>1,000+</strong>
              <div style={{ color: '#6b7280' }}>Estudiantes graduados</div>
            </div>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, minWidth: 120 }}>
              <strong style={{ fontSize: '1.5rem', color: '#0284c7' }}>85%</strong>
              <div style={{ color: '#6b7280' }}>Tasa de empleabilidad</div>
            </div>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, minWidth: 120 }}>
              <strong style={{ fontSize: '1.5rem', color: '#0284c7' }}>15</strong>
              <div style={{ color: '#6b7280' }}>Países alcanzados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
