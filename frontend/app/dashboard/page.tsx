'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { title: 'Customer Ledger', desc: 'Manage customers', href: '/ledger/customer', emoji: '👥', color: 'from-blue-500 to-blue-600' },
  { title: 'Supplier Ledger', desc: 'Manage suppliers', href: '/ledger/supplier', emoji: '🏭', color: 'from-purple-500 to-purple-600' },
  { title: 'Stock Items', desc: 'Manage inventory', href: '/stock', emoji: '📦', color: 'from-green-500 to-green-600' },
  { title: 'Sales Voucher', desc: 'Create sales bills', href: '/voucher/sales', emoji: '🛍️', color: 'from-orange-500 to-orange-600' },
  { title: 'Purchase Voucher', desc: 'Create purchase orders', href: '/voucher/purchase', emoji: '📋', color: 'from-pink-500 to-pink-600' },
  { title: 'Reports', desc: 'View reports', href: '/reports', emoji: '📊', color: 'from-indigo-500 to-indigo-600' },
];

export default function Dashboard() {
  const router = useRouter();
  const { clearToken } = useAuth();

  const logout = () => {
    clearToken();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute -top-40 right-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 animate-slideInDown">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
              SmartERP
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Enterprise Management Dashboard</p>
          </div>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition-smooth hover:shadow-lg hover:shadow-red-400/50 active:scale-95 flex items-center gap-2"
          >
            🚪 Logout
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className="group"
            >
              <div
                className={`bg-gradient-to-br ${item.color} p-6 rounded-2xl shadow-lg transition-smooth hover:shadow-2xl hover:-translate-y-3 cursor-pointer relative overflow-hidden h-32 flex flex-col justify-between animate-fadeInUp`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <h2 className="font-bold text-lg text-white group-hover:translate-x-1 transition-transform duration-300">
                    {item.title}
                  </h2>
                </div>

                <p className="text-white text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {item.desc}
                </p>

                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 text-white text-xl opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold">Total Items</p>
                <p className="text-3xl font-black text-blue-600 mt-2">0</p>
              </div>
              <div className="text-4xl opacity-50">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold">Total Customers</p>
                <p className="text-3xl font-black text-purple-600 mt-2">0</p>
              </div>
              <div className="text-4xl opacity-50">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold">Total Vouchers</p>
                <p className="text-3xl font-black text-pink-600 mt-2">0</p>
              </div>
              <div className="text-4xl opacity-50">📋</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
