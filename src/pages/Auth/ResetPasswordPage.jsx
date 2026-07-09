import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, KeyRound, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../services/auth';

export default function ResetPasswordPage() {
  const { theme } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Live password strength calculation
  const getPasswordStrength = (val) => {
    if (!val) return { label: 'Empty', score: 0, color: 'bg-gray-700/20' };
    let score = 0;
    if (val.length >= 8) score += 1;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score += 1;
    if (/\d/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    switch (score) {
      case 1:
        return { label: 'Weak', score: 25, color: 'bg-rose-500' };
      case 2:
        return { label: 'Medium', score: 50, color: 'bg-yellow-500' };
      case 3:
        return { label: 'Strong', score: 75, color: 'bg-blue-500' };
      case 4:
        return { label: 'Excellent', score: 100, color: 'bg-emerald-500' };
      default:
        return { label: 'Too Short', score: 10, color: 'bg-rose-600' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setErrorMsg('Invalid OTP. Code must be exactly 6 digits.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      await auth.resetPassword({
        email,
        otp,
        new_password: password,
        password_confirm: confirmPassword
      });
      setIsSuccess(true);
    } catch (error) {
      setErrorMsg(error?.message || 'Unable to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success countdown redirect timer
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate('/login');
    }
  }, [isSuccess, countdown, navigate]);

  const wrapperStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-2xl' 
    : 'bg-white border-light-border text-gray-800 shadow-xl';

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-8 rounded-2xl border transition-all ${wrapperStyle}`}>
        
        {isSuccess ? (
          // Success State Redirect Screen
          <div className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">Password Reset Successful!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Your new security password is now active in our systems.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/20 dark:bg-dark-hover/10 text-xs text-gray-500 font-semibold">
              Redirecting you to Login page in <span className="font-mono text-indigo-500 font-bold">{countdown}s</span>...
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          // Form Screen
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-display font-extrabold tracking-tight">Reset Password</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Provide the 6-digit confirmation code and write your new password credentials.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 flex items-center gap-2.5 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* OTP Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">6-Digit OTP Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center tracking-widest text-sm font-mono font-bold"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">New Password</label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex justify-between text-[10px] font-semibold text-gray-500">
                    <span>Password Strength: <span className="font-bold">{strength.label}</span></span>
                    <span>{strength.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden border border-light-border dark:border-dark-border">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`} 
                      style={{ width: `${strength.score}%` }} 
                    />
                  </div>
                </div>
              )}

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Confirm Password</label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !otp || !password || !confirmPassword}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Submit New Password</span>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
