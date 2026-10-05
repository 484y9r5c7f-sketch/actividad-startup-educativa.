import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePassword } from '../models/security/password.js';
import { checkUrl } from '../models/security/urlGuard.js';
import { securityLogToCsv, countBySeverity } from '../models/security/securityLog.js';
import { analyzeEmail, analyzeForm, createRateLimitDemo, runSelfTest, SAMPLE_FORMS, SAMPLE_URLS } from './securityController.js';

test('contraseñas: débil, media y fuerte', () => {
  assert.equal(evaluatePassword('').level, 'muy débil');
  assert.equal(evaluatePassword('123456').level, 'débil');
  assert.equal(evaluatePassword('Password1').acceptable, false);
  assert.equal(evaluatePassword('T0rre-Azul#Lluvia9').acceptable, true);
  assert.ok(evaluatePassword('T0rre-Azul#Lluvia9').entropyBits > 80);
});

test('contraseñas: rechaza repeticiones y comunes', () => {
  assert.equal(evaluatePassword('Aaaa1111!!!!zzzz').checks.find((c) => c.id === 'repeat').ok, false);
  assert.equal(evaluatePassword('MiPassword#2026x').checks.find((c) => c.id === 'common').ok, false);
});

test('URLs: segura, advertencia y bloqueada', () => {
  assert.equal(checkUrl('https://www.uniminuto.edu.co').level, 'segura');
  assert.equal(checkUrl('http://ejemplo.com').level, 'advertencia');
  assert.ok(SAMPLE_URLS.every((url) => !url.startsWith('http://')));
  assert.equal(checkUrl('javascript:alert(1)').level, 'bloqueada');
  assert.equal(checkUrl('data:text/html,<script>alert(1)</script>').safe, false);
  assert.equal(checkUrl('https://user:pass@ejemplo.com').safe, false);
  assert.equal(checkUrl('http://192.168.1.1/admin').safe, false);
  assert.equal(checkUrl('http://localhost:3000').safe, false);
  assert.equal(checkUrl('https://xn--pple-43d.com').level, 'advertencia');
  assert.equal(checkUrl('').safe, false);
  assert.equal(checkUrl('no es url').safe, false);
});

test('el CSV neutraliza fórmulas y comillas', () => {
  const csv = securityLogToCsv([{ at: '2026-01-01', severity: 'alta', type: '=HYPERLINK("x")', detail: '+cmd|calc' }]);
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`));
  assert.ok(csv.includes(`"'+cmd|calc"`));
});

test('countBySeverity cuenta por nivel', () => {
  const counts = countBySeverity([{ severity: 'alta' }, { severity: 'alta' }, { severity: 'info' }]);
  assert.deepEqual(counts, { alta: 2, media: 0, baja: 0, info: 1 });
});

test('analyzeEmail explica los problemas', () => {
  assert.equal(analyzeEmail('ana@correo.com').valid, true);
  assert.equal(analyzeEmail('ana@@correo.com').valid, false);
  assert.ok(analyzeEmail('<script>@x.com').issues.some((i) => i.includes('XSS')));
  assert.ok(analyzeEmail('sin-arroba.com').issues.includes('Falta el símbolo @.'));
});

test('analyzeForm acepta el ejemplo válido y rechaza el ataque', () => {
  assert.equal(analyzeForm(SAMPLE_FORMS.valido).valid, true);
  const attack = analyzeForm(SAMPLE_FORMS.ataque);
  assert.equal(attack.valid, false);
  assert.ok(attack.threats.length >= 3);
});

test('el limitador de demostración bloquea el cuarto intento', () => {
  const demo = createRateLimitDemo();
  assert.equal(demo.attempt().allowed, true);
  assert.equal(demo.attempt().allowed, true);
  assert.equal(demo.attempt().allowed, true);
  assert.equal(demo.attempt().allowed, false);
});

test('el autodiagnóstico clasifica todos los vectores correctamente', () => {
  const { passed, total, results } = runSelfTest();
  assert.deepEqual(results.filter((r) => !r.passed).map((r) => r.name), []);
  assert.equal(passed, total);
});
