// Reglas de detección de entradas maliciosas (XSS, SQLi, traversal, inyección de plantillas).
const THREAT_RULES = [
  { type: 'XSS', pattern: /<\/?(?:script|iframe|object|embed|svg|img|link|style|meta|form)\b/i },
  { type: 'XSS', pattern: /\bon[a-z]{3,20}\s*=/i },
  { type: 'XSS', pattern: /(javascript|vbscript|data)\s*:/i },
  { type: 'SQLi', pattern: /('|")\s*(or|and)\s+['"\d]+\s*=\s*['"\d]+/i },
  { type: 'SQLi', pattern: /\b(union\s+(all\s+)?select|drop\s+table|insert\s+into|delete\s+from|update\s+\w+\s+set)\b/i },
  { type: 'SQLi', pattern: /(;|--|\/\*)\s*(drop|select|insert|delete|update|shutdown)\b/i },
  { type: 'Path traversal', pattern: /(\.\.[/\\]){1,}/ },
];

const hasTemplateInjection = (text) => {
  const hasClosedExpression = (start, offset) => {
    const expressionStart = text.indexOf(start);
    return expressionStart !== -1 && text.indexOf('}', expressionStart + offset) !== -1;
  };

  return hasClosedExpression('${', 2) || hasClosedExpression('{{', 2);
};

const stripTags = (text) => {
  let result = '';
  let insideTag = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '<') {
      insideTag = true;
      continue;
    }
    if (insideTag) {
      if (character === '>') insideTag = false;
      continue;
    }
    result += character;
  }
  return result;
};

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g;

export function detectThreats(input) {
  const text = String(input ?? '');
  const found = new Set();
  for (const { type, pattern } of THREAT_RULES) {
    if (pattern.test(text)) found.add(type);
  }
  if (hasTemplateInjection(text)) found.add('Inyección de plantillas');
  return [...found];
}

// Elimina etiquetas HTML, caracteres de control y espacios invisibles.
export function sanitizeText(input, { maxLength = 2000, multiline = false } = {}) {
  let text = String(input ?? '')
    .normalize('NFKC')
    .replace(CONTROL_CHARS, '')
    .replace(ZERO_WIDTH, '');
  text = stripTags(text);

  text = multiline
    ? text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')
    : text.replace(/\s+/g, ' ');

  return text.trim().slice(0, maxLength);
}

// Deja pasar solo letras, números y espacios para búsquedas.
export function sanitizeQuery(input, maxLength = 60) {
  return sanitizeText(input, { maxLength }).replace(/[^\p{L}\p{N}\s-]/gu, '');
}
