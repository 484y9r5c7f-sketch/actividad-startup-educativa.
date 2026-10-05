import React from 'react';

// Campo de formulario accesible con mensaje de error y límite de longitud.
export default function FormField({ id, label, error, as = 'input', multiline = false, ...props }) {
  const Control = multiline ? 'textarea' : as;
  const errorId = `${id}-error`;
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <Control
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Campo trampa: invisible para personas, los bots suelen completarlo.
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label htmlFor="website">No completar este campo</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
