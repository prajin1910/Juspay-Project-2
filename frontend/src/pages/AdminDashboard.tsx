import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, PlusCircle, Shield, Loader2, Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  upiId: string;
}

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);
    try {
      const res = await api.get(`/users/search?query=${query}`);
      setUsers(res.data);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount) return;
    setLoading(true);
    try {
      await api.post(`/admin/add-funds/${selectedUser.id}?amount=${amount}`);
      alert('Funds added successfully!');
      setSelectedUser(null);
      setAmount('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-indigo-500" />
          <h1 className="text-xl font-bold text-white">Admin Control Panel</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-white transition">
          <LogOut className="h-5 w-5 mr-2" /> Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-400" /> Target User Lookup
          </h2>
          <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
            <input type="text" className="flex-1 px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search by name, phone or UPI ID" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit" disabled={searching} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
              {searching ? <Loader2 className="animate-spin h-5 w-5" /> : 'Search'}
            </button>
          </form>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {users.map(u => (
              <div key={u.id} className={`p-4 rounded-xl border cursor-pointer transition ${selectedUser?.id === u.id ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`} onClick={() => setSelectedUser(u)}>
                <p className="font-semibold text-white">{u.name}</p>
                <div className="text-sm text-slate-400 flex flex-col mt-1">
                  <span>Email: {u.email}</span>
                  <span>UPI: {u.upiId}</span>
                  <span>Phone: {u.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedUser ? (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <PlusCircle className="h-5 w-5 mr-2 text-green-400" /> Credit User Wallet
              </h2>
              
              <div className="bg-slate-900 p-4 rounded-lg mb-6 border border-slate-700">
                <p className="text-sm text-slate-400">Selected User</p>
                <p className="text-lg font-bold text-white">{selectedUser.name}</p>
                <p className="text-sm text-slate-300">{selectedUser.upiId}</p>
              </div>

              <form onSubmit={handleAddFunds} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount to Add (₹)</label>
                  <input type="number" min="1" required className="w-full px-4 py-3 text-xl font-bold bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-70 font-medium text-lg">
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Deposit'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-10 border border-slate-700 border-dashed flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Shield className="h-16 w-16 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">Select a user to initiate administrative deposit</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
