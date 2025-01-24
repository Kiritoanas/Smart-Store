import React from 'react';
import { Package } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-indigo-600" />
            <div className="mr-4">
              <h2 className="text-lg font-medium text-gray-900">إدارة المنتجات</h2>
              <p className="text-sm text-gray-500">إضافة وتعديل وحذف المنتجات</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}