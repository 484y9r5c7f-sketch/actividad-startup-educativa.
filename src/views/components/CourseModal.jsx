import React, { useEffect, useRef } from 'react';

const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const CourseModal = ({ course, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  if (!course) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modal-overlay"
      aria-labelledby="course-modal-title"
      style={{
        position: 'fixed', inset: 0, margin: 0, width: '100%', height: '100%',
        maxWidth: 'none', maxHeight: 'none', border: 'none',
        background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000, padding: 20,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 20, maxWidth: 900, width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        <button type="button" onClick={onClose} autoFocus style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }} aria-label="Cerrar detalles del curso">×</button>

        <img src={course.image} alt={course.title} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />

        <h2 id="course-modal-title" style={{ marginTop: 0 }}>{course.title}</h2>
        <p style={{ color: '#6b7280' }}>{course.longDescription || course.description}</p>

        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
            <strong>Precio</strong>
            <div style={{ marginTop: 6 }}>{formatCOP(course.priceCOP)}</div>
          </div>
          <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
            <strong>Duración</strong>
            <div style={{ marginTop: 6 }}>{course.duration}</div>
          </div>
          <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
            <strong>Nivel</strong>
            <div style={{ marginTop: 6 }}>{course.level}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <h3>Plan de estudio</h3>
            <ol>
              {course.plan.map((p) => <li key={p} style={{ marginBottom: 8 }}>{p}</li>)}
            </ol>
          </div>
          <div style={{ flex: '0 0 240px' }}>
            <h3>Resultados</h3>
            <ul>
              {course.outcomes.map((o) => <li key={o}>{o}</li>)}
            </ul>

            <h4 style={{ marginTop: 12 }}>Requisitos</h4>
            <ul>
              {course.prerequisites.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <strong>Objetivos:</strong>
            <ul style={{ marginTop: 8 }}>
              {course.goals.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </div>
          <div>
            <button style={{ background: '#0b6fff', color: '#fff', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
              Inscribirme — {formatCOP(course.priceCOP)}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default CourseModal;
