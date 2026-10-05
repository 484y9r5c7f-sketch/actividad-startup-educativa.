import React, { useState } from 'react';
import Banner from '../components/Banner';
import SecurityLog from '../components/SecurityLog';
import {
  EmailTester, FormTester, InputTester, PasswordTester, RateLimitTester, SelfTest, UrlTester,
} from '../components/SecurityTesters';
import { PROTECTIONS } from '../../controllers/securityController';
import '../styles/Seguridad.css';

const TESTERS = [
  { id: 'input', label: 'Texto libre', Component: InputTester },
  { id: 'email', label: 'Correo', Component: EmailTester },
  { id: 'password', label: 'Contraseña', Component: PasswordTester },
  { id: 'url', label: 'URL', Component: UrlTester },
  { id: 'form', label: 'Formulario completo', Component: FormTester },
  { id: 'rate', label: 'Límite de envíos', Component: RateLimitTester },
  { id: 'self', label: 'Autodiagnóstico', Component: SelfTest },
];

export default function Seguridad() {
  const [active, setActive] = useState(TESTERS[0].id);
  const { Component } = TESTERS.find((t) => t.id === active);

  return (
    <main className="security-page">
      <Banner title="Centro de seguridad" subtitle="Así protegemos los datos que envías" />

      <section aria-labelledby="protections-title">
        <h2 id="protections-title">Protecciones activas</h2>
        <ul className="protection-grid">
          {PROTECTIONS.map((p) => (
            <li key={p.title} className="protection-card">
              <h3>✅ {p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="analyzer-title" className="analyzer">
        <h2 id="analyzer-title">Probadores de entrada</h2>
        <div className="tester-tabs" role="tablist" aria-label="Probadores">
          {TESTERS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls="tester-panel"
              className={`tester-tab ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div id="tester-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="tester-panel">
          <Component key={active} />
        </div>
      </section>

      <SecurityLog />
    </main>
  );
}
