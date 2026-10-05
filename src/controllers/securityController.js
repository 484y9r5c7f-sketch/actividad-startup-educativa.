import { detectThreats, sanitizeText } from '../models/security/sanitizer.js';
import { isValidEmail, validateContact } from '../models/security/validators.js';
import { evaluatePassword } from '../models/security/password.js';
import { checkUrl } from '../models/security/urlGuard.js';
import { createRateLimiter } from '../models/security/rateLimiter.js';
import { logSecurityEvent } from '../models/security/securityLog.js';

// Lista de protecciones activas que muestra el centro de seguridad.
export const PROTECTIONS = [
  { title: 'Validación de entradas', text: 'Longitud, formato de correo y caracteres permitidos en cada campo.' },
  { title: 'Sanitización', text: 'Se eliminan etiquetas HTML, caracteres de control y espacios invisibles.' },
  { title: 'Detección de ataques', text: 'Reglas para XSS, inyección SQL, path traversal e inyección de plantillas.' },
  { title: 'Límite de envíos', text: 'Máximo 3 envíos por minuto para frenar spam y fuerza bruta.' },
  { title: 'Anti-bots', text: 'Campo trampa (honeypot) y tiempo mínimo de llenado del formulario.' },
  { title: 'Cabeceras HTTP seguras', text: 'CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy.' },
  { title: 'Validación de URLs', text: 'Bloquea javascript:, data:, credenciales en la URL y direcciones internas (SSRF).' },
  { title: 'Política de contraseñas', text: 'Longitud, variedad de caracteres, lista de contraseñas comunes y entropía estimada.' },
  { title: 'Bitácora sin datos personales', text: 'Se registra el tipo de evento, nunca el contenido que escribió el usuario. Exportación a CSV a prueba de inyección de fórmulas.' },
];

export const SAMPLE_PAYLOADS = [
  '<script>alert(1)</script>',
  "' OR '1'='1",
  '<img src=x onerror=alert(1)>',
  '../../etc/passwd',
  '${7*7}',
];

export const SAMPLE_EMAILS = ['ana@correo.com', 'ana@@correo.com', 'a..b@correo.com', '<script>@x.com', 'sin-arroba.com'];
export const SAMPLE_PASSWORDS = ['123456', 'Password1', 'Edumotion2026', 'T0rre-Azul#Lluvia9'];
export const SAMPLE_URLS = ['https://www.uniminuto.edu.co', 'https://ejemplo.com', 'javascript:alert(1)', 'https://usuario:clave@ejemplo.com', 'https://192.168.1.1/admin', 'data:text/html,<script>alert(1)</script>'];

export const SAMPLE_FORMS = {
  valido: { name: 'Ana Pérez', email: 'ana@correo.com', subject: 'Información de cursos', message: 'Quiero saber más del curso de Data Science.' },
  ataque: { name: '<script>alert(1)</script>', email: 'no-es-correo', subject: "'; DROP TABLE users;--", message: '<img src=x onerror=alert(1)> ../../etc/passwd' },
};

// Analiza un texto de prueba y deja constancia del resultado en la bitácora.
export function analyzeInput(text) {
  const threats = detectThreats(text);
  const sanitized = sanitizeText(text, { multiline: true });
  if (threats.length) {
    logSecurityEvent({ type: `Prueba detectada: ${threats.join(', ')}`, detail: 'Probador de entradas.', severity: 'alta' });
  } else {
    logSecurityEvent({ type: 'Prueba de entrada segura', detail: 'Probador de entradas.', severity: 'info' });
  }
  return { threats, sanitized, safe: threats.length === 0 };
}

export function analyzeEmail(email) {
  const value = String(email ?? '').trim();
  const issues = [];
  const threats = detectThreats(value);

  if (!value) issues.push('El correo está vacío.');
  if (value.length > 254) issues.push('Supera los 254 caracteres.');
  if (value && !value.includes('@')) issues.push('Falta el símbolo @.');
  if (value.split('@').length > 2) issues.push('Tiene más de un símbolo @.');
  if (value.includes('..')) issues.push('Tiene puntos consecutivos.');
  if (threats.length) issues.push(`Contenido malicioso detectado: ${threats.join(', ')}.`);
  if (!issues.length && !isValidEmail(value)) issues.push('El formato no es válido.');

  const valid = issues.length === 0;
  logSecurityEvent({
    type: valid ? 'Prueba de correo válido' : 'Prueba de correo rechazado',
    detail: valid ? 'Formato correcto.' : `${issues.length} problema(s) encontrados.`,
    severity: threats.length ? 'alta' : valid ? 'info' : 'baja',
  });
  return { valid, issues };
}

export function analyzePassword(password) {
  const result = evaluatePassword(password);
  logSecurityEvent({
    type: `Prueba de contraseña: ${result.level}`,
    detail: `${result.score}/${result.total} requisitos. La contraseña no se almacena.`,
    severity: result.acceptable ? 'info' : 'baja',
  });
  return result;
}

export function analyzeUrl(url) {
  const result = checkUrl(url);
  logSecurityEvent({
    type: `Prueba de URL: ${result.level}`,
    detail: result.issues.length ? `${result.issues.length} observación(es).` : 'Sin observaciones.',
    severity: result.level === 'bloqueada' ? 'alta' : result.level === 'advertencia' ? 'media' : 'info',
  });
  return result;
}

export function analyzeForm(fields) {
  const result = validateContact(fields);
  for (const { field, type } of result.threats) {
    logSecurityEvent({ type: `Formulario de prueba: ${type}`, detail: `Campo "${field}" rechazado.`, severity: 'alta' });
  }
  if (!result.threats.length) {
    logSecurityEvent({
      type: result.valid ? 'Formulario de prueba válido' : 'Formulario de prueba inválido',
      detail: result.valid ? 'Todos los campos pasaron la validación.' : `${Object.keys(result.errors).length} campo(s) con error.`,
      severity: result.valid ? 'info' : 'baja',
    });
  }
  return result;
}

// Demostración del límite de envíos con almacenamiento en memoria (no afecta al formulario real).
export function createRateLimitDemo({ max = 3, windowMs = 60_000, now = Date.now } = {}) {
  const data = new Map();
  const storage = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
  const limiter = createRateLimiter({ key: 'demo', max, windowMs, storage, now });
  let count = 0;

  return {
    max,
    attempt() {
      count += 1;
      const result = limiter.attempt();
      logSecurityEvent({
        type: result.allowed ? 'Simulación: envío permitido' : 'Simulación: envío bloqueado',
        detail: result.allowed ? `Intento ${count} dentro del límite.` : `Reintento en ${Math.ceil(result.retryAfterMs / 1000)}s.`,
        severity: result.allowed ? 'info' : 'media',
      });
      return { ...result, count };
    },
  };
}

export const SELF_TEST_VECTORS = [
  { name: 'XSS: etiqueta script', input: '<script>alert(1)</script>', expect: 'threat' },
  { name: 'XSS: evento onerror', input: '<img src=x onerror=alert(1)>', expect: 'threat' },
  { name: 'XSS: svg onload', input: '<svg/onload=alert(1)>', expect: 'threat' },
  { name: 'XSS: protocolo javascript', input: 'javascript:alert(1)', expect: 'threat' },
  { name: 'SQLi: OR 1=1', input: "' OR '1'='1", expect: 'threat' },
  { name: 'SQLi: UNION SELECT', input: 'x UNION SELECT password FROM users', expect: 'threat' },
  { name: 'SQLi: DROP TABLE', input: '1; DROP TABLE users', expect: 'threat' },
  { name: 'Path traversal (Linux)', input: '../../etc/passwd', expect: 'threat' },
  { name: 'Path traversal (Windows)', input: '..\\..\\windows\\system32', expect: 'threat' },
  { name: 'Plantilla ${}', input: '${7*7}', expect: 'threat' },
  { name: 'Plantilla {{}}', input: '{{7*7}}', expect: 'threat' },
  { name: 'Texto legítimo', input: 'Hola, quiero información del curso.', expect: 'safe' },
  { name: 'Nombre con apóstrofe', input: "María O'Brien", expect: 'safe' },
  { name: 'Texto con números', input: 'Curso de Data Science 2026', expect: 'safe' },
];

// Ejecuta todos los vectores y comprueba que cada uno se clasifica como se espera.
export function runSelfTest() {
  const results = SELF_TEST_VECTORS.map((vector) => {
    const found = detectThreats(vector.input);
    const outcome = found.length ? 'threat' : 'safe';
    return { ...vector, found, passed: outcome === vector.expect };
  });
  const passed = results.filter((r) => r.passed).length;
  logSecurityEvent({
    type: 'Autodiagnóstico ejecutado',
    detail: `${passed}/${results.length} vectores clasificados correctamente.`,
    severity: passed === results.length ? 'info' : 'alta',
  });
  return { results, passed, total: results.length };
}
