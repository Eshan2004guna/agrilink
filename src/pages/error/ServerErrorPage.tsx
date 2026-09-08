import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ServerCrash, RefreshCw } from 'lucide-react';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl shadow-inner">
        500
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">500 - Internal Server Error</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
        Our servers encountered an unexpected issue while processing your agricultural request. Please try again.
      </p>
      <Button
        variant="primary"
        onClick={() => window.location.reload()}
        leftIcon={<RefreshCw className="w-4 h-4" />}
        className="bg-emerald-700 hover:bg-emerald-800"
      >
        Reload Page
      </Button>
    </div>
  );
};
