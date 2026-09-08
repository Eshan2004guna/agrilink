import React from 'react';
import { Sprout } from 'lucide-react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullPage = false,
  message = 'Loading AgriLink content...',
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-700 animate-spin" />
        <Sprout className="w-5 h-5 text-emerald-700 absolute inset-0 m-auto animate-pulse" />
      </div>
      {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
        {content}
      </div>
    );
  }

  return content;
};
