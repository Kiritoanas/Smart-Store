import React from 'react';
import { PenTool, Target, Users, Shield, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <PenTool className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نحن متجر متخصص في توفير أجود أنواع القرطاسية والأدوات المكتبية بأسعار منافسة
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">رؤيتنا</h3>
            <p className="text-gray-600">
              أن نكون الوجهة الأولى للقرطاسية والأدوات المكتبية في قطر
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">مهمتنا</h3>
            <p className="text-gray-600">
              توفير منتجات عالية الجودة تلبي احتياجات عملائنا بأسعار منافسة
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">قيمنا</h3>
            <p className="text-gray-600">
              الجودة، الأمانة، خدمة العملاء المتميزة، والالتزام بالمواعيد
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">قصتنا</h2>
          <p className="text-gray-600 mb-4">
            بدأنا رحلتنا في عام 2024 بهدف توفير أفضل المنتجات المكتبية للطلاب والمهنيين. 
            نحن نؤمن بأن الأدوات الجيدة تساعد في تحقيق النجاح.
          </p>
          <p className="text-gray-600">
            نعمل باستمرار على توسيع مجموعة منتجاتنا وتحسين خدماتنا لنلبي احتياجات عملائنا
            المتنامية ونساهم في نجاحهم.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تواصل معنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                نحن هنا للإجابة على استفساراتكم وتلبية احتياجاتكم.
              </p>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 ml-2 text-indigo-600" />
                  +974 55596343
                </p>
                <p className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 ml-2 text-indigo-600" />
                  anasalya4@gmail.com
                </p>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-gray-600 mb-4">تابعونا على وسائل التواصل الاجتماعي</p>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}