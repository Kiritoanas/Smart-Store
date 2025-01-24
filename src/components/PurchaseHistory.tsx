import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Clock, Truck, CheckCircle, XCircle, RefreshCw, Printer } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface OrderItem {
  id: string;
  product: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_address: string;
  items: OrderItem[];
}

export function PurchaseHistory() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth state to be determined
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { returnTo: '/purchase-history' } });
      return;
    }

    fetchOrders();
  }, [user, isLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            quantity,
            price,
            product:products(name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('حدث خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'processing':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
    }
  };

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-QA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Show loading state while checking authentication
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-600">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Package className="h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">لا توجد طلبات</h2>
        <p className="mt-2 text-gray-600">لم تقم بإجراء أي طلبات بعد</p>
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
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900">سجل مشترياتي</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Printer className="h-5 w-5" />
              طباعة السجل
            </button>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <RefreshCw className="h-5 w-5" />
              تحديث
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden print:shadow-none print:border print:border-gray-200 print:mb-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        طلب #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">تفاصيل الطلب</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-gray-900">{item.price.toFixed(2)} ر.ق</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span>المجموع</span>
                        <span className="text-indigo-600">{order.total_amount.toFixed(2)} ر.ق</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">معلومات التوصيل</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">الاسم:</span>
                      <p className="font-medium text-gray-900">{order.buyer_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">رقم الهاتف:</span>
                      <p className="font-medium text-gray-900">{order.buyer_phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">العنوان:</span>
                      <p className="font-medium text-gray-900">{order.buyer_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}