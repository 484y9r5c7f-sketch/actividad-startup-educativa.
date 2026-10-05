import React, { useRef, useState } from 'react';
import {
  SAMPLE_EMAILS, SAMPLE_FORMS, SAMPLE_PASSWORDS, SAMPLE_PAYLOADS, SAMPLE_URLS,
  analyzeEmail, analyzeForm, analyzeInput, analyzePassword, analyzeUrl,
  createRateLimitDemo, runSelfTest,
} from '../../controllers/securityController';
import { LIMITS } from '../../models/security/validators';

function Samples({ items, onPick }) {
  return (
    <div className="analyzer-actions">
      {items.map((item) => (
        <button key={item} type="button" className="btn-outline" onClick={() => onPick(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function Verdict({ kind, children }) {
  return (
    <div className={`analysis ${kind}`} role="status">
      {children}
    </div>
  );
}

export function InputTester() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const run = (value) => setAnalysis(analyzeInput(value));

  return (
    <div>
      <p>Pega cualquier texto y mira si el sistema detecta una amenaza y cómo queda sanitizado.</p>
      <label htmlFor="payload" className="sr-only">Texto a analizar</label>
      <textarea id="payload" rows={3} maxLength={500} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ej: <script>alert(1)</script>" />
      <div className="analyzer-actions">
        <button type="button" className="btn-primary" onClick={() => run(text)}>Analizar</button>
      </div>
      <Samples items={SAMPLE_PAYLOADS} onPick={(s) => { setText(s); run(s); }} />
      {analysis && (
        <Verdict kind={analysis.safe ? 'safe' : 'danger'}>
          <p><strong>{analysis.safe ? 'Entrada segura' : `Amenaza detectada: ${analysis.threats.join(', ')}`}</strong></p>
          <p>Resultado sanitizado (texto plano): <code>{analysis.sanitized || '(vacío)'}</code></p>
        </Verdict>
      )}
    </div>
  );
}

export function EmailTester() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const run = (value) => setResult(analyzeEmail(value));

  return (
    <div>
      <p>Comprueba el formato del correo y si contiene código malicioso.</p>
      <label htmlFor="email-test" className="sr-only">Correo a analizar</label>
      <input id="email-test" type="text" maxLength={LIMITS.email.max} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@ejemplo.com" autoComplete="off" />
      <div className="analyzer-actions">
        <button type="button" className="btn-primary" onClick={() => run(email)}>Validar correo</button>
      </div>
      <Samples items={SAMPLE_EMAILS} onPick={(s) => { setEmail(s); run(s); }} />
      {result && (
        <Verdict kind={result.valid ? 'safe' : 'danger'}>
          <p><strong>{result.valid ? 'Correo válido' : 'Correo rechazado'}</strong></p>
          {result.issues.length > 0 && <ul>{result.issues.map((i) => <li key={i}>{i}</li>)}</ul>}
        </Verdict>
      )}
    </div>
  );
}

export function PasswordTester() {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState(null);
  const run = (value) => setResult(analyzePassword(value));

  return (
    <div>
      <p>Evalúa la fortaleza de una contraseña. No se guarda ni se registra; solo se anota el nivel.</p>
      <label htmlFor="password-test" className="sr-only">Contraseña a evaluar</label>
      <input id="password-test" type={visible ? 'text' : 'password'} maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Escribe una contraseña de prueba" autoComplete="new-password" />
      <div className="analyzer-actions">
        <button type="button" className="btn-primary" onClick={() => run(password)}>Evaluar</button>
        <button type="button" className="btn-outline" onClick={() => setVisible((v) => !v)}>{visible ? 'Ocultar' : 'Mostrar'}</button>
      </div>
      <Samples items={SAMPLE_PASSWORDS} onPick={(s) => { setPassword(s); run(s); }} />
      {result && (
        <Verdict kind={result.acceptable ? 'safe' : result.level === 'media' ? 'warn' : 'danger'}>
          <p><strong>Nivel: {result.level}</strong> ({result.score}/{result.total} requisitos, ~{result.entropyBits} bits de entropía)</p>
          <meter min={0} max={result.total} value={result.score} aria-label="Fortaleza de la contraseña" />
          <ul className="checklist">
            {result.checks.map((c) => <li key={c.id}>{c.ok ? '✅' : '❌'} {c.label}</li>)}
          </ul>
        </Verdict>
      )}
    </div>
  );
}

export function UrlTester() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const run = (value) => setResult(analyzeUrl(value));
  const kind = { segura: 'safe', advertencia: 'warn', bloqueada: 'danger' };

  return (
    <div>
      <p>Revisa una URL antes de usarla en un enlace: protocolo, credenciales, direcciones internas y dominios sospechosos.</p>
      <label htmlFor="url-test" className="sr-only">URL a analizar</label>
      <input id="url-test" type="text" maxLength={300} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://ejemplo.com" autoComplete="off" />
      <div className="analyzer-actions">
        <button type="button" className="btn-primary" onClick={() => run(url)}>Revisar URL</button>
      </div>
      <Samples items={SAMPLE_URLS} onPick={(s) => { setUrl(s); run(s); }} />
      {result && (
        <Verdict kind={kind[result.level]}>
          <p><strong>URL {result.level}</strong></p>
          {result.issues.length > 0 && <ul>{result.issues.map((i) => <li key={i.text}>{i.level === 'block' ? '⛔' : '⚠️'} {i.text}</li>)}</ul>}
        </Verdict>
      )}
    </div>
  );
}

const FORM_FIELDS = [
  { id: 'name', label: 'Nombre' },
  { id: 'email', label: 'Correo' },
  { id: 'subject', label: 'Asunto' },
  { id: 'message', label: 'Mensaje' },
];

export function FormTester() {
  const [fields, setFields] = useState(SAMPLE_FORMS.ataque);
  const [result, setResult] = useState(null);

  return (
    <div>
      <p>Ejecuta el mismo validador del formulario de contacto sobre los cuatro campos a la vez.</p>
      <div className="analyzer-actions">
        <button type="button" className="btn-outline" onClick={() => { setFields(SAMPLE_FORMS.valido); setResult(analyzeForm(SAMPLE_FORMS.valido)); }}>Cargar datos válidos</button>
        <button type="button" className="btn-outline" onClick={() => { setFields(SAMPLE_FORMS.ataque); setResult(analyzeForm(SAMPLE_FORMS.ataque)); }}>Cargar ataque</button>
      </div>
      <div className="form-tester-grid">
        {FORM_FIELDS.map(({ id, label }) => (
          <div key={id} className="form-group">
            <label htmlFor={`ft-${id}`}>{label}</label>
            <input id={`ft-${id}`} type="text" value={fields[id]} maxLength={1000} autoComplete="off" onChange={(e) => setFields((prev) => ({ ...prev, [id]: e.target.value }))} />
          </div>
        ))}
      </div>
      <div className="analyzer-actions">
        <button type="button" className="btn-primary" onClick={() => setResult(analyzeForm(fields))}>Validar formulario</button>
      </div>
      {result && (
        <Verdict kind={result.valid ? 'safe' : 'danger'}>
          <p><strong>{result.valid ? 'Formulario válido: se enviaría' : 'Formulario rechazado: no se enviaría'}</strong></p>
          <table className="log-table">
            <thead><tr><th>Campo</th><th>Estado</th><th>Valor sanitizado</th></tr></thead>
            <tbody>
              {FORM_FIELDS.map(({ id, label }) => (
                <tr key={id}>
                  <td>{label}</td>
                  <td>{result.errors[id] ? `❌ ${result.errors[id]}` : '✅ Correcto'}</td>
                  <td><code>{result.values[id] || '(vacío)'}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.threats.length > 0 && (
            <p>Amenazas: {result.threats.map((t) => `${t.type} en "${t.field}"`).join(' · ')}</p>
          )}
        </Verdict>
      )}
    </div>
  );
}

export function RateLimitTester() {
  const [demo, setDemo] = useState(() => createRateLimitDemo());
  const [history, setHistory] = useState([]);
  const lastId = useRef(0);

  const attempt = () => {
    const result = demo.attempt();
    lastId.current += 1;
    setHistory((prev) => [{ id: lastId.current, ...result }, ...prev].slice(0, 10));
  };
  const reset = () => { setDemo(createRateLimitDemo()); setHistory([]); };

  return (
    <div>
      <p>Simula envíos seguidos: se permiten {demo.max} por minuto y el siguiente se bloquea. No afecta al formulario real.</p>
      <div className="analyzer-actions">
        <button type="button" className="btn-primary" onClick={attempt}>Simular envío</button>
        <button type="button" className="btn-outline" onClick={reset}>Reiniciar</button>
      </div>
      {history.length > 0 && (
        <ul className="attempt-list">
          {history.map((h) => (
            <li key={h.id} className={h.allowed ? 'ok' : 'bad'}>
              Intento {h.count}: {h.allowed ? '✅ permitido' : `⛔ bloqueado (reintento en ${Math.ceil(h.retryAfterMs / 1000)} s)`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SelfTest() {
  const [report, setReport] = useState(null);

  return (
    <div>
      <p>Ejecuta {14} ataques y textos legítimos conocidos y comprueba que cada uno se clasifica correctamente.</p>
      <div className="analyzer-actions">
        <button type="button" className="btn-primary" onClick={() => setReport(runSelfTest())}>Ejecutar autodiagnóstico</button>
      </div>
      {report && (
        <>
          <Verdict kind={report.passed === report.total ? 'safe' : 'danger'}>
            <p><strong>{report.passed}/{report.total} vectores clasificados correctamente</strong></p>
          </Verdict>
          <table className="log-table">
            <thead><tr><th>Caso</th><th>Esperado</th><th>Detectado</th><th>Resultado</th></tr></thead>
            <tbody>
              {report.results.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>{r.expect === 'threat' ? 'Amenaza' : 'Seguro'}</td>
                  <td>{r.found.length ? r.found.join(', ') : 'Nada'}</td>
                  <td>{r.passed ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
