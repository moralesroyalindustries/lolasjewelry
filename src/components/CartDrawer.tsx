import { useState } from 'react';
import { X, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-onyx-900/50 modal-overlay"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-2xl transform transition-transform duration-400 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-cream-50">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-gold-600" />
              <span className="font-serif text-lg text-onyx-800">Tu Carrito</span>
              {items.length > 0 && (
                <span className="bg-gold-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:text-gold-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-onyx-400">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="font-body text-sm tracking-wide">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-4 py-4 border-b border-cream-100">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-onyx-800 leading-snug mb-1">{item.product.name}</p>
                      <p className="font-body text-xs text-gold-600 font-semibold mb-2">
                        ${item.product.price.toFixed(2)} c/u
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 border border-cream-300 flex items-center justify-center text-xs hover:bg-cream-100"
                        >-</button>
                        <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, Math.min(10, item.quantity + 1))}
                          className="w-6 h-6 border border-cream-300 flex items-center justify-center text-xs hover:bg-cream-100"
                        >+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="text-onyx-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="font-serif text-sm font-semibold text-onyx-800">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-cream-200 bg-cream-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-body text-sm tracking-wide uppercase text-onyx-600">Total</span>
                <span className="font-serif text-2xl text-gold-600">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                Proceder al Pago
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
