'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [load, setLoad] = useState(false);

  const register = async () => {
    setLoad(true);
    setErr('');
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd }),
      });
      if (!r.ok) throw new Error('fail');
      alert('OK. Login now.');
    } catch (e) {
      setErr(String(e));
    }
    setLoad(false);
  };

  const login = async () => {
    setLoad(true);
    setErr('');
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd }),
      });
      if (!r.ok) throw new Error('fail');
      const d = await r.json();
      localStorage.setItem('token', d.access_token);
      window.location.href = '/dashboard';
    } catch (e) {
      setErr(String(e));
    }
    setLoad(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">SmartERP</h1>
        {err && <p className="text-red-600 mb-4">{err}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
        />
        <button
          onClick={register}
          disabled={load}
          className="w-full bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700"
        >
          Register
        </button>
        <button
          onClick={login}
          disabled={load}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
