'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Ledger() {
  const params = useParams();
  const type = params.type as string;
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  const add = () => {
    if (!name.trim()) return;
    setItems([...items, { id: Date.now(), name }]);
    setName('');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">{type} Ledger</h1>
        <Link href="/dashboard" className="text-blue-600">← Back</Link>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Add {type}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`${type} name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={add}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
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
                  <button className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="p-6 text-center text-gray-600">Empty</p>}
      </div>
    </div>
  );
}
