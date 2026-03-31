import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { User, Lock, Mail, Phone, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/verify-otp', {
        email: formData.email,
        otp,
        registerDetails: formData
      });
      const { token, ...user } = response.data;
      setAuth(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="glass w-full max-w-md rounded-2xl p-8 relative overflow-hidden transition-all duration-500 shadow-xl border border-white/40">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          {step === 1 ? 'Create Account' : 'Verify Email'}
        </h2>
        
        {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" required className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white/70 backdrop-blur-sm" placeholder="John Doe" value={formData.name} onChange={handleChange} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" required className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white/70 backdrop-blur-sm" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="phone" required className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white/70 backdrop-blur-sm" placeholder="+1234567890" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" name="password" required minLength={6} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white/70 backdrop-blur-sm" placeholder="••••••••" value={formData.password} onChange={handleChange} />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 mt-6 rounded-lg shadow-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition disabled:opacity-70 transform hover:-translate-y-0.5">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-center text-gray-600 text-sm mb-4">We've sent a 6-digit code to <br/><span className="font-semibold text-gray-900">{formData.email}</span></p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Enter OTP</label>
              <div className="relative max-w-xs mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white/70 text-center text-2xl tracking-widest font-bold" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4 text-center">
              Back to registration
            </button>
          </form>
        )}
        
        {step === 1 && (
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
