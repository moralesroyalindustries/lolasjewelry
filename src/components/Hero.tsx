import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToCollection = () => {
    document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1920&q=90"
          alt="Lola's Jewelry Collection"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx-900/60 via-onyx-900/30 to-onyx-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/Lolas_Logo.png"
            alt="Lola's Jewelry"
            className="h-36 md:h-48 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Tagline */}
        <div className="gold-divider w-24 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-6" />
        <p className="font-serif text-cream-200 text-xl md:text-2xl italic tracking-wide mb-2">
          Detalles que hablan de ti
        </p>
        <p className="font-body text-cream-300 text-xs md:text-sm tracking-ultra uppercase mb-8">
          Tienda Online &bull; San Lorenzo, Puerto Rico
        </p>
        <div className="gold-divider w-24 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-10" />

        {/* CTA */}
        <button
          onClick={scrollToCollection}
          className="btn-gold inline-block shadow-xl"
        >
          Ver Colección
        </button>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToCollection}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cream-300 animate-bounce hover:text-gold-400 transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
