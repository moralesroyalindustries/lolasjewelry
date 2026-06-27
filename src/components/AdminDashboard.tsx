import { useState, useEffect } from 'react';
import {
  X, Package, ShoppingBag, BarChart2, Users, Upload,
  Edit2, Save, Loader2, TrendingUp, DollarSign, LogOut,
  Plus, Trash2, Eye, EyeOff
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

interface ProductForm {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  active: boolean;
}

const BLANK_FORM: ProductForm = {
  name: '',
  description: '',
  price: 12.00,
  image_url: '',
  category: 'cadenas',
  stock: 10,
  active: true,
};

const CATEGORIES = ['cadenas', 'pulseras', 'collares', 'aretes', 'anillos', 'sets'];

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductForm>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

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
        stock: editingProduct.stock,
        active: editingProduct.active,
      })
      .eq('id', editingProduct.id);
    await loadProducts();
    setEditingProduct(null);
    setSaving(false);
  };

  const addProduct = async () => {
    if (!newProduct.name.trim()) return;
    setSaving(true);
    await supabase.from('products').insert([{
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      image_url: newProduct.image_url || '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg',
      category: newProduct.category,
      stock: newProduct.stock,
      active: newProduct.active,
    }]);
    await loadProducts();
    setNewProduct(BLANK_FORM);
    setShowAddForm(false);
    setSaving(false);
  };

  const toggleActive = async (product: Product) => {
    await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id);
    await loadProducts();
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'edit' | 'new'
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const productId = target === 'edit' ? editingProduct?.id : 'new-' + Date.now();
    setUploading(target);

    const ext = file.name.split('.').pop();
    const fileName = `products/${productId}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { upsert: true });

    if (!upErr) {
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      if (target === 'edit') {
        setEditingProduct(prev => prev ? { ...prev, image_url: urlData.publicUrl } : prev);
      } else {
        setNewProduct(prev => ({ ...prev, image_url: urlData.publicUrl }));
      }
    }
    setUploading(null);
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
              <div>
                {/* Add Product Button */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-lg text-onyx-800">{products.length} productos</span>
                  <button
                    onClick={() => { setShowAddForm(true); setEditingProduct(null); }}
                    className="btn-gold flex items-center gap-2 text-xs py-2 px-4"
                  >
                    <Plus size={14} />
                    Agregar Producto
                  </button>
                </div>

                {/* Add New Product Form */}
                {showAddForm && (
                  <div className="border-2 border-gold-300 bg-gold-50 p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-base text-onyx-800">Nuevo Producto</h3>
                      <button onClick={() => setShowAddForm(false)} className="text-onyx-400 hover:text-onyx-600">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image upload for new product */}
                      <div className="relative aspect-square bg-cream-100 overflow-hidden md:row-span-2">
                        {newProduct.image_url ? (
                          <img src={newProduct.image_url} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-onyx-300">
                            <div className="text-center">
                              <Upload size={32} className="mx-auto mb-2" />
                              <p className="text-xs font-body">Sin imagen</p>
                            </div>
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-onyx-900/40 cursor-pointer hover:bg-onyx-900/55 transition-colors">
                          {uploading === 'new' ? (
                            <Loader2 size={24} className="text-white animate-spin" />
                          ) : (
                            <div className="text-white text-center">
                              <Upload size={20} className="mx-auto mb-1" />
                              <span className="text-xs">Subir imagen</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'new')} className="hidden" />
                        </label>
                      </div>
                      <div className="space-y-3">
                        <input
                          value={newProduct.name}
                          onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                          placeholder="Nombre del producto *"
                        />
                        <textarea
                          value={newProduct.description}
                          onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-cream-300 text-xs font-body focus:outline-none focus:border-gold-500 resize-none"
                          placeholder="Descripción"
                        />
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="font-body text-xs text-onyx-500 uppercase tracking-wide block mb-1">Precio ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={newProduct.price}
                              onChange={e => setNewProduct(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="font-body text-xs text-onyx-500 uppercase tracking-wide block mb-1">Unidades</label>
                            <input
                              type="number"
                              min="0"
                              value={newProduct.stock}
                              onChange={e => setNewProduct(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                              className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                            />
                          </div>
                        </div>
                        <select
                          value={newProduct.category}
                          onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500 bg-white"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={addProduct}
                        disabled={saving || !newProduct.name.trim()}
                        className="btn-gold flex items-center justify-center gap-2 text-xs py-2 px-6 disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        Guardar Producto
                      </button>
                      <button onClick={() => setShowAddForm(false)} className="btn-outline-gold text-xs py-2 px-4">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product.id} className={`border overflow-hidden ${product.active ? 'border-cream-200' : 'border-cream-200 opacity-60'}`}>
                      {editingProduct?.id === product.id ? (
                        <div className="p-4 space-y-3">
                          {/* Image Upload */}
                          <div className="relative aspect-square bg-cream-100 overflow-hidden">
                            <img
                              src={editingProduct.image_url || '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg'}
                              alt={editingProduct.name}
                              className="w-full h-full object-cover"
                              onError={e => (e.currentTarget.src = '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg')}
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-onyx-900/50 cursor-pointer hover:bg-onyx-900/60 transition-colors">
                              {uploading === 'edit' ? (
                                <Loader2 size={24} className="text-white animate-spin" />
                              ) : (
                                <div className="text-white text-center">
                                  <Upload size={24} className="mx-auto mb-1" />
                                  <span className="text-xs">Subir imagen</span>
                                </div>
                              )}
                              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'edit')} className="hidden" />
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
                            <div className="flex-1">
                              <label className="font-body text-xs text-onyx-500 uppercase tracking-wide block mb-1">Precio ($)</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editingProduct.price}
                                onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="font-body text-xs text-onyx-500 uppercase tracking-wide block mb-1">Unidades</label>
                              <input
                                type="number"
                                min="0"
                                value={editingProduct.stock}
                                onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500"
                              />
                            </div>
                          </div>
                          <select
                            value={editingProduct.category}
                            onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full px-3 py-2 border border-cream-300 text-sm font-body focus:outline-none focus:border-gold-500 bg-white"
                          >
                            {CATEGORIES.map(c => (
                              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                          </select>
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
                          <div className="aspect-square overflow-hidden relative">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={e => (e.currentTarget.src = '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg')}
                            />
                            {!product.active && (
                              <div className="absolute inset-0 bg-onyx-900/40 flex items-center justify-center">
                                <span className="bg-white text-onyx-700 text-xs font-body px-2 py-1">Oculto</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="font-serif text-sm text-onyx-800 mb-1 leading-snug">{product.name}</p>
                            <p className="font-body text-xs text-onyx-500 mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-serif text-gold-600">${Number(product.price).toFixed(2)}</span>
                              <span className={`font-body text-xs ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-green-600'}`}>
                                {product.stock} uds.
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => { setEditingProduct({ ...product }); setShowAddForm(false); }}
                                className="flex-1 flex items-center justify-center gap-1 text-xs font-body text-onyx-500 hover:text-gold-600 transition-colors px-2 py-1.5 border border-cream-200 hover:border-gold-300"
                              >
                                <Edit2 size={11} />
                                Editar
                              </button>
                              <button
                                onClick={() => toggleActive(product)}
                                title={product.active ? 'Ocultar producto' : 'Mostrar producto'}
                                className="flex items-center justify-center gap-1 text-xs font-body text-onyx-500 hover:text-gold-600 transition-colors px-2 py-1.5 border border-cream-200 hover:border-gold-300"
                              >
                                {product.active ? <EyeOff size={11} /> : <Eye size={11} />}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
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
