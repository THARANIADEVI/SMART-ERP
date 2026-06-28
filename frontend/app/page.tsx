'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Login() {
  const router = useRouter();
  const { token, setToken, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [load, setLoad] = useState(false);

  // Redirect if already logged in
  if (!isLoading && token) {
    router.push('/dashboard');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const register = async () => {
    setLoad(true);
    setErr('');
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd }),
      });
      if (!r.ok) throw new Error('Register failed');
      alert('Registered! Now login.');
      setEmail('');
      setPwd('');
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
      if (!r.ok) throw new Error('Login failed');
      const d = await r.json();
      setToken(d.access_token);
      router.push('/dashboard');
    } catch (e) {
      setErr(String(e));
    }
    setLoad(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-black">SmartERP</h1>
        {err && <p className="text-red-600 mb-4 text-sm">{err}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={load}
          style={{ 
            backgroundColor: '#ffffff', 
            color: '#000000', 
            borderColor: '#999999',
            borderWidth: '2px'
          }}
          className="w-full p-3 mb-4 rounded disabled:opacity-50"
        />
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          disabled={load}
          style={{ 
            backgroundColor: '#ffffff', 
            color: '#000000', 
            borderColor: '#999999',
            borderWidth: '2px'
          }}
          className="w-full p-3 mb-4 rounded disabled:opacity-50"
        />
        <button
          onClick={register}
          disabled={load}
          className="w-full bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {load ? 'Loading...' : 'Register'}
        </button>
        <button
          onClick={login}
          disabled={load}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {load ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
