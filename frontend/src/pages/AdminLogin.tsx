import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...user } = response.data;
      setAuth(token, user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl p-8 bg-slate-800 shadow-2xl border border-slate-700">
        <div className="flex justify-center mb-6">
          <ShieldCheck className="h-16 w-16 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-8">Admin Portal</h2>
        
        {error && <div className="mb-4 text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input type="email" required
                className="w-full pl-10 pr-3 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-700 text-white"
                placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input type="password" required
                className="w-full pl-10 pr-3 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-700 text-white"
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-70 font-medium text-lg">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Access System <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
