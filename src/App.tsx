import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Shop } from './components/Shop';
import { Cart } from './components/Cart';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { Management } from './components/Management';
import { OrderSuccess } from './components/OrderSuccess';
import { PurchaseHistory } from './components/PurchaseHistory';
import { ProductManagement } from './components/ProductManagement';
import { About } from './components/About';
import { useAuth } from './hooks/useAuth';

function Home() {
  const { user } = useAuth();

  return (
    <div className="relative">
      <Header />
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="خلفية القرطاسية"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          المخزن الذكي
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          اكتشف مجموعتنا المختارة من القرطاسية الفاخرة. من الدفاتر الأنيقة إلى أدوات الكتابة الدقيقة،
          اعثر على الأدوات المثالية للتعبير عن إبداعك.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            تسوق الآن
          </a>
          
          {!user && (
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              تسجيل الدخول
            </a>
          )}
        </div>

        {!user && (
          <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">مميزات العضوية</h2>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-indigo-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                تتبع طلباتك بسهولة
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-indigo-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                إشعارات فورية لحالة الطلب
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-indigo-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                سجل كامل للمشتريات السابقة
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <div>Not authorized</div>;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/about" element={<About />} />
            <Route 
              path="/management" 
              element={
                <PrivateRoute>
                  <Management />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/products" 
              element={
                <PrivateRoute>
                  <ProductManagement />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}