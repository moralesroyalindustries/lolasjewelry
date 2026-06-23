import { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const ADMIN_PASSWORD = '2020';

export default function AdminLogin({ isOpen, onClose, onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay bg-onyx-900/70">
      <div className="bg-white w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-cream-50">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-gold-600" />
            <span className="font-serif text-base text-onyx-700">Acceso Privado</span>
          </div>
          <button onClick={onClose} className="p-1 hover:text-gold-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Contraseña"
            autoFocus
            className="w-full px-4 py-3 border border-cream-300 bg-cream-50 font-body text-sm text-onyx-800 placeholder-onyx-400 focus:outline-none focus:border-gold-500 transition-colors mb-3"
          />
          {error && <p className="text-red-500 text-xs font-body mb-3">{error}</p>}
          <button type="submit" className="btn-gold w-full">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
