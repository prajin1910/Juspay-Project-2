import { useState } from 'react';
import api from '../api/axios';
import { Search, Send, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  phone: string;
  upiId: string;
}

export default function SendMoney({ onTransactionSuccess }: { onTransactionSuccess: () => void }) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount) return;
    setLoading(true);
    try {
      await api.post('/transactions/send', {
        destinationUpiId: selectedUser.upiId,
        amount: parseFloat(amount)
      });
      alert('Money sent successfully!');
      setSelectedUser(null);
      setAmount('');
      setQuery('');
      setUsers([]);
      onTransactionSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send money. Check balance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Send Money</h3>
      
      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="Search by name, phone or UPI ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button type="submit" disabled={searching} className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center min-w-[100px]">
          {searching ? <Loader2 className="animate-spin h-5 w-5" /> : 'Search'}
        </button>
      </form>

      {users.length > 0 && !selectedUser && (
        <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 cursor-pointer transition-colors" onClick={() => setSelectedUser(u)}>
              <div>
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-sm text-gray-500">{u.upiId} • {u.phone}</p>
              </div>
              <button className="text-primary-600 font-semibold text-sm bg-primary-100 px-4 py-1.5 rounded-full hover:bg-primary-200 transition-colors">Select</button>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <form onSubmit={handleSend} className="space-y-5 bg-primary-50/50 p-6 rounded-xl border border-primary-100">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Sending to</p>
              <p className="font-bold text-gray-900 text-xl mt-1">{selectedUser.name}</p>
              <p className="text-sm text-gray-600">{selectedUser.upiId}</p>
            </div>
            <button type="button" onClick={() => setSelectedUser(null)} className="text-sm text-primary-600 font-medium hover:text-primary-800 underline transition-colors">Change</button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
            <input type="number" min="1" step="0.01" required className="w-full px-4 py-4 text-2xl font-bold text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          
          <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg text-white font-medium text-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all disabled:opacity-70 transform hover:-translate-y-0.5">
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <>Send ₹{amount || '0.00'} <Send className="ml-2 h-5 w-5" /></>}
          </button>
        </form>
      )}
    </div>
  );
}
