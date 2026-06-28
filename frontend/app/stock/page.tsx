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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock Items</h1>
        <Link href="/dashboard" className="text-blue-600">← Back</Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Add Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={loading}
            className="p-2 border rounded disabled:opacity-50" 
          />
          <input 
            type="number" 
            placeholder="Qty" 
            value={qty} 
            onChange={(e) => setQty(e.target.value)} 
            disabled={loading}
            className="p-2 border rounded disabled:opacity-50" 
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            disabled={loading}
            className="p-2 border rounded disabled:opacity-50" 
          />
          <button 
            onClick={add} 
            disabled={loading}
            className="bg-green-600 text-white px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        {loading ? (
          <p className="p-6 text-center text-gray-600">Loading...</p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-3 text-left">Item</th>
                  <th className="border p-3 text-left">Qty</th>
                  <th className="border p-3 text-left">Price</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border p-3">{item.name}</td>
                    <td className="border p-3">{item.qty}</td>
                    <td className="border p-3">₹{item.price}</td>
                    <td className="border p-3">
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <p className="p-6 text-center text-gray-600">Empty</p>}
          </>
        )}
      </div>
    </div>
  );
}
