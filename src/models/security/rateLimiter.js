const fallbackHits = new Map();

// Limitador de envíos por ventana de tiempo. El almacenamiento y el reloj son inyectables.
export function createRateLimiter({ key = 'edumotion:rate', max = 3, windowMs = 60_000, storage, now = Date.now } = {}) {
  const read = () => {
    if (fallbackHits.has(key)) {
      return fallbackHits.get(key).filter((t) => Number.isFinite(t) && now() - t < windowMs);
    }

    try {
      const parsed = JSON.parse(storage?.getItem(key) ?? '[]');
      return Array.isArray(parsed) ? parsed.filter((t) => Number.isFinite(t) && now() - t < windowMs) : [];
    } catch {
      return [];
    }
  };

  return {
    // Registra un intento y dice si está permitido.
    attempt() {
      const hits = read();
      if (hits.length >= max) {
        return { allowed: false, retryAfterMs: windowMs - (now() - hits[0]) };
      }
      hits.push(now());
      try {
        if (typeof storage?.setItem === 'function') {
          storage.setItem(key, JSON.stringify(hits));
          fallbackHits.delete(key);
        } else {
          fallbackHits.set(key, hits);
        }
      } catch {
        fallbackHits.set(key, hits);
      }
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}
