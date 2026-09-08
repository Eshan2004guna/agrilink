import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReturn = () => {
    if (user?.role === 'FARMER') navigate('/farmer/dashboard');
    else if (user?.role === 'ADMIN') navigate('/admin/dashboard');
    else if (user?.role === 'BUYER') navigate('/buyer/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-700 flex items-center justify-center font-black text-2xl shadow-inner">
        403
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">403 - Access Denied</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
        You do not have authorization to view this private role page. Please return to your authorized dashboard.
      </p>
      <Button
        variant="primary"
        onClick={handleReturn}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="bg-emerald-700 hover:bg-emerald-800"
      >
        Go to Your Dashboard
      </Button>
    </div>
  );
};
