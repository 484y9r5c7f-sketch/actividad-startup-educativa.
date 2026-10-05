import { detectThreats } from './sanitizer.js';

const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0|\[?::1\]?$)/i;
const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:'];

// Revisa una URL antes de usarla en un enlace o redirección (XSS, SSRF, phishing).
export function checkUrl(input) {
  const value = String(input ?? '').trim();
  const issues = [];

  if (!value) return { safe: false, level: 'bloqueada', issues: [{ level: 'block', text: 'La URL está vacía.' }] };

  const threats = detectThreats(value);
  if (threats.length) issues.push({ level: 'block', text: `Contenido malicioso detectado: ${threats.join(', ')}.` });

  let url = null;
  try {
    url = new URL(value);
  } catch {
    issues.push({ level: 'block', text: 'No es una URL absoluta válida (falta el protocolo, por ejemplo https://).' });
  }

  if (url) {
    if (BLOCKED_PROTOCOLS.includes(url.protocol)) issues.push({ level: 'block', text: `Protocolo no permitido: ${url.protocol}` });
    else if (url.protocol === 'http:') issues.push({ level: 'warn', text: 'Usa HTTP sin cifrar. Prefiere HTTPS.' });
    else if (url.protocol !== 'https:') issues.push({ level: 'block', text: `Protocolo no permitido: ${url.protocol}` });

    if (url.username || url.password) issues.push({ level: 'block', text: 'La URL incluye credenciales (usuario:clave@).' });
    if (PRIVATE_HOST.test(url.hostname)) issues.push({ level: 'block', text: 'Apunta a una dirección interna o local (riesgo de SSRF).' });
    if (url.hostname.includes('xn--')) issues.push({ level: 'warn', text: 'Dominio en punycode: posible suplantación con caracteres parecidos.' });
  }

  const blocked = issues.some((i) => i.level === 'block');
  const level = blocked ? 'bloqueada' : issues.length ? 'advertencia' : 'segura';
  return { safe: !blocked, level, issues };
}
