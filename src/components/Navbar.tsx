import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminTrigger: () => void;
}

export default function Navbar({ cartCount, onCartClick, onAdminTrigger }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    setAdminClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        onAdminTrigger();
        return 0;
      }
      return next;
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-cream-200' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex-shrink-0 focus:outline-none"
            aria-label="Lola's Jewelry"
          >
            <img
              src="/Lolas_Logo.png"
              alt="Lola's Jewelry"
              className="h-14 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {['coleccion', 'categorias', 'nosotros'].map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`font-body text-xs tracking-ultra uppercase transition-colors duration-200 ${
                  scrolled ? 'text-onyx-700 hover:text-gold-600' : 'text-onyx-800 hover:text-gold-600'
                }`}
              >
                {item === 'coleccion' ? 'Colección' : item === 'categorias' ? 'Categorías' : 'Nosotros'}
              </button>
            ))}
          </div>

          {/* Cart + Mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 transition-colors hover:text-gold-600"
              aria-label="Carrito"
            >
              <ShoppingBag size={22} className={scrolled ? 'text-onyx-700' : 'text-onyx-800'} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen
                ? <X size={22} className={scrolled ? 'text-onyx-700' : 'text-onyx-800'} />
                : <Menu size={22} className={scrolled ? 'text-onyx-700' : 'text-onyx-800'} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-cream-200 py-4">
          {['coleccion', 'categorias', 'nosotros'].map(item => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="block w-full text-left px-6 py-3 font-body text-xs tracking-ultra uppercase text-onyx-700 hover:bg-cream-100 hover:text-gold-600 transition-colors"
            >
              {item === 'coleccion' ? 'Colección' : item === 'categorias' ? 'Categorías' : 'Nosotros'}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
