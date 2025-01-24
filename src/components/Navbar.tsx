import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Home, Store, User, Bell, Settings, ClipboardList, Book, PenTool, Palette } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { signOut } from '../lib/auth/services/authService';
import { useNotifications } from '../hooks/useNotifications';

export function Navbar() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { notifications, unreadCount } = useNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-indigo-100 rounded-full transform -rotate-12"></div>
                <Book className="h-6 w-6 text-indigo-600 absolute left-1 top-1.5" />
                <PenTool className="h-6 w-6 text-indigo-500 absolute right-1 top-1.5" />
                <Palette className="h-6 w-6 text-indigo-400 absolute left-3 bottom-1" />
                <div className="absolute inset-0 border-2 border-indigo-200 rounded-full transform rotate-12"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 mr-8 pr-2">المخزن الذكي</span>
            </Link>
            
            <div className="hidden md:flex items-center mr-8 space-x-6">
              <Link 
                to="/" 
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <Home className="h-5 w-5 ml-1" />
                <span>الرئيسية</span>
              </Link>
              <Link 
                to="/shop" 
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <Store className="h-5 w-5 ml-1" />
                <span>المتجر</span>
              </Link>
              {isAdmin ? (
                <div className="flex items-center space-x-6">
                  <Link 
                    to="/management" 
                    className="flex items-center text-gray-700 hover:text-indigo-600"
                  >
                    <ClipboardList className="h-5 w-5 ml-1" />
                    <span>الطلبات</span>
                  </Link>
                  <Link 
                    to="/products" 
                    className="flex items-center text-gray-700 hover:text-indigo-600"
                  >
                    <Settings className="h-5 w-5 ml-1" />
                    <span>المنتجات</span>
                  </Link>
                </div>
              ) : user && (
                <Link 
                  to="/purchase-history" 
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <ClipboardList className="h-5 w-5 ml-1" />
                  <span>طلباتي</span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative">
                <Link to="/notifications" className="text-gray-700 hover:text-indigo-600">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
            <Link 
              to="/cart" 
              className="flex items-center text-gray-700 hover:text-indigo-600 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="mr-1 hidden sm:inline">السلة</span>
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <span className="mr-2">تسجيل الخروج</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <User className="h-5 w-5 ml-1" />
                <span>تسجيل الدخول</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}