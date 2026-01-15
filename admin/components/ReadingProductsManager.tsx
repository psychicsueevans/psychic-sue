'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface ReadingProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  delivery_time: string;
  is_live_reading: boolean;
  calendly_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ReadingProductsManager = () => {
  const [products, setProducts] = useState<ReadingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ReadingProduct | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: 'standard',
    delivery_time: '24-48 hours',
    is_live_reading: false,
    calendly_link: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      image_url: '',
      category: 'standard',
      delivery_time: '24-48 hours',
      is_live_reading: false,
      calendly_link: '',
      sort_order: products.length + 1,
      is_active: true
    });
    setShowModal(true);
  };

  const openEditModal = (product: ReadingProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category || 'standard',
      delivery_time: product.delivery_time || '24-48 hours',
      is_live_reading: product.is_live_reading || false,
      calendly_link: product.calendly_link || '',
      sort_order: product.sort_order || 0,
      is_active: product.is_active !== false
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price) {
      alert('Please fill in title and price');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        category: formData.category,
        delivery_time: formData.delivery_time,
        is_live_reading: formData.is_live_reading,
        calendly_link: formData.calendly_link || null,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      if (editingProduct) {
        // Update existing
        const { error } = await supabase
          .from('reading_products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('reading_products')
          .insert([productData]);

        if (error) throw error;
      }

      await fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reading product?')) return;

    try {
      const { error } = await supabase
        .from('reading_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const toggleActive = async (product: ReadingProduct) => {
    try {
      const { error } = await supabase
        .from('reading_products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error toggling product:', error);
    }
  };

  const categoryColors: Record<string, string> = {
    standard: 'bg-purple-100 text-purple-800',
    express: 'bg-orange-100 text-orange-800',
    premium: 'bg-blue-100 text-blue-800',
    live: 'bg-green-100 text-green-800'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-950">Reading Products</h2>
          <p className="text-purple-600">Manage your reading services and prices</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Reading
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
              product.is_active ? 'border-purple-200' : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Image */}
            <div className="h-40 bg-purple-100 relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PhotoIcon className="w-12 h-12 text-purple-300" />
                </div>
              )}
              {/* Category Badge */}
              <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[product.category] || categoryColors.standard}`}>
                {product.category}
              </span>
              {/* Active/Inactive Badge */}
              {!product.is_active && (
                <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Inactive
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-purple-950 mb-1">{product.title}</h3>
              <p className="text-sm text-purple-600 line-clamp-2 mb-3">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-green-600 font-bold">
                  <CurrencyDollarIcon className="w-5 h-5" />
                  ${product.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 text-purple-600 text-sm">
                  {product.is_live_reading ? (
                    <>
                      <PhoneIcon className="w-4 h-4" />
                      Live
                    </>
                  ) : (
                    <>
                      <ClockIcon className="w-4 h-4" />
                      {product.delivery_time}
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(product)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.is_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {product.is_active ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4" />
                      Inactive
                    </>
                  )}
                </button>
                <button
                  onClick={() => openEditModal(product)}
                  className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-12 bg-purple-50 rounded-xl">
            <PhotoIcon className="w-12 h-12 text-purple-300 mx-auto mb-3" />
            <p className="text-purple-600">No reading products yet.</p>
            <button
              onClick={openAddModal}
              className="mt-3 text-purple-700 font-medium hover:text-purple-800"
            >
              Add your first reading →
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-purple-100">
              <h2 className="text-xl font-bold text-purple-950">
                {editingProduct ? 'Edit Reading Product' : 'Add New Reading Product'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Love & Relationships"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe what's included in this reading..."
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="35.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="premium">Premium</option>
                    <option value="live">Live</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="/assets/images/your-image.png"
                />
                <p className="text-xs text-purple-500 mt-1">
                  Available images: love_relationships_tarot_reading.png, general_tarot_reading_spread.png, money_career_tarot_reading.png, express_tarot_reading.png, full_in_depth_tarot_reading.png, live_phone_tarot_reading.png
                </p>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.delivery_time}
                  onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 24-48 hours"
                />
              </div>

              {/* Live Reading Toggle */}
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <input
                  type="checkbox"
                  id="is_live_reading"
                  checked={formData.is_live_reading}
                  onChange={(e) => setFormData({ ...formData, is_live_reading: e.target.checked })}
                  className="w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="is_live_reading" className="text-purple-800">
                  This is a <strong>live reading</strong> (phone/video call via Calendly)
                </label>
              </div>

              {/* Calendly Link - Only show if live reading */}
              {formData.is_live_reading && (
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Calendly Link
                  </label>
                  <input
                    type="text"
                    value={formData.calendly_link}
                    onChange={(e) => setFormData({ ...formData, calendly_link: e.target.value })}
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://calendly.com/psychicsueevans/30min"
                  />
                </div>
              )}

              {/* Sort Order and Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-3 pt-7">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="text-purple-800">
                    Active (visible on website)
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white p-6 border-t border-purple-100 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingProductsManager;
