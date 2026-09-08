import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Sprout, Lock, Mail, Eye, EyeOff, Tractor, UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('farmer@agrilink.lk');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.firstName}!`, 'success');

      if (user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'BUYER') navigate('/buyer/dashboard');
      else navigate(from);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(demoEmail, 'password123');
      showToast(`Logged in as ${user.role}: ${user.firstName}`, 'success');

      if (user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'BUYER') navigate('/buyer/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20">
            <Sprout className="w-7 h-7 text-emerald-200" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to AgriLink</h2>
          <p className="text-xs text-slate-500">Access your farm, marketplace, or orders workspace</p>
        </div>

        {/* Quick Demo Credentials Switcher */}
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-2 text-xs">
          <span className="font-bold text-emerald-900 uppercase tracking-wider block text-[10px]">
            Instant Demo Account Sign-In
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('farmer@agrilink.lk')}
              className="px-2 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1 shadow-2xs"
            >
              <Tractor className="w-3.5 h-3.5" />
              Farmer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('buyer@agrilink.lk')}
              className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@agrilink.lk')}
              className="px-2 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1 shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="farmer@agrilink.lk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-md text-emerald-700 focus:ring-emerald-600 accent-emerald-700"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Demo password reset link simulated.', 'info'); }} className="text-emerald-700 hover:underline font-semibold">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-950/20"
            isLoading={isLoading}
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Don't have an AgriLink account?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            Register as Farmer or Buyer
          </Link>
        </div>
      </div>
    </div>
  );
};
