'use client';

import Link from 'next/link';

export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">SmartERP</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/ledger/customer" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="font-bold text-lg">Customer Ledger</h2>
          <p className="text-gray-600 text-sm">Manage customers</p>
        </Link>

        <Link href="/ledger/supplier" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="font-bold text-lg">Supplier Ledger</h2>
          <p className="text-gray-600 text-sm">Manage suppliers</p>
        </Link>

        <Link href="/stock" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="font-bold text-lg">Stock Items</h2>
          <p className="text-gray-600 text-sm">Manage inventory</p>
        </Link>

        <Link href="/voucher/sales" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="font-bold text-lg">Sales Voucher</h2>
          <p className="text-gray-600 text-sm">Create sales bills</p>
        </Link>

        <Link href="/voucher/purchase" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="font-bold text-lg">Purchase Voucher</h2>
          <p className="text-gray-600 text-sm">Create purchase orders</p>
        </Link>

        <Link href="/reports" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="font-bold text-lg">Reports</h2>
          <p className="text-gray-600 text-sm">View reports</p>
        </Link>
      </div>
    </div>
  );
}
