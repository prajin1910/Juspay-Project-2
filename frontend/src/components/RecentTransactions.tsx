import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  sourceWalletId: string;
  destinationWalletId: string;
  amount: number;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export default function RecentTransactions({ refreshTrigger }: { refreshTrigger: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletId, setWalletId] = useState('');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/transactions/wallet');
        setWalletId(res.data.id);
      } catch (err) {}
    };
    fetchWallet();
  }, []);

  useEffect(() => {
    if (!walletId) return;
    const fetchTx = async () => {
      try {
        const res = await api.get('/transactions/history');
        setTransactions(res.data);
      } catch (err) {}
    };
    fetchTx();
  }, [walletId, refreshTrigger]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>No transactions yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {transactions.map(tx => {
            const isSent = tx.sourceWalletId === walletId;
            return (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full flex-shrink-0 ${isSent ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {isSent ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{isSent ? 'Sent to' : 'Received from'}</p>
                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 mt-1">
                      <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(tx.status)}
                        <span className="capitalize">{tx.status.toLowerCase()}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`font-extrabold text-lg tracking-tight ${isSent ? 'text-gray-900' : 'text-green-600'}`}>
                  {isSent ? '-' : '+'}₹{tx.amount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
