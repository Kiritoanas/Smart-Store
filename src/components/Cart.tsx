import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, addToCart, decreaseQuantity, clearCart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { returnTo: '/cart' } });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          buyer_name: formData.buyerName,
          buyer_phone: formData.buyerPhone,
          buyer_address: formData.buyerAddress,
          total_amount: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Success! Clear cart and redirect to success page
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderId: order.id,
          totalAmount: total,
          ...formData
        }
      });
    } catch (err) {
      console.error('Error creating order:', err);
      setError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <ShoppingBag className="h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">السلة فارغة</h2>
        <p className="mt-2 text-gray-600">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          تصفح المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">سلة التسوق</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <div className="flex-1 mr-4">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-indigo-600 font-medium">{item.price.toFixed(2)} ر.ق</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="text-gray-600 mx-2">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-400 hover:text-red-500 mr-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>المجموع</span>
                <span className="text-indigo-600">{total.toFixed(2)} ر.ق</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">معلومات التوصيل</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="buyerName"
                  required
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="buyerPhone" className="block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="buyerPhone"
                  required
                  value={formData.buyerPhone}
                  onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="buyerAddress" className="block text-sm font-medium text-gray-700">
                  عنوان التوصيل
                </label>
                <textarea
                  id="buyerAddress"
                  required
                  value={formData.buyerAddress}
                  onChange={(e) => setFormData({ ...formData, buyerAddress: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}