import { test } from 'node:test';
import assert from 'node:assert/strict';
import { submitContact } from './contactController.js';

const memoryStorage = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
};

const valid = { name: 'Ana Pérez', email: 'ana@correo.com', message: 'Quiero más información' };

const setup = (overrides = {}) => {
  const events = [];
  const options = {
    storage: memoryStorage(),
    now: () => 100_000,
    startedAt: 90_000,
    transport: async () => {},
    log: (e) => events.push(e),
    ...overrides,
  };
  return { events, options };
};

test('envía un mensaje válido', async () => {
  const { options } = setup();
  const result = await submitContact(valid, options);
  assert.equal(result.ok, true);
});

test('bloquea bots con honeypot', async () => {
  const { options, events } = setup({ honeypot: 'http://spam.com' });
  const result = await submitContact(valid, options);
  assert.equal(result.code, 'bot');
  assert.equal(events[0].type, 'Bot detectado');
});

test('bloquea envíos demasiado rápidos', async () => {
  const { options } = setup({ startedAt: 99_500 });
  const result = await submitContact(valid, options);
  assert.equal(result.code, 'too-fast');
});

test('bloquea el cuarto envío dentro de un minuto', async () => {
  const { options } = setup();
  for (let i = 0; i < 3; i++) assert.equal((await submitContact(valid, options)).ok, true);
  assert.equal((await submitContact(valid, options)).code, 'rate-limited');
});

test('rechaza y registra ataques sin guardar el contenido', async () => {
  const { options, events } = setup();
  const payload = '<script>alert(1)</script>';
  const result = await submitContact({ ...valid, message: payload }, options);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'invalid');
  assert.ok(events.some((e) => e.type.includes('XSS')));
  assert.ok(events.every((e) => !JSON.stringify(e).includes('alert(1)')));
});

test('no envía si falla el transporte', async () => {
  const { options } = setup({ transport: async () => { throw new Error('x'); } });
  assert.equal((await submitContact(valid, options)).code, 'transport');
});
