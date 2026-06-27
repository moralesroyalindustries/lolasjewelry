import { useState } from 'react';
import { ShoppingBag, Plus, Minus, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const maxQty = Math.min(10, product.stock);
  const outOfStock = product.stock === 0;

  const decrement = () => setQuantity(q => Math.max(1, q - 1));
  const increment = () => setQuantity(q => Math.min(maxQty, q + 1));

  return (
    <div className="product-card group bg-white">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-cream-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-cream-200 animate-pulse" />
        )}
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-gold-500/90 text-white text-xs font-body tracking-wide uppercase px-2 py-0.5">
            {product.category}
          </span>
        </div>
        {/* Stock badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500/90 text-white text-xs font-body px-2 py-0.5">
              ¡Últimas {product.stock}!
            </span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-onyx-900/50 flex items-center justify-center">
            <span className="bg-white text-onyx-800 text-sm font-body tracking-wide uppercase px-4 py-2">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-serif text-base text-onyx-800 mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="font-body text-onyx-500 text-xs leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-serif text-2xl text-gold-600 font-semibold">
            ${(product.price * quantity).toFixed(2)}
          </span>
          <div className="text-right">
            <span className="font-body text-xs text-onyx-400 tracking-wide block">
              ${product.price.toFixed(2)} c/u
            </span>
            <span className={`font-body text-xs ${product.stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
              {outOfStock ? 'Agotado' : `${product.stock} disponibles`}
            </span>
          </div>
        </div>

        {!outOfStock && (
          <>
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-xs tracking-wide uppercase text-onyx-500">Cantidad</span>
              <div className="flex items-center border border-cream-300 bg-cream-50">
                <button
                  onClick={decrement}
                  className="w-8 h-8 flex items-center justify-center text-onyx-600 hover:bg-cream-200 transition-colors"
                  aria-label="Reducir cantidad"
                >
                  <Minus size={12} />
                </button>
                <span className="w-10 text-center font-body text-sm font-semibold text-onyx-800">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  className="w-8 h-8 flex items-center justify-center text-onyx-600 hover:bg-cream-200 transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Quick quantity buttons */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 5].filter(q => q <= maxQty).map(q => (
                <button
                  key={q}
                  onClick={() => setQuantity(q)}
                  className={`text-xs font-body px-2 py-1 border transition-all duration-150 ${
                    quantity === q
                      ? 'bg-gold-500 border-gold-500 text-white'
                      : 'border-cream-300 text-onyx-500 hover:border-gold-400 hover:text-gold-600'
                  }`}
                >
                  {q}+
                </button>
              ))}
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {outOfStock ? (
            <button disabled className="btn-gold w-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
              <AlertCircle size={14} />
              Agotado
            </button>
          ) : (
            <>
              <button
                onClick={() => onBuyNow(product, quantity)}
                className="btn-gold w-full text-center flex items-center justify-center gap-2"
              >
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                  alt="PayPal"
                  className="h-4 object-contain"
                />
                Pagar con PayPal
              </button>
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="btn-outline-gold w-full text-center flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                Agregar al Carrito
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
