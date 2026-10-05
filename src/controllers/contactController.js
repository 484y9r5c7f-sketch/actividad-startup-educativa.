import { validateContact } from '../models/security/validators.js';
import { createRateLimiter } from '../models/security/rateLimiter.js';
import { logSecurityEvent } from '../models/security/securityLog.js';

const MIN_FILL_MS = 2000;

// No hay backend: el envío se simula. Aquí iría la llamada real a la API.
const defaultTransport = () => new Promise((resolve) => setTimeout(resolve, 1200));

// Pipeline de seguridad: honeypot -> tiempo mínimo -> límite de envíos -> validación -> envío.
export async function submitContact(raw, {
  honeypot = '',
  startedAt = Date.now(),
  storage = globalThis.localStorage,
  now = Date.now,
  transport = defaultTransport,
  log = logSecurityEvent,
} = {}) {
  if (honeypot) {
    log({ type: 'Bot detectado', detail: 'Campo trampa (honeypot) completado.', severity: 'alta' });
    return { ok: false, code: 'bot', message: 'No se pudo procesar la solicitud.' };
  }

  if (now() - startedAt < MIN_FILL_MS) {
    log({ type: 'Bot detectado', detail: 'Formulario enviado demasiado rápido.', severity: 'media' });
    return { ok: false, code: 'too-fast', message: 'Envío demasiado rápido. Revisa tus datos e intenta de nuevo.' };
  }

  const limiter = createRateLimiter({ storage, now });
  const rate = limiter.attempt();
  if (!rate.allowed) {
    const seconds = Math.ceil(rate.retryAfterMs / 1000);
    log({ type: 'Límite de envíos', detail: `Intento bloqueado. Reintento en ${seconds}s.`, severity: 'media' });
    return { ok: false, code: 'rate-limited', message: `Demasiados envíos. Intenta de nuevo en ${seconds} segundos.` };
  }

  const result = validateContact(raw);
  if (result.threats.length) {
    for (const { field, type } of result.threats) {
      log({ type: `Entrada bloqueada: ${type}`, detail: `Campo "${field}" rechazado.`, severity: 'alta' });
    }
  }
  if (!result.valid) {
    return { ok: false, code: 'invalid', errors: result.errors, message: 'Revisa los campos marcados.' };
  }

  try {
    await transport(result.values);
  } catch {
    log({ type: 'Error de envío', detail: 'Falló el transporte del mensaje.', severity: 'baja' });
    return { ok: false, code: 'transport', message: 'No pudimos enviar tu mensaje. Intenta de nuevo.' };
  }

  log({ type: 'Envío válido', detail: 'Mensaje validado y sanitizado correctamente.', severity: 'info' });
  return { ok: true, code: 'sent', message: '¡Mensaje enviado con éxito!', values: result.values };
}
