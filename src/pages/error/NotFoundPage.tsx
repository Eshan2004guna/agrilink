import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Sprout, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl shadow-inner">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">Harvest Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
        The page or farm listing you are looking for does not exist or has been moved to another location.
      </p>
      <Button
        variant="primary"
        onClick={() => navigate('/')}
        leftIcon={<Home className="w-4 h-4" />}
        className="bg-emerald-700 hover:bg-emerald-800"
      >
        Return to Homepage
      </Button>
    </div>
  );
};
