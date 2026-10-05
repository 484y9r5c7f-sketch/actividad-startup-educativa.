import React from 'react';
import { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';
import FormField, { Honeypot } from '../components/FormField';
import useContactForm from '../../controllers/useContactForm';
import { LIMITS } from '../../models/security/validators';
import '../styles/Contacto.css';

export default function Contacto() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useContactForm();

  return (
    <main style={{ padding: '3rem 1rem', maxWidth: 1100, margin: '0 auto' }}>
      <Banner />
      <Toaster position="top-center" reverseOrder={false} />
      <h1>Contáctanos</h1>
      <p style={{ color: '#6b7280' }}>Escríbenos y te responderemos lo antes posible.</p>

      <div className="contacto-content">
        <div className="contacto-info">
          <h2>Información de Contacto</h2>
          <p><strong>Dirección:</strong><br />Calle 81B #72B-70<br />Bogotá, Colombia</p>
          <p><strong>Email:</strong><br />soporte@uniminuto.edumotion.com.co</p>
          <p><strong>PBX:</strong><br />+57 (601) 291-6520</p>
          <p><strong>Línea gratuita nacional:</strong><br />01 8000 936 670</p>
          <p><strong>WhatsApp:</strong><br />+57 302 123-4567</p>
          <p><strong>Horario de Atención:</strong><br />Lunes a Sábado<br />7:00 AM - 7:00 PM</p>
        </div>

        <form className="contacto-form" onSubmit={handleSubmit} noValidate style={{ position: 'relative' }}>
          <FormField
            id="name"
            label="Nombre completo"
            type="text"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            maxLength={LIMITS.name.max}
            autoComplete="name"
            disabled={isSubmitting}
            required
          />
          <FormField
            id="email"
            label="Correo electrónico"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            maxLength={LIMITS.email.max}
            autoComplete="email"
            disabled={isSubmitting}
            required
          />
          <FormField
            id="subject"
            label="Asunto"
            type="text"
            value={values.subject}
            onChange={handleChange}
            error={errors.subject}
            maxLength={LIMITS.subject.max}
            disabled={isSubmitting}
          />
          <FormField
            id="message"
            label="Mensaje"
            multiline
            value={values.message}
            onChange={handleChange}
            error={errors.message}
            maxLength={LIMITS.message.max}
            rows={5}
            disabled={isSubmitting}
            required
          />
          <Honeypot value={values.website} onChange={handleChange} />

          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </main>
  );
}
