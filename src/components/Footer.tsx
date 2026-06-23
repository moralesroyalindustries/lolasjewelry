import { MapPin } from 'lucide-react';

export default function Footer({ onAdminTrigger }: { onAdminTrigger: () => void }) {
  return (
    <footer className="bg-onyx-900 text-cream-300">
      {/* Top decorative band */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <img src="/Lolas_Logo.png" alt="Lola's Jewelry" className="h-20 w-auto object-contain" />
            <p className="font-body text-xs tracking-wide text-cream-400">
              Minimalista, elegante y hecho para durar.
            </p>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-cream-400">
            <MapPin size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm text-cream-200">Tienda Online</p>
              <p className="font-body text-xs">San Lorenzo, Puerto Rico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-onyx-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="font-body text-xs text-onyx-400">
            &copy;{' '}
            <button
              onClick={onAdminTrigger}
              className="hover:text-gold-600 transition-colors focus:outline-none"
              aria-label="."
            >
              2025
            </button>
            {' '}Lola's Jewelry. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-onyx-500">San Lorenzo, PR</p>
        </div>
      </div>
    </footer>
  );
}
