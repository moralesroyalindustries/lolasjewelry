import { useState, useEffect } from 'react';
import {
  X, Package, ShoppingBag, BarChart2, Users, Upload,
  Edit2, Save, Loader2, TrendingUp, DollarSign, LogOut
} from 'lucide-react';
import { Product, Order } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'products' | 'orders' | 'sales';

interface MonthlySale {
  month: string;
  revenue: number;
  orders: number;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadProducts();
    loadOrders();
  }, [isOpen]);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    setProducts(data || []);
    setLoading(false);
  };

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);
    await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        image_url: editingProduct.image_url,
        category: editingProduct.category,
      })
      .eq('id', editingProduct.id);
    await loadProducts();
    setEditingProduct(null);
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);

    const ext = file.name.split('.').pop();
    const fileName = `products/${editingProduct.id}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { upsert: true });

    if (!upErr) {
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      setEditingProduct(prev => prev ? { ...prev, image_url: urlData.publicUrl } : prev);
    }
    setUploading(false);
  };

  const monthlySales = computeMonthlySales(orders);
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 modal-overlay bg-onyx-900/60">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-onyx-900 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/Lolas_Logo.png" alt="Admin" className="h-8 w-auto object-contain" />
            <span className="font-serif text-lg">Panel de Administración</span>
          </div>
          <button onClick={onClose} className="p-2 hover:text-gold-400 transition-colors flex items-center gap-1 text-sm">
            <LogOut size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cream-200 bg-cream-50 flex-shrink-0">
          {([
            ['products', 'Productos', Package],
            ['orders', 'Pedidos', ShoppingBag],
            ['sales', 'Ventas', BarChart2],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-6 py-4 font-body text-xs tracking-wide uppercase transition-all border-b-2 ${
                tab === id
                  ? 'border-gold-500 text-gold-700 bg-white'
                  : 'border-transparent text-onyx-500 hover:text-gold-600 hover:bg-cream-100'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            loading ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-gold-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <div key={product.id} className="border border-cream-200 bg-white overflow-hidden">
                    {editingProduct?.id === product.id ? (
                      <div className="p-4 space-y-3">
                        {/* Image Upload */}
                        <div className="relative aspect-square bg-cream-100 overflow-hidden">
                          <img
                            src={editingProduct.image_url}
                            alt={editingProduct.name}
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-onyx-900/50 cursor-pointer hover:bg-onyx-900/60 transition-colors">
                            {uploading ? (
                              <Loader2 size={24} className="text-white animate-spin" />
                            ) : (
                              <div className="text-white text-center">
                                <Upload size={24} className="mx-auto mb-1" />
                                <span className="text-xs">Subir imagen</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <input
                          value={editingProduct.name}
                          onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                          placeholder="Nombre del producto"
                        />
                        <textarea
                          value={editingProduct.description}
                          onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-cream-300 text-xs font-body focus:outline-none focus:border-gold-500 resize-none"
                          placeholder="Descripción"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                            className="w-24 px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                            placeholder="Precio"
                          />
                          <input
                            value={editingProduct.category}
                            onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="flex-1 px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                            placeholder="Categoría"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveProduct}
                            disabled={saving}
                            className="btn-gold flex-1 flex items-center justify-center gap-1 text-xs py-2"
                          >
                            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="btn-outline-gold flex-1 text-xs py-2"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-serif text-sm text-onyx-800 mb-1 leading-snug">{product.name}</p>
                          <p className="font-body text-xs text-onyx-500 mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-gold-600">${product.price.toFixed(2)}</span>
                            <button
                              onClick={() => setEditingProduct({ ...product })}
                              className="flex items-center gap-1 text-xs font-body text-onyx-500 hover:text-gold-600 transition-colors px-2 py-1 border border-cream-200 hover:border-gold-300"
                            >
                              <Edit2 size={11} />
                              Editar
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-gold-600" />
                <span className="font-serif text-lg text-onyx-800">Clientes &amp; Pedidos</span>
                <span className="bg-gold-100 text-gold-700 text-xs px-2 py-0.5 font-body">{orders.length} pedidos</span>
              </div>
              {orders.length === 0 ? (
                <p className="text-center text-onyx-400 font-body text-sm py-12">No hay pedidos aún.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="bg-cream-100 border-b border-cream-200">
                        {['Fecha', 'Cliente', 'Email', 'Teléfono', 'Dirección', 'Total', 'Estado'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs tracking-wide uppercase text-onyx-500 font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                          <td className="px-4 py-3 text-xs text-onyx-500">
                            {new Date(order.created_at).toLocaleDateString('es-PR')}
                          </td>
                          <td className="px-4 py-3 text-onyx-800 font-medium">{order.customer_name}</td>
                          <td className="px-4 py-3 text-onyx-600">{order.customer_email}</td>
                          <td className="px-4 py-3 text-onyx-600">{order.customer_phone}</td>
                          <td className="px-4 py-3 text-onyx-500 text-xs max-w-[150px] truncate">{order.customer_address}</td>
                          <td className="px-4 py-3 text-gold-600 font-serif">${Number(order.total_amount).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gold-100 text-gold-700'
                            }`}>
                              {order.status === 'pending' ? 'Pendiente' : order.status === 'completed' ? 'Completado' : order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SALES TAB */}
          {tab === 'sales' && (
            <div>
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="border border-cream-200 p-5 bg-cream-50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-gold-500" />
                    <span className="font-body text-xs tracking-wide uppercase text-onyx-500">Ingresos Totales</span>
                  </div>
                  <p className="font-serif text-3xl text-gold-600">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="border border-cream-200 p-5 bg-cream-50">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag size={18} className="text-gold-500" />
                    <span className="font-body text-xs tracking-wide uppercase text-onyx-500">Pedidos Totales</span>
                  </div>
                  <p className="font-serif text-3xl text-onyx-800">{orders.length}</p>
                </div>
                <div className="border border-cream-200 p-5 bg-cream-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className="text-gold-500" />
                    <span className="font-body text-xs tracking-wide uppercase text-onyx-500">Promedio por Pedido</span>
                  </div>
                  <p className="font-serif text-3xl text-onyx-800">
                    ${orders.length ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Monthly table */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={16} className="text-gold-600" />
                  <span className="font-serif text-lg text-onyx-800">Ventas Mensuales</span>
                </div>
                {monthlySales.length === 0 ? (
                  <p className="text-center text-onyx-400 font-body text-sm py-8">No hay datos de ventas aún.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body">
                      <thead>
                        <tr className="bg-cream-100 border-b border-cream-200">
                          {['Mes', 'Pedidos', 'Ingresos', 'Barra'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs tracking-wide uppercase text-onyx-500 font-normal">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {monthlySales.map(ms => (
                          <tr key={ms.month} className="border-b border-cream-100 hover:bg-cream-50">
                            <td className="px-4 py-3 text-onyx-700 font-medium">{ms.month}</td>
                            <td className="px-4 py-3 text-onyx-600">{ms.orders}</td>
                            <td className="px-4 py-3 text-gold-600 font-serif">${ms.revenue.toFixed(2)}</td>
                            <td className="px-4 py-3 w-40">
                              <div className="bg-cream-200 h-3 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                                  style={{ width: `${Math.min(100, (ms.revenue / Math.max(...monthlySales.map(m => m.revenue))) * 100)}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function computeMonthlySales(orders: Order[]): MonthlySale[] {
  const map = new Map<string, MonthlySale>();
  orders.forEach(o => {
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-PR', { year: 'numeric', month: 'long' });
    if (!map.has(key)) map.set(key, { month: label, revenue: 0, orders: 0 });
    const entry = map.get(key)!;
    entry.revenue += Number(o.total_amount);
    entry.orders += 1;
  });
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, v]) => v);
}
