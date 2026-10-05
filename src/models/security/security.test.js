import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectThreats, sanitizeText, sanitizeQuery } from './sanitizer.js';
import { validateContact } from './validators.js';
import { createRateLimiter } from './rateLimiter.js';

const memoryStorage = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) };
};

test('detecta XSS, SQLi, traversal y plantillas', () => {
  assert.deepEqual(detectThreats('<script>alert(1)</script>'), ['XSS']);
  assert.ok(detectThreats("' OR '1'='1").includes('SQLi'));
  assert.ok(detectThreats('1; DROP TABLE users').includes('SQLi'));
  assert.ok(detectThreats('../../etc/passwd').includes('Path traversal'));
  assert.ok(detectThreats('${7*7}').includes('Inyección de plantillas'));
  assert.ok(detectThreats('<img src=x onerror=alert(1)>').includes('XSS'));
  assert.ok(detectThreats('javascript:alert(1)').includes('XSS'));
});

test('no marca texto legítimo como amenaza', () => {
  assert.deepEqual(detectThreats('Hola, quiero información sobre el curso de Data Science.'), []);
  assert.deepEqual(detectThreats("María O'Brien-Pérez"), []);
});

test('sanitizeText elimina etiquetas, control y espacios invisibles y limita longitud', () => {
  assert.equal(sanitizeText('Hola <b>mundo</b>'), 'Hola mundo');
  assert.equal(sanitizeText('a\u0000b\u200Bc'), 'abc');
  assert.equal(sanitizeText('x'.repeat(50), { maxLength: 10 }).length, 10);
  assert.equal(sanitizeText(null), '');
});

test('sanitizeQuery solo conserva letras, números, espacios y guiones', () => {
  assert.equal(sanitizeQuery('React; (DROP)'), 'React DROP');
  assert.equal(sanitizeQuery('<b>Datos</b>'), 'Datos');
});

test('validateContact acepta datos correctos y los sanitiza', () => {
  const result = validateContact({ name: 'Ana Pérez', email: 'ana@correo.com', message: 'Quiero más información' });
  assert.equal(result.valid, true);
  assert.equal(result.values.email, 'ana@correo.com');
});

test('validateContact rechaza campos inválidos y reporta amenazas', () => {
  const result = validateContact({ name: '<script>x</script>', email: 'no-es-correo', message: 'corto' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.name && result.errors.email && result.errors.message);
  assert.ok(result.threats.some((t) => t.field === 'name' && t.type === 'XSS'));
});

test('validateContact rechaza correos con puntos consecutivos', () => {
  const result = validateContact({ name: 'Ana', email: 'a..b@correo.com', message: 'mensaje de prueba' });
  assert.ok(result.errors.email);
});

test('el limitador bloquea tras el máximo y se libera con el tiempo', () => {
  let t = 1_000_000;
  const limiter = createRateLimiter({ storage: memoryStorage(), max: 2, windowMs: 60_000, now: () => t });
  assert.equal(limiter.attempt().allowed, true);
  assert.equal(limiter.attempt().allowed, true);
  const blocked = limiter.attempt();
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterMs > 0);
  t += 61_000;
  assert.equal(limiter.attempt().allowed, true);
});

test('el limitador conserva el límite en memoria si el almacenamiento no está disponible', () => {
  const key = `unavailable-storage-${Date.now()}-${Math.random()}`;
  const storage = {
    getItem() { throw new Error('storage unavailable'); },
    setItem() { throw new Error('storage unavailable'); },
  };
  const options = { key, storage, max: 2, now: () => 1_000_000 };
  const limiter = createRateLimiter(options);

  assert.equal(limiter.attempt().allowed, true);
  assert.equal(limiter.attempt().allowed, true);
  assert.equal(createRateLimiter(options).attempt().allowed, false);
});
