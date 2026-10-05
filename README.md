# Edumotion SPA

Aplicación React + Vite organizada con el patrón MVC.

## Estructura

```
src/
├── assets/       recursos estáticos
├── models/       datos y lógica de negocio (cursos, validación, sanitización, límite de envíos, bitácora)
├── controllers/  rutas, flujo de envío del contacto y centro de seguridad
├── views/        componentes, páginas y estilos
└── main.jsx      punto de entrada
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run preview` | Sirve el build con CSP completa |
| `npm run lint` | ESLint |
| `npm test` | Pruebas de seguridad (14, con `node --test`) |

## Seguridad

- **Validación y sanitización** de todos los campos (`models/security/validators.js`, `sanitizer.js`).
- **Detección de ataques**: XSS, inyección SQL, path traversal e inyección de plantillas.
- **Límite de envíos**: 3 por minuto (`rateLimiter.js`).
- **Anti-bots**: campo honeypot y tiempo mínimo de llenado.
- **Cabeceras HTTP** (`vite.config.js`): CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP.
- **Bitácora** sin datos personales, visible en `/seguridad`, donde también hay un probador de entradas.
- **Dependencias**: `npm audit` sin vulnerabilidades.
- Búsqueda de cursos sin `RegExp` y con la consulta sanitizada; enlaces externos con `rel="noopener noreferrer"`.

### Limitaciones

El proyecto no tiene backend, así que el envío se simula y el límite de envíos vive en el navegador. En producción, la validación, el límite de envíos y la protección CSRF deben repetirse en el servidor.
## Centro de seguridad (`/seguridad`)

Página interactiva para demostrar las protecciones. Todo corre en el navegador y cada prueba queda en la bitácora.

| Probador | Qué hace | Entrada de ejemplo |
|---|---|---|
| Texto libre | Detecta XSS, SQLi, path traversal e inyección de plantillas y muestra el texto sanitizado | `<script>alert(1)</script>`, `' OR '1'='1`, `../../etc/passwd`, `${7*7}` |
| Correo | Valida formato y longitud | `a@b`, `user@dominio.com` |
| Contraseña | Puntaje, entropía estimada y lista de requisitos | `123456` vs `Edu#Motion2026!x` |
| URL | Bloquea `javascript:`, `data:`, credenciales en la URL y hosts internos (SSRF) | `javascript:alert(1)`, `http://127.0.0.1` |
| Formulario completo | Valida nombre, correo y mensaje a la vez, con errores por campo | nombre `<b>x</b>` |
| Límite de envíos | Simula 3 envíos/minuto; el cuarto es rechazado | pulsar "Intentar envío" 4 veces |
| Autodiagnóstico | Ejecuta 14 vectores (ataques y textos legítimos) y reporta 14/14 | botón "Ejecutar" |

### Bitácora en vivo
- Se actualiza al instante con cada prueba y con el formulario real de `/contacto`.
- Filtro por severidad (alta, media, baja, info), contadores y exportación a **CSV** (neutraliza fórmulas `=`, `+`, `-`, `@`) o **JSON**.
- Guarda solo los últimos 50 eventos en `sessionStorage`; nunca guarda lo que escribió el usuario.

### Formulario real (`/contacto`)
Honeypot, tiempo mínimo de 2 s, máximo 3 envíos/minuto, validación por campo y sanitización. El envío es simulado (no hay backend).

## Pruebas
`npm test` ejecuta 23 pruebas (sanitizador, validadores, límite, bitácora, controladores). Además: `npm run lint` y `npm run build`.

## Guía para el informe
1. **Estático:** analizar en SonarCloud antes/después y capturar el dashboard (seguridad, fiabilidad, mantenibilidad, duplicación).
2. **Dinámico:** `npm run build; npm run preview` y escanear `http://localhost:4173` con OWASP ZAP (la CSP completa solo aplica en build/preview).
3. **Pruebas de entrada:** capturas de `/seguridad` (cada probador, autodiagnóstico 14/14 y bitácora).
4. **Mitigación:** explicar cada protección de la tabla y las limitaciones.

> En producción, validación, límite de envíos y CSRF deben repetirse en el servidor.