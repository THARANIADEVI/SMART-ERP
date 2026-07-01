'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../lib/api';

interface LedgerItem {
  id: number;
  name: string;
}

export default function Ledger() {
  const params = useParams();
  const type = params.type as string;
  const { token } = useAuth();
  const [items, setItems] = useState<LedgerItem[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      loadItems();
    }
  }, [token, type]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiCall<LedgerItem[]>(`/ledger/${type}`, { token });
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  const save = async () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const savedItem = await apiCall<LedgerItem>(editingId ? `/ledger/${type}/${editingId}` : `/ledger/${type}`, {
        method: editingId ? 'PUT' : 'POST',
        token,
        body: JSON.stringify({ name }),
      });
      setItems(editingId ? items.map(item => item.id === editingId ? savedItem : item) : [...items, savedItem]);
      resetForm();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      setLoading(true);
      await apiCall(`/ledger/${type}/${id}`, {
        method: 'DELETE',
        token,
      });
      setItems(items.filter(item => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">{type} Ledger</h1>
        <Link href="/dashboard" className="text-blue-600">← Back</Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Add {type}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`${type} name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="flex-1 p-2 border rounded disabled:opacity-50"
          />
          <button
            onClick={save}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
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
                  <th className="border p-3 text-left">ID</th>
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border p-3">{item.id}</td>
                    <td className="border p-3">{item.name}</td>
                    <td className="border p-3">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setName(item.name);
                        }}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
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
