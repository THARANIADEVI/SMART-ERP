'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../lib/api';

interface ReportSummary {
  title: string;
  total: number;
  count: number;
  generated_at: string;
}

const reports = [
  { title: 'Balance Sheet', desc: 'Financial position', endpoint: '/reports/balance-sheet' },
  { title: 'Profit & Loss', desc: 'Sales minus purchases', endpoint: '/reports/profit-loss' },
  { title: 'Stock Summary', desc: 'Inventory value', endpoint: '/reports/stock-summary' },
  { title: 'Sales Summary', desc: 'Sales voucher total', endpoint: '/reports/sales-summary' },
];

export default function Reports() {
  const { token } = useAuth();
  const [selected, setSelected] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const viewReport = async (endpoint: string) => {
    try {
      setLoading(endpoint);
      setError('');
      setSelected(await apiCall<ReportSummary>(endpoint, { token }));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Link href="/dashboard" className="text-blue-600">← Back</Link>
      </div>

      {error && <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {selected && (
        <div className="mb-6 rounded bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-bold">{selected.title}</h2>
          <p className="text-3xl font-black text-blue-600">Rs. {selected.total.toFixed(2)}</p>
          <p className="mt-2 text-sm text-gray-600">Entries: {selected.count}</p>
          <p className="text-sm text-gray-600">Generated: {new Date(selected.generated_at).toLocaleString()}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(report => (
          <div key={report.endpoint} className="bg-white p-6 rounded shadow hover:shadow-lg">
            <h2 className="font-bold text-lg mb-2">{report.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{report.desc}</p>
            <button
              onClick={() => viewReport(report.endpoint)}
              disabled={loading === report.endpoint}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading === report.endpoint ? 'Loading...' : 'View'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
