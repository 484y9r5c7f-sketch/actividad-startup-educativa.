const COMMON_PASSWORDS = ['123456', '12345678', 'password', 'qwerty', 'admin', 'letmein', 'welcome', 'iloveyou', 'contraseña', 'abc123', 'edumotion'];

// Evalúa la fortaleza de una contraseña. La contraseña nunca se guarda ni se registra.
export function evaluatePassword(password) {
  const value = String(password ?? '');
  const lower = value.toLowerCase();

  const checks = [
    { id: 'length', label: 'Al menos 12 caracteres', ok: value.length >= 12 },
    { id: 'lower', label: 'Contiene minúsculas', ok: /\p{Ll}/u.test(value) },
    { id: 'upper', label: 'Contiene mayúsculas', ok: /\p{Lu}/u.test(value) },
    { id: 'digit', label: 'Contiene números', ok: /\d/.test(value) },
    { id: 'symbol', label: 'Contiene símbolos', ok: /[^\p{L}\d\s]/u.test(value) },
    { id: 'common', label: 'No es una contraseña común', ok: value.length > 0 && !COMMON_PASSWORDS.some((p) => lower.includes(p)) },
    { id: 'repeat', label: 'Sin caracteres repetidos 3 o más veces seguidas', ok: value.length > 0 && !/(.)\1{2,}/u.test(value) },
  ];

  const score = checks.filter((c) => c.ok).length;
  let level = 'muy débil';
  if (value.length >= 8) level = score >= 7 ? 'muy fuerte' : score >= 6 ? 'fuerte' : score >= 4 ? 'media' : 'débil';
  else if (value.length > 0) level = 'débil';

  const pool = (/\p{Ll}/u.test(value) ? 26 : 0) + (/\p{Lu}/u.test(value) ? 26 : 0) + (/\d/.test(value) ? 10 : 0) + (/[^\p{L}\d]/u.test(value) ? 32 : 0);
  const entropyBits = value.length && pool ? Math.round(value.length * Math.log2(pool)) : 0;

  return { checks, score, total: checks.length, level, entropyBits, acceptable: level === 'fuerte' || level === 'muy fuerte' };
}
