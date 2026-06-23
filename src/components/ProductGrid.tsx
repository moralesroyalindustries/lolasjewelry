import { Product } from '../types';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

const CATEGORIES = ['todos', 'cadenas', 'pulseras', 'collares', 'aretes', 'anillos', 'sets'];

export default function ProductGrid({ products, loading, onAddToCart, onBuyNow }: ProductGridProps) {
  return (
    <section id="coleccion" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-ultra uppercase text-gold-600 mb-3">Nueva Temporada</p>
          <h2 className="section-title mb-4">Colección Completa</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4" />
          <p className="font-body text-sm text-onyx-500 max-w-md mx-auto leading-relaxed">
            Cada pieza diseñada con amor, elaborada para durar. Acero inoxidable de alta calidad, impermeable e hipoalergénico.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={36} className="animate-spin text-gold-500" />
              <p className="font-body text-xs tracking-wide uppercase text-onyx-400">Cargando colección...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
