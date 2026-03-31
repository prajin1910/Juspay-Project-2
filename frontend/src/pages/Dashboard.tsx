import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SendMoney from '../components/SendMoney';
import RecentTransactions from '../components/RecentTransactions';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Wallet, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/transactions/wallet');
      setBalance(res.data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [refreshTrigger]);

  const handleTransactionSuccess = () => {
    // Adding minor delay to allow Kafka processing before fetching balance
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden transform hover:-translate-y-1 transition duration-300">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h2 className="font-semibold tracking-wide uppercase text-sm">Available Balance</h2>
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="text-5xl font-extrabold mb-4 tracking-tighter">₹{balance.toFixed(2)}</div>
                <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 text-sm font-medium shadow-sm">
                  UPI ID: {user?.upiId}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary-500" /> Account Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500 text-sm font-medium">Name</span>
                  <span className="font-bold text-gray-900">{user?.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500 text-sm font-medium">Email</span>
                  <span className="font-bold text-gray-900 truncate max-w-[150px]">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 text-sm font-medium">Phone</span>
                  <span className="font-bold text-gray-900">{user?.upiId?.split('@')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <SendMoney onTransactionSuccess={handleTransactionSuccess} />
            <RecentTransactions refreshTrigger={refreshTrigger} />
          </div>

        </div>
      </main>
    </div>
  );
}
