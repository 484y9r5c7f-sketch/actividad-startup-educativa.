import React, { useEffect, useMemo, useState } from 'react';
import {
  clearSecurityLog, countBySeverity, readSecurityLog, securityLogToCsv, subscribeSecurityLog,
} from '../../models/security/securityLog';

const SEVERITIES = ['alta', 'media', 'baja', 'info'];

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Bitácora en vivo: se actualiza sola cuando cualquier probador o formulario registra un evento.
export default function SecurityLog() {
  const [events, setEvents] = useState(() => readSecurityLog());
  const [filter, setFilter] = useState('todas');

  useEffect(() => subscribeSecurityLog(() => setEvents(readSecurityLog())), []);

  const counts = useMemo(() => countBySeverity(events), [events]);
  const visible = filter === 'todas' ? events : events.filter((e) => e.severity === filter);

  return (
    <section aria-labelledby="log-title">
      <div className="log-header">
        <h2 id="log-title">Bitácora de eventos en vivo</h2>
        <div className="analyzer-actions">
          <button type="button" className="btn-outline" disabled={!events.length} onClick={() => download('bitacora-seguridad.csv', securityLogToCsv(events), 'text/csv')}>Exportar CSV</button>
          <button type="button" className="btn-outline" disabled={!events.length} onClick={() => download('bitacora-seguridad.json', JSON.stringify(events, null, 2), 'application/json')}>Exportar JSON</button>
          <button type="button" className="btn-outline" disabled={!events.length} onClick={() => clearSecurityLog()}>Limpiar</button>
        </div>
      </div>

      <div className="log-summary" aria-live="polite">
        <span><strong>{events.length}</strong> eventos</span>
        {SEVERITIES.map((s) => (
          <span key={s} className={`sev sev-${s}`}>{s}: {counts[s]}</span>
        ))}
        <label htmlFor="log-filter" className="sr-only">Filtrar por severidad</label>
        <select id="log-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="todas">Todas las severidades</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <p>Aún no hay eventos. Usa un probador, ejecuta el autodiagnóstico o envía el formulario de contacto con datos inválidos.</p>
      ) : (
        <table className="log-table">
          <thead>
            <tr><th>Hora</th><th>Severidad</th><th>Evento</th><th>Detalle</th></tr>
          </thead>
          <tbody>
            {visible.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.at).toLocaleTimeString('es-CO')}</td>
                <td><span className={`sev sev-${e.severity}`}>{e.severity}</span></td>
                <td>{e.type}</td>
                <td>{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="log-note">Solo se guardan los últimos 50 eventos en <code>sessionStorage</code> (se borran al cerrar la pestaña). Nunca se almacena lo que escribió la persona.</p>
    </section>
  );
}
