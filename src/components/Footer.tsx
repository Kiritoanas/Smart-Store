import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, PenTool, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <div className="flex items-center">
              <PenTool className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold mr-2">المخزن الذكي</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              نقدم لكم أجود أنواع القرطاسية والأدوات المكتبية
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">روابط سريعة</h3>
            <div className="space-y-2 text-sm">
              <Link to="/shop" className="block text-gray-400 hover:text-white">المتجر</Link>
              <Link to="/cart" className="block text-gray-400 hover:text-white">سلة التسوق</Link>
              <Link to="/about" className="block text-gray-400 hover:text-white">من نحن</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3">تواصل معنا</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 ml-2" />
                <span>+974 55596343</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 ml-2" />
                <span>anasalya4@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold mb-3">تابعنا على</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} المخزن الذكي. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}