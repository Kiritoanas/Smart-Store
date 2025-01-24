import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Printer } from 'lucide-react';

interface OrderSuccessState {
  orderId: string;
  totalAmount: number;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
}

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state as OrderSuccessState;

  if (!orderDetails) {
    navigate('/shop');
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 print:hidden" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">تم استلام طلبك بنجاح!</h1>
            <p className="mt-2 text-lg text-gray-600 print:mb-8">
              شكراً لك على طلبك. سنقوم بمعالجته في أقرب وقت ممكن.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">تفاصيل الطلب</h2>
            <div className="mt-4 bg-gray-50 rounded-lg p-6 print:bg-white print:p-0 print:border print:border-gray-300">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">رقم الطلب</dt>
                  <dd className="mt-1 text-sm text-gray-900">{orderDetails.orderId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">المبلغ الإجمالي</dt>
                  <dd className="mt-1 text-sm text-gray-900">{orderDetails.totalAmount.toFixed(2)} ر.ق</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">الاسم</dt>
                  <dd className="mt-1 text-sm text-gray-900">{orderDetails.buyerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">رقم الهاتف</dt>
                  <dd className="mt-1 text-sm text-gray-900">{orderDetails.buyerPhone}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">عنوان التوصيل</dt>
                  <dd className="mt-1 text-sm text-gray-900">{orderDetails.buyerAddress}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 space-y-4 print:hidden">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-blue-800">ماذا يحدث الآن؟</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc space-y-1 mr-4">
                      <li>سيتم مراجعة طلبك وتأكيده</li>
                      <li>ستتلقى رسالة نصية عند بدء تجهيز الطلب</li>
                      <li>سيتم التواصل معك لتحديد موعد التوصيل المناسب</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Printer className="ml-2 h-5 w-5" />
              طباعة الطلب
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowRight className="ml-2 h-5 w-5" />
              العودة للتسوق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}