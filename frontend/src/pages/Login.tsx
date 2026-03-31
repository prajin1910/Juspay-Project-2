import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
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
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="glass w-full max-w-md rounded-2xl p-8 relative overflow-hidden shadow-xl border border-white/40">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Welcome Back</h2>
        
        {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input type="email" required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white/70 backdrop-blur-sm"
                placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input type="password" required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white/70 backdrop-blur-sm"
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
