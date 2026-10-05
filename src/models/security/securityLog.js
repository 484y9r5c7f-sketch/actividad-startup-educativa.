const KEY = 'edumotion:security-log';
const EVENT = 'edumotion:security-log';
const MAX_EVENTS = 50;
let eventSequence = 0;

const createEventId = () => globalThis.crypto?.randomUUID?.()
  ?? `${Date.now()}-${eventSequence += 1}`;

const getStorage = () => {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
};

const notify = () => {
  try {
    globalThis.dispatchEvent?.(new Event(EVENT));
  } catch {
    // Sin entorno de navegador.
  }
};

// Permite que la página de seguridad se actualice en vivo cuando llega un evento.
export function subscribeSecurityLog(callback) {
  globalThis.addEventListener?.(EVENT, callback);
  return () => globalThis.removeEventListener?.(EVENT, callback);
}

export function readSecurityLog(storage = getStorage()) {
  try {
    const parsed = JSON.parse(storage?.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Bitácora de eventos de seguridad. Nunca guarda datos personales ni la entrada original.
export function logSecurityEvent({ type, detail, severity = 'media' }, storage = getStorage()) {
  const event = { id: createEventId(), at: new Date().toISOString(), type, detail, severity };
  const events = [event, ...readSecurityLog(storage)].slice(0, MAX_EVENTS);
  try {
    storage?.setItem(KEY, JSON.stringify(events));
  } catch {
    // Ignorar: la bitácora es informativa.
  }
  notify();
  return event;
}

export function clearSecurityLog(storage = getStorage()) {
  try {
    storage?.removeItem(KEY);
  } catch {
    // Ignorar.
  }
  notify();
}

export function countBySeverity(events) {
  return events.reduce((acc, e) => ({ ...acc, [e.severity]: (acc[e.severity] ?? 0) + 1 }), { alta: 0, media: 0, baja: 0, info: 0 });
}

// Exporta a CSV neutralizando fórmulas (CSV injection) en cualquier celda.
export function securityLogToCsv(events) {
  const cell = (value) => {
    let text = String(value ?? '');
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const rows = events.map((e) => [e.at, e.severity, e.type, e.detail].map(cell).join(','));
  return ['"fecha","severidad","evento","detalle"', ...rows].join('\n');
}
