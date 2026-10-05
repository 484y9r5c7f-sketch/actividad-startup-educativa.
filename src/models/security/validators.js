import { detectThreats, sanitizeText } from './sanitizer.js';

export const LIMITS = {
  name: { min: 2, max: 80 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 1000 },
  email: { max: 254 },
};

const EMAIL_PATTERN = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const NAME_PATTERN = /^[\p{L}][\p{L}\s.'-]*$/u;

export function isValidEmail(email) {
  return email.length <= LIMITS.email.max && EMAIL_PATTERN.test(email) && !email.includes('..');
}

// Valida y sanitiza el formulario de contacto. Nunca confía en la entrada original.
export function validateContact(raw = {}) {
  const errors = {};
  const threats = [];

  const fields = {
    name: { value: raw.name, multiline: false, max: LIMITS.name.max },
    email: { value: raw.email, multiline: false, max: LIMITS.email.max },
    subject: { value: raw.subject, multiline: false, max: LIMITS.subject.max },
    message: { value: raw.message, multiline: true, max: LIMITS.message.max },
  };

  const values = {};
  for (const [key, { value, multiline, max }] of Object.entries(fields)) {
    const found = detectThreats(value);
    if (found.length) {
      threats.push(...found.map((type) => ({ field: key, type })));
      errors[key] = 'Se detectó contenido no permitido. Elimínalo e intenta de nuevo.';
    }
    values[key] = sanitizeText(value, { maxLength: max, multiline });
  }

  if (!errors.name) {
    if (values.name.length < LIMITS.name.min) errors.name = `El nombre debe tener al menos ${LIMITS.name.min} caracteres.`;
    else if (!NAME_PATTERN.test(values.name)) errors.name = 'El nombre solo puede contener letras, espacios, punto, guion y apóstrofe.';
  }

  if (!errors.email && !isValidEmail(values.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  // El asunto es opcional (el formulario de la portada no lo incluye).
  if (!errors.subject && values.subject && values.subject.length < LIMITS.subject.min) {
    errors.subject = `El asunto debe tener al menos ${LIMITS.subject.min} caracteres.`;
  }

  if (!errors.message && values.message.length < LIMITS.message.min) {
    errors.message = `El mensaje debe tener al menos ${LIMITS.message.min} caracteres.`;
  }

  return { valid: Object.keys(errors).length === 0, errors, values, threats };
}
