import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Guarda para mostrar detalles y/o enviar a un servicio de errores
    this.setState({ error, info });
    console.error('ErrorBoundary captured an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, Arial', color: '#111' }}>
          <h2>Ha ocurrido un error</h2>
          <p>La aplicación encontró un problema al renderizar. Puedes recargar la página o revisar la consola para más detalles.</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', marginRight: 8 }}>Recargar</button>
            <button onClick={() => { navigator.clipboard?.writeText(String(this.state.error) + '\n' + JSON.stringify(this.state.info)); }} style={{ padding: '8px 12px' }}>
              Copiar error
            </button>
          </div>
          <details style={{ marginTop: 12 }}>
            <summary>Detalles (levanta la consola también)</summary>
            <pre style={{ whiteSpace: 'pre-wrap', color: '#333' }}>
              {String(this.state.error)}
              {'\n'}
              {this.state.info?.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
