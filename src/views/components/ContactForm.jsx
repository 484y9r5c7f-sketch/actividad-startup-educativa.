import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import useContactForm from '../../controllers/useContactForm';
import FormField, { Honeypot } from './FormField';
import { LIMITS } from '../../models/security/validators';

const mensajesInspiracionales = [
  "¡El aprendizaje es el primer paso hacia un futuro brillante!",
  "Cada nuevo conocimiento te acerca más a tus metas",
  "La educación es la llave maestra que abre todas las puertas",
  "Tu desarrollo profesional comienza con una decisión",
  "Transforma tu potencial en éxito con educación de calidad"
];

const ContactForm = () => {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useContactForm();
  const [floatOffset, setFloatOffset] = useState(0);
  const [mensajeInicial] = useState(
    () => mensajesInspiracionales[new Date().getDate() % mensajesInspiracionales.length],
  );

  useEffect(() => {
    // Anima sutilmente la imagen de contacto
    let dir = 1;
    const id = setInterval(() => {
      setFloatOffset((prev) => {
        const next = prev + dir * 4;
        if (next > 8 || next < -8) dir *= -1;
        return next;
      });
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="contact" id="contacto" aria-busy={isSubmitting} style={{ padding: '3rem 1rem' }}>
      <div className="contact-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="contact-info" style={{ flex: '1 1 320px', minWidth: '260px' }}>
          <img
            src="/src/assets/contacto.png"
            alt="Contacto"
            className="journey-image"
            style={{
              maxWidth: 160,
              display: 'block',
              transform: `translateY(${floatOffset}px)`,
              transition: 'transform 360ms ease-in-out',
              willChange: 'transform',
            }}
          />
          <h2>¿Listo para empezar tu viaje?</h2>
          <p style={{ color: '#6b7280' }}>Déjanos tus datos y te contactaremos con opciones que se ajusten a tus metas.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#4b5563' }}>
            Recibirás una respuesta en menos de 48 horas. Mientras tanto: {mensajeInicial}
          </p>
          <p className="security-note">
            🔒 Tus datos se validan y sanitizan antes de enviarse. <Link to="/seguridad">Ver centro de seguridad</Link>
          </p>
          <div className="social-links" style={{ marginTop: '1rem' }}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin" aria-hidden="true"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter" aria-hidden="true"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} noValidate style={{ flex: '1 1 360px', minWidth: '280px', position: 'relative' }}>
          <FormField
            id="name"
            label="Nombre"
            type="text"
            placeholder="Tu nombre completo"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            maxLength={LIMITS.name.max}
            autoComplete="name"
            required
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="tu@ejemplo.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            maxLength={LIMITS.email.max}
            autoComplete="email"
            required
          />
          <FormField
            id="message"
            label="Mensaje"
            multiline
            placeholder="Cuéntanos qué te interesa aprender"
            value={values.message}
            onChange={handleChange}
            error={errors.message}
            maxLength={LIMITS.message.max}
            rows={5}
            required
          />
          <Honeypot value={values.website} onChange={handleChange} />
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
