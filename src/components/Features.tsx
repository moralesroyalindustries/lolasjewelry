import { Shield, Droplets, Leaf, Gift, Clock, Heart } from 'lucide-react';

const features = [
  { icon: Droplets, title: 'Impermeable', desc: 'Resistente al agua y al sudor' },
  { icon: Leaf, title: 'Hipoalergénico', desc: 'Seguro para pieles sensibles' },
  { icon: Shield, title: 'Acero Inoxidable', desc: 'Duradero, no se oxida' },
  { icon: Gift, title: 'Regalo Perfecto', desc: 'Ideal para cualquier ocasión' },
  { icon: Clock, title: 'Estilo Atemporal', desc: 'Combina con todo, siempre' },
  { icon: Heart, title: 'Diseño Minimalista', desc: 'Pequeños detalles, gran significado' },
];

export default function Features() {
  return (
    <section id="nosotros" className="py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-body text-xs tracking-ultra uppercase text-gold-600 mb-3">Nuestra Promesa</p>
          <h2 className="section-title mb-4">Calidad que se Siente</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-4 bg-white border border-cream-200 hover:border-gold-300 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center mb-3 group-hover:bg-gold-100 transition-colors">
                <Icon size={20} className="text-gold-600" />
              </div>
              <p className="font-serif text-sm text-onyx-800 mb-1">{title}</p>
              <p className="font-body text-xs text-onyx-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
