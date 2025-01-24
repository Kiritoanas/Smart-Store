import { supabase } from '../lib/supabase';
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  is_deleted: boolean;
}

const categories = [
  'الأقلام',
  'الدفاتر',
  'الملفات',
  'الأوراق',
  'الألوان',
  'الحقائب المدرسية',
  'المساطر والأدوات الهندسية',
  'اللواصق والشرائط',
];

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_deleted', false);

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const [field, order] = sortBy.split('-');
      query = query.order(field, { ascending: order === 'asc' });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError('حدث خطأ في تحميل المنتجات');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', text: 'نفذ من المخزون', icon: AlertTriangle };
    if (stock < 5) return { color: 'text-orange-500', text: 'كمية محدودة', icon: AlertTriangle };
    return { color: 'text-green-600', text: 'متوفر', icon: Package };
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-48 border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-48 border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="name-asc">الاسم: أ-ي</option>
                <option value="name-desc">الاسم: ي-أ</option>
                <option value="price-asc">السعر: الأقل أولاً</option>
                <option value="price-desc">السعر: الأعلى أولاً</option>
                <option value="stock-asc">المخزون: الأقل أولاً</option>
                <option value="stock-desc">المخزون: الأكثر أولاً</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const StatusIcon = stockStatus.icon;
              const cartQuantity = getCartQuantity(product.id);
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-w-3 aspect-h-2">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1000&q=80'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-indigo-600">{product.price.toFixed(2)} ر.ق</span>
                      <div className={`flex items-center ${stockStatus.color}`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{stockStatus.text}</span>
                      </div>
                    </div>
                    {product.stock > 0 && (
                      <button
                        onClick={() => addToCart(product)}
                        disabled={cartQuantity >= product.stock}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {cartQuantity > 0 ? `في السلة (${cartQuantity})` : 'أضف إلى السلة'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}