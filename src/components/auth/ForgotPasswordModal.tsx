import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User } from '../../types';
import { Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onSuccessLogin: (user: User) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  onSuccessLogin,
}) => {
  const { showToast } = useNotifications();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail || 'farmer@agrilink.lk');
      setStep(1);
      setOtp(['', '', '', '', '', '']);
      setGeneratedOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
    }
  }, [isOpen, defaultEmail]);

  useEffect(() => {
    let timer: any;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const generateAndSendOtp = async (targetEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate checking email existence
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setResendTimer(30);
      setStep(2);
      showToast(`Verification code sent to ${targetEmail}! OTP Code: ${code}`, 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    generateAndSendOtp(email);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setError(`Invalid verification code. Use demo code: ${generatedOtp}`);
      return;
    }

    setError(null);
    setStep(3);
    showToast('OTP verified successfully! Please enter your new password.', 'success');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.resetPassword(email, newPassword);
      await login(email, newPassword);
      showToast('Password reset successfully! Welcome back.', 'success');
      onClose();
      onSuccessLogin(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-red-500' };
    if (pass.length < 10) return { label: 'Medium', width: '66%', color: 'bg-amber-500' };
    return { label: 'Strong', width: '100%', color: 'bg-emerald-600' };
  };

  const strength = calculatePasswordStrength(newPassword);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Account Password" maxWidth="md">
      <div className="space-y-6 py-2">
        {/* Step Progress Pills */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-700 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200'}`}>1</span>
            <span>Enter Email</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-700 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200'}`}>2</span>
            <span>Verify OTP</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-700 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-700 text-white' : 'bg-slate-200'}`}>3</span>
            <span>New Password</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <Mail className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Forgot Your Password?</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Enter your registered email address below and we'll send a 6-digit OTP code to verify your account.
              </p>
            </div>

            <Input
              label="Registered Email Address"
              type="email"
              placeholder="farmer@agrilink.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Send OTP Code
            </Button>
          </form>
        )}

        {/* STEP 2: Enter & Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Enter Verification Code</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We sent a 6-digit OTP code to <strong className="text-slate-800">{email}</strong>
              </p>
            </div>

            {/* Simulated OTP Code Alert for testing */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 block">
                Verification Code Sent
              </span>
              <div className="text-lg font-black tracking-widest text-emerald-900 font-mono">
                {generatedOtp}
              </div>
              <p className="text-[11px] text-emerald-700">Enter this 6-digit code below to proceed.</p>
            </div>

            {/* 6 Digit OTP Inputs */}
            <div className="flex justify-center items-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-bold border-2 border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Didn't receive code?</span>
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => generateAndSendOtp(email)}
                className="text-emerald-700 font-bold hover:underline disabled:text-slate-400 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP Code'}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800"
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Verify OTP Code
            </Button>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Set New Password</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create a strong password for your AgriLink account.
              </p>
            </div>

            <div className="space-y-1">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Password Strength Indicator */}
              {newPassword && (
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
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-md"
              isLoading={isLoading}
            >
              Reset Password & Sign In
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
