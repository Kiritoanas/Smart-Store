import React, { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-QA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Auto mark as read when viewing notifications
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      setTimeout(() => {
        unreadNotifications.forEach(notification => {
          markAsRead(notification.id);
        });
      }, 3000); // Mark as read after 3 seconds of viewing
    }
  }, [notifications, markAsRead]);

  if (notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Bell className="h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">لا توجد إشعارات</h2>
        <p className="mt-2 text-gray-600">ستظهر هنا الإشعارات المتعلقة بطلباتك</p>
      </div>
    );
  }

  const getStatusIcon = (message: string) => {
    if (message.includes('جاري تجهيز')) return <Clock className="h-5 w-5 text-blue-500" />;
    if (message.includes('تم اكتمال')) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (message.includes('تم إلغاء')) return <XCircle className="h-5 w-5 text-red-500" />;
    return <Bell className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
          <button
            onClick={markAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>تحديد الكل كمقروء</span>
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-300 transform hover:scale-[1.01] ${
                !notification.read ? 'border-r-4 border-indigo-500 bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(notification.message)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{notification.message}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                  >
                    تحديد كمقروء
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}