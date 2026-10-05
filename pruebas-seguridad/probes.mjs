import { detectThreats } from '../src/models/security/sanitizer.js';
import { validateContact } from '../src/models/security/validators.js';
import { createRateLimiter } from '../src/models/security/rateLimiter.js';
import { submitContact } from '../src/controllers/contactController.js';
import { logSecurityEvent, readSecurityLog } from '../src/models/security/securityLog.js';

const rows = [];
const record = (caseName, result) => rows.push({ case: caseName, ...result });
const valid = { name: 'Ana Pérez', email: 'ana@example.com', message: 'Quiero información sobre cursos.' };
for (const [label, input] of [
  ['XSS directo', '<script>alert(1)</script>'],
  ['SQLi directo', "' OR '1'='1"],
  ['Traversal directo', '../../etc/passwd'],
  ['Plantilla directa', '${7*7}'],
  ['XSS con caracteres de ancho completo', '＜script＞alert(1)＜/script＞'],
  ['Traversal codificado', '%2e%2e%2fetc%2fpasswd'],
  ['Texto legítimo sobre programación', 'Quiero aprender a usar onload= en JavaScript.'],
]) {
  const result = validateContact({ ...valid, message: input });
  record(label, { detected: detectThreats(input), acceptedByValidator: result.valid, sanitized: result.values.message });
}
record('Mensaje mayor que máximo', { accepted: validateContact({ ...valid, message: 'a'.repeat(1100) }).valid, resultingLength: validateContact({ ...valid, message: 'a'.repeat(1100) }).values.message.length });
const data = new Map();
const storage = { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
const limiter = createRateLimiter({ storage, now: () => 100000 });
record('Cuatro intentos seguidos', { allowed: Array.from({ length: 4 }, () => limiter.attempt().allowed) });
data.clear();
record('Borrar almacenamiento reinicia límite', { allowed: limiter.attempt().allowed });
const unavailable = { getItem() { throw new Error('storage unavailable'); }, setItem() { throw new Error('storage unavailable'); } };
const noStorageLimiter = createRateLimiter({ storage: unavailable, now: () => 100000 });
record('Almacenamiento inaccesible', { allowed: Array.from({ length: 5 }, () => noStorageLimiter.attempt().allowed) });
let sent = false;
const result = await submitContact({ ...valid, message: '<script>alert(1)</script>' }, { storage, startedAt: 90000, now: () => 100000, transport: async () => { sent = true; }, log: () => {} });
record('Ataque rechazado antes del transporte', { code: result.code, transportCalled: sent });
for (let i = 0; i < 55; i++) logSecurityEvent({ type: 'Prueba', detail: 'Sin datos personales' }, storage);
record('Límite de bitácora', { count: readSecurityLog(storage).length });
console.log(JSON.stringify({ timestamp: new Date().toISOString(), scope: 'Pruebas locales de funciones; detectar un patrón no demuestra explotación.', results: rows }, null, 2));
