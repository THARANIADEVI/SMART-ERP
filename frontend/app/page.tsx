'use client';

import { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (!isLoading && token) {
      router.push('/dashboard');
    }
  }, [isLoading, token, router]);

  if (isLoading || token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center animate-scaleIn">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading...</p>
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
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 bg-white p-10 rounded-2xl shadow-2xl w-96 animate-slideInUp hover-glow">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-fadeInDown">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
            SmartERP
          </h1>
          <p className="text-gray-500 text-sm mt-2">Enterprise Resource Management</p>
        </div>

        {/* Error Message */}
        {err && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 mb-4 rounded-r animate-slideInLeft">
            <p className="font-semibold text-sm">{err}</p>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-smooth group-focus-within:text-blue-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={load}
              style={{ 
                backgroundColor: '#ffffff', 
                color: '#000000', 
                borderColor: '#999999',
                borderWidth: '2px'
              }}
              className="w-full p-3 mb-4 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 hover:border-blue-400"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-smooth group-focus-within:text-blue-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              disabled={load}
              style={{ 
                backgroundColor: '#ffffff', 
                color: '#000000', 
                borderColor: '#999999',
                borderWidth: '2px'
              }}
              className="w-full p-3 mb-6 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 hover:border-purple-400"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={register}
            disabled={load}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold transition-smooth hover:shadow-lg hover:shadow-blue-400/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {load ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registering...
              </>
            ) : (
              '📝 Register'
            )}
          </button>

          <button
            onClick={login}
            disabled={load}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold transition-smooth hover:shadow-lg hover:shadow-purple-400/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {load ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              '🔐 Login'
            )}
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          Secure enterprise management system
        </p>
      </div>
    </div>
  );
}
