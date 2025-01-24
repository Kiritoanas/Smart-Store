import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Book, PenTool, Palette } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 w-64 h-64 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-full bg-indigo-400 opacity-10 rounded-full"></div>
        </div>
        <div className="absolute right-0 bottom-0 w-96 h-96 transform translate-x-1/3 translate-y-1/3">
          <div className="w-full h-full bg-indigo-300 opacity-10 rounded-full"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Title */}
          <div className="text-center md:text-right mb-8 md:mb-0">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="relative w-16 h-16 mr-4">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full transform -rotate-12"></div>
                <Book className="h-8 w-8 text-white absolute left-2 top-2" />
                <PenTool className="h-8 w-8 text-white absolute right-2 top-2" />
                <Palette className="h-8 w-8 text-white absolute left-4 bottom-1" />
                <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-full transform rotate-12"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">المخزن الذكي</h1>
                <p className="text-indigo-200">أدوات مكتبية عالية الجودة</p>
              </div>
            </div>
            <p className="text-lg text-indigo-100 max-w-xl">
              نقدم لكم مجموعة متنوعة من الأدوات المكتبية والقرطاسية بأعلى معايير الجودة وأفضل الأسعار
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center group"
              >
                <span>تسجيل الدخول</span>
                <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/shop')}
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center group"
              >
                <span>تصفح المنتجات</span>
                <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <p className="text-indigo-200 text-sm">
              {user ? 'اكتشف مجموعتنا المتميزة' : 'انضم إلينا واستمتع بتجربة تسوق مميزة'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}