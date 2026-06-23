import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { CartItem, CustomerForm } from '../types';
import { supabase } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, items, onSuccess }: CheckoutModalProps) {
  const [form, setForm] = useState<CustomerForm>({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Por favor ingresa tu nombre.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Por favor ingresa un correo válido.';
    if (!form.phone.trim()) return 'Por favor ingresa tu teléfono.';
    if (!form.address.trim()) return 'Por favor ingresa tu dirección.';
    return '';
  };

  const handlePay = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      // Create order in DB
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name.trim(),
          customer_email: form.email.trim(),
          customer_phone: form.phone.trim(),
          customer_address: form.address.trim(),
          total_amount: total,
          status: 'pending',
        })
        .select()
        .single();

      if (orderErr || !order) throw new Error(orderErr?.message || 'Error al crear la orden');

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw new Error(itemsErr.message);

      // Build PayPal payment URL
      const itemNames = items.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
      const paypalUrl = buildPaypalUrl({
        amount: total,
        itemName: `Lola's Jewelry - ${itemNames}`.slice(0, 127),
        invoiceId: order.id,
      });

      onSuccess();
      window.open(paypalUrl, '_blank', 'noopener,noreferrer');

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 modal-overlay bg-onyx-900/60">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-cream-50 sticky top-0">
          <h2 className="font-serif text-xl text-onyx-800">Datos de Envío</h2>
          <button onClick={onClose} className="p-2 hover:text-gold-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Order Summary */}
          <div className="bg-cream-50 border border-cream-200 p-4 mb-6">
            <p className="font-body text-xs tracking-ultra uppercase text-onyx-500 mb-3">Resumen del Pedido</p>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="font-body text-onyx-700">
                    {item.product.name} <span className="text-gold-600">×{item.quantity}</span>
                  </span>
                  <span className="font-serif text-onyx-800">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-200 mt-3 pt-3 flex justify-between">
              <span className="font-body text-xs tracking-wide uppercase text-onyx-600">Total</span>
              <span className="font-serif text-lg text-gold-600 font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx-400" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre completo *"
                className="w-full pl-10 pr-4 py-3 border border-cream-300 bg-cream-50 font-body text-sm text-onyx-800 placeholder-onyx-400 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo electrónico *"
                className="w-full pl-10 pr-4 py-3 border border-cream-300 bg-cream-50 font-body text-sm text-onyx-800 placeholder-onyx-400 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx-400" />
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Número de teléfono *"
                className="w-full pl-10 pr-4 py-3 border border-cream-300 bg-cream-50 font-body text-sm text-onyx-800 placeholder-onyx-400 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-4 text-onyx-400" />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Dirección completa (calle, ciudad, estado, código postal) *"
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-cream-300 bg-cream-50 font-body text-sm text-onyx-800 placeholder-onyx-400 focus:outline-none focus:border-gold-500 transition-colors resize-none"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-red-500 text-xs font-body">{error}</p>
          )}

          {/* PayPal button */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="mt-6 w-full bg-[#0070BA] hover:bg-[#005ea6] disabled:opacity-60 text-white font-body text-sm tracking-wide py-4 flex items-center justify-center gap-3 transition-all duration-200 shadow-md"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                  alt="PayPal"
                  className="h-5 object-contain"
                />
                <span>Pagar ${total.toFixed(2)} con PayPal</span>
              </>
            )}
          </button>

          <p className="mt-3 text-center font-body text-xs text-onyx-400">
            Serás redirigido a PayPal para completar tu pago de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}

function buildPaypalUrl({ amount, itemName, invoiceId }: { amount: number; itemName: string; invoiceId: string }) {
  const params = new URLSearchParams({
    cmd: '_xclick',
    business: 'lolasjewelry@gmail.com',
    item_name: itemName,
    amount: amount.toFixed(2),
    currency_code: 'USD',
    invoice: invoiceId,
    return: window.location.href,
    cancel_return: window.location.href,
    no_shipping: '1',
  });
  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}
