import React from 'react';
import Banner from '../components/Banner';

const container = {
  padding: '2.5rem 1rem',
  maxWidth: 1100,
  margin: '0 auto',
  fontFamily: 'Poppins, system-ui, Arial',
  color: '#0f172a',
};

const card = {
  background: '#fff',
  padding: 20,
  borderRadius: 10,
  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
};

const subtitle = { color: '#6b7280', marginTop: 8 };

const CTA = ({ children, href }) => (
  <a
    href={href}
    style={{
      display: 'inline-block',
      background: '#0b6fff',
      color: '#fff',
      padding: '10px 14px',
      borderRadius: 8,
      textDecoration: 'none',
      marginTop: 12,
    }}
  >
    {children}
  </a>
);

const Terminos = () => {
  return (
    <main>
      <Banner />
      <section style={container}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>Términos y condiciones</h1>
          <p style={subtitle}>
            Revisa las condiciones de uso de nuestros cursos y la plataforma. Al usar Edumotion aceptas estos términos.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 18 }}>
          <article style={card}>
            <h2 style={{ marginTop: 0 }}>Acceso a los cursos</h2>
            <p style={{ color: '#374151' }}>
              El acceso a materiales y plataformas se otorga tras la inscripción y pago (cuando aplique). El material es de uso personal y no puede redistribuirse sin autorización.
            </p>
          </article>

          <article style={card}>
            <h3>Propiedad intelectual</h3>
            <p style={{ color: '#374151' }}>
              Todos los contenidos, recursos y materiales son propiedad de Edumotion o de sus licenciantes. Queda prohibida la reproducción total o parcial sin permiso explícito.
            </p>
          </article>

          <article style={card}>
            <h3>Pagos y reembolsos</h3>
            <p style={{ color: '#374151' }}>
              Las políticas de pago y reembolso se detallan en cada curso. Para solicitar un reembolso contacta a <a href="mailto:soporte@uniminuto.edumotion.com.co">soporte@uniminuto.edumotion.com.co</a>.
            </p>
          </article>

          <article style={card}>
            <h3>Limitación de responsabilidad</h3>
            <p style={{ color: '#374151' }}>
              Edumotion no se responsabiliza por decisiones profesionales tomadas basadas únicamente en los contenidos del curso. Nuestro objetivo es ofrecer formación que complemente la experiencia práctica.
            </p>
            <CTA href="/#contacto">Contactar soporte</CTA>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Terminos;