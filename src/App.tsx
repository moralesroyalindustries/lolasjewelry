import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Features from './components/Features';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './lib/supabase';
import { Product, CartItem } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashOpen, setAdminDashOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });
    setProducts(data || []);
    setLoadingProducts(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(10, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartOpen(true);
  };

  const buyNow = (product: Product, quantity: number) => {
    setCart([{ product, quantity }]);
    setCheckoutOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const handleCartCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCheckoutOpen(false);
    setCart([]);
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 6000);
  };

  const handleAdminLogin = () => {
    setAdminLoginOpen(false);
    setAdminDashOpen(true);
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen">
      {/* Success Banner */}
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
          <div className="bg-white border border-green-200 shadow-xl px-6 py-4 flex items-center gap-3 max-w-sm">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="font-serif text-sm text-onyx-800">¡Pedido Registrado!</p>
              <p className="font-body text-xs text-onyx-500 mt-0.5">
                Completa tu pago en PayPal para finalizar.
              </p>
            </div>
            <button onClick={() => setSuccessBanner(false)} className="ml-auto text-onyx-400 hover:text-onyx-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onAdminTrigger={() => setAdminLoginOpen(true)}
      />

      <Hero />
      <Features />
      <ProductGrid
        products={products}
        loading={loadingProducts}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />

      {/* Banner section */}
      <section className="py-16 bg-onyx-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="jewelry background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="font-body text-xs tracking-ultra uppercase text-gold-400 mb-4">Especial</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            Todos los productos
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-4" />
          <p className="font-serif text-5xl md:text-6xl text-gold-400 font-bold mb-2">$12.00</p>
          <p className="font-body text-xs tracking-ultra uppercase text-cream-400">Cada pieza</p>
          <div className="mt-8">
            <button
              onClick={() => document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold shadow-xl"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </section>

      <Footer onAdminTrigger={() => setAdminLoginOpen(true)} />

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        onCheckout={handleCartCheckout}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        onSuccess={handleOrderSuccess}
      />

      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />

      <AdminDashboard
        isOpen={adminDashOpen}
        onClose={() => setAdminDashOpen(false)}
      />
    </div>
  );
}
