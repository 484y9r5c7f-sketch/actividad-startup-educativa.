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

const Privacidad = () => {
  return (
    <main>
      <Banner />
      <section style={container}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>Política de privacidad</h1>
          <p style={subtitle}>
            Protegemos tu información y queremos que sepas qué datos recopilamos, por qué y cómo los usamos.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 18 }}>
          <article style={card}>
            <h2 style={{ marginTop: 0 }}>Resumen</h2>
            <p style={{ color: '#374151' }}>
              Recopilamos datos que nos proporcionas directamente (nombre, email, mensajes), datos de uso (cookies, analytics) y la información necesaria para gestionar inscripciones y certificaciones. Nunca vendemos tus datos a terceros.
            </p>
            <CTA href="/#contacto">Contactar</CTA>
          </article>

          <article style={card}>
            <h3>Datos que recogemos</h3>
            <ul style={{ color: '#374151' }}>
              <li>Información de contacto: nombre, correo, teléfono (si la proporcionas).</li>
              <li>Datos de uso: páginas visitadas, tiempo en curso, métricas anónimas.</li>
              <li>Contenido que envías: mensajes, archivos para proyectos o prácticas.</li>
            </ul>
          </article>

          <article style={card}>
            <h3>Finalidad y uso</h3>
            <p style={{ color: '#374151' }}>
              Utilizamos tus datos para: responder consultas, gestionar inscripciones, enviar información relevante sobre cursos, mejorar la plataforma y emitir certificados cuando correspondan.
            </p>
          </article>

          <article style={card}>
            <h3>Tus derechos</h3>
            <p style={{ color: '#374151' }}>
              Puedes solicitar acceso, rectificación o supresión de tus datos. Escríbenos a <a href="mailto:soporte@uniminuto.edumotion.com.co">soporte@uniminuto.edumotion.com.co</a>. Responderemos en el plazo legal correspondiente.
            </p>
          </article>

          <article style={card}>
            <h3>Seguridad</h3>
            <p style={{ color: '#374151' }}>
              Implementamos medidas técnicas y organizativas razonables para proteger la información. No existe transmisión de datos completamente segura por internet.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Privacidad;