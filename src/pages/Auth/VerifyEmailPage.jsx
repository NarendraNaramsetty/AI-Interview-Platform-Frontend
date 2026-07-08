import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function VerifyEmailPage() {
  const { theme } = useAuthStore();
  const navigate = useNavigate();
  
  // Developer state simulator
  const [verifyState, setVerifyState] = useState('pending'); // successful, pending, invalid
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // in seconds
  const [resendSuccess, setResendSuccess] = useState(false);

  // Timer countdown logic for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendEmail = () => {
    setIsLoading(true);
    setResendSuccess(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setResendSuccess(true);
      setResendTimer(60); // 60 seconds countdown
      setTimeout(() => setResendSuccess(false), 4000);
    }, 1200);
  };

  const handleRequestNewLink = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setVerifyState('pending');
      setResendTimer(30);
    }, 1000);
  };

  const wrapperStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-2xl' 
    : 'bg-white border-light-border text-gray-800 shadow-xl';

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-4 gap-6">
      
      {/* State Switcher Simulator Bar for Verification Demo */}
      <div className="flex items-center gap-2 p-1.5 bg-light-hover dark:bg-dark-hover rounded-xl border border-light-border dark:border-dark-border">
        <span className="text-[9px] uppercase font-bold text-gray-400 px-2">Demo State Switcher:</span>
        {['pending', 'successful', 'invalid'].map((s) => (
          <button
            key={s}
            onClick={() => setVerifyState(s)}
            className={`px-3 py-1 text-[10px] font-semibold rounded-lg capitalize transition-all ${
              verifyState === s
                ? 'bg-white dark:bg-dark-card text-indigo-500 shadow-sm border border-light-border dark:border-dark-border'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className={`w-full max-w-md p-8 rounded-2xl border transition-all ${wrapperStyle}`}>
        {isLoading ? (
          // Skeletal Loader Spinner
          <div className="text-center py-10 space-y-4">
            <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-gray-500">Querying email verification keys...</p>
          </div>
        ) : verifyState === 'successful' ? (
          // Verification Successful Screen
          <div className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">Email Verified Successfully!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Thank you for verifying your address. Your account is fully active and optimized.
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : verifyState === 'invalid' ? (
          // Invalid Verification link screen
          <div className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="h-7 w-7" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">Invalid or Expired Link</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                The verification token you clicked is invalid, malformed, or has already expired.
              </p>
            </div>

            <button
              onClick={handleRequestNewLink}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Request New Link</span>
            </button>
          </div>
        ) : (
          // Verification Pending Screen (Default)
          <div className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
              <Mail className="h-7 w-7" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">Verify Your Email Address</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                We have sent an authentication link to your email. Click the link in the message to activate your profile features.
              </p>
            </div>

            {resendSuccess && (
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                Verification email resent successfully!
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={resendTimer > 0}
              className={`w-full py-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                resendTimer > 0
                  ? 'border-gray-500/20 bg-gray-500/5 text-gray-400 cursor-default'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-transparent shadow-md shadow-indigo-500/20'
              }`}
            >
              {resendTimer > 0 ? (
                <>
                  <Clock className="h-4 w-4" />
                  <span>Resend in {resendTimer}s</span>
                </>
              ) : (
                <span>Resend Verification Email</span>
              )}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
