import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Wallet, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-900">
              Juspay Platform
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
              <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
              {user?.name}
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition focus:outline-none">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
