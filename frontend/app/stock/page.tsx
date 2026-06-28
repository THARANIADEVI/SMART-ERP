'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../lib/api';

interface StockItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

export default function Stock() {
  const { token } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      loadItems();
    }
  }, [token]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiCall<StockItem[]>('/stock', { token });
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const add = async () => {
    if (!name.trim() || !qty.trim() || !price.trim()) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const newItem = await apiCall<StockItem>('/stock', {
        method: 'POST',
        token,
        body: JSON.stringify({ name, qty: parseFloat(qty), price: parseFloat(price) }),
      });
      setItems([...items, newItem]);
      setName('');
      setQty('');
      setPrice('');
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      setLoading(true);
      await apiCall(`/stock/${id}`, {
        method: 'DELETE',
        token,
      });
      setItems(items.filter(item => item.id !== id));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slideInDown">
          <div>
            <h1 className="text-4xl font-black text-gray-800">📦 Stock Items</h1>
            <p className="text-gray-600 mt-2">Manage your inventory efficiently</p>
          </div>
          <Link href="/dashboard" className="text-blue-600 font-semibold hover:text-blue-800 transition-smooth flex items-center gap-2">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 mb-6 rounded-r animate-slideInLeft">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Add Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 animate-fadeInUp card-hover">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            ➕ Add New Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
              <input 
                type="text" 
                placeholder="Enter item name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-smooth group-focus-within:shadow-lg disabled:opacity-50" 
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input 
                type="number" 
                placeholder="Qty" 
                value={qty} 
                onChange={(e) => setQty(e.target.value)} 
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-smooth group-focus-within:shadow-lg disabled:opacity-50" 
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
              <input 
                type="number" 
                placeholder="Price" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-smooth group-focus-within:shadow-lg disabled:opacity-50" 
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={add} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-smooth hover:shadow-lg hover:shadow-green-400/50 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Adding...
                  </>
                ) : (
                  '✨ Add'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {loading && items.length === 0 ? (
            <p className="p-8 text-center text-gray-600 font-semibold">Loading items...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Item Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr 
                        key={item.id} 
                        className="border-b hover:bg-green-50 transition-colors animate-fadeInUp"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.qty} units
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">₹{item.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 font-semibold mr-4 transition-smooth hover:scale-110">✏️ Edit</button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600 hover:text-red-800 font-semibold transition-smooth hover:scale-110"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {items.length === 0 && (
                <p className="p-8 text-center text-gray-600 font-semibold">📭 No items yet. Add one to get started!</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
