'use client';

import Link from 'next/link';

export default function Reports() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Link href="/dashboard" className="text-blue-600">← Back</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Balance Sheet</h2>
          <p className="text-gray-600 text-sm mb-4">Financial position</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Profit & Loss</h2>
          <p className="text-gray-600 text-sm mb-4">P&L summary</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Stock Summary</h2>
          <p className="text-gray-600 text-sm mb-4">Inventory status</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Sales Summary</h2>
          <p className="text-gray-600 text-sm mb-4">Sales data</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View</button>
        </div>
      </div>
    </div>
  );
}
