import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; message: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-100 p-8">
          <div className="text-center max-w-md">
            <img src="/Lolas_Logo.png" alt="Lola's Jewelry" className="h-24 mx-auto mb-6 object-contain" />
            <h1 className="font-serif text-2xl text-onyx-800 mb-3">Algo salió mal</h1>
            <p className="font-body text-sm text-onyx-500 mb-6">
              Por favor recarga la página. Si el problema continúa, intenta limpiar el caché del navegador.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-gold"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
