import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { UserRole } from '../../types';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Sprout, Tractor, ShoppingCart, User, Mail, Phone, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-red-500' };
    if (pass.length < 10) return { label: 'Medium', width: '66%', color: 'bg-amber-500' };
    return { label: 'Strong', width: '100%', color: 'bg-emerald-600' };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: selectedRole,
        password: formData.password,
      });

      const targetPath = location.state?.from?.pathname || location.state?.from;
      showToast(`Account created successfully as ${selectedRole}!`, 'success');
      
      if (targetPath && targetPath !== '/register' && targetPath !== '/login') {
        navigate(targetPath);
      } else if (selectedRole === 'FARMER') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20">
            <Sprout className="w-7 h-7 text-emerald-200" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Join AgriLink Sri Lanka</h2>
          <p className="text-xs text-slate-500">
            {step === 1 ? 'Step 1 of 2: Select your platform role' : 'Step 2 of 2: Enter your account details'}
          </p>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
          <div className={`h-full bg-emerald-700 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        {errors.form && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {errors.form}
          </div>
        )}

        {/* STEP 1: Select Role */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Farmer Option */}
              <div
                onClick={() => setSelectedRole('FARMER')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                  selectedRole === 'FARMER'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Tractor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">FARMER</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    I own or manage farms, cultivate crops, and want to sell fresh produce directly.
                  </p>
                </div>
              </div>

              {/* Buyer Option */}
              <div
                onClick={() => setSelectedRole('BUYER')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                  selectedRole === 'BUYER'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">BUYER</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    I represent a supermarket, restaurant, household, or wholesaler seeking direct farm produce.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800"
              onClick={handleNextStep}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue as {selectedRole}
            </Button>
          </div>
        )}

        {/* STEP 2: Registration Form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs mb-2">
              <span className="text-slate-600">
                Selected Role: <strong className="text-slate-900 font-bold">{selectedRole}</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-emerald-700 font-bold hover:underline"
              >
                Change Role
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Kamal"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Last Name"
                placeholder="Perera"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="kamal@agrilink.lk"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+94 77 123 4567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <span>Password Strength:</span>
                    <span>{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-950/20"
              isLoading={isLoading}
            >
              Complete Registration
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
