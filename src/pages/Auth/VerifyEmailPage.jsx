import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw, Clock } from 'lucide-react';
import { auth } from '../../services/auth';

export default function VerifyEmailPage() {
  const { theme } = useAuthStore();
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const [verifyState, setVerifyState] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (email && token) {
      setIsLoading(true);
      auth.verifyEmail({ email, token })
        .then(() => {
          setVerifyState('successful');
          setMessage('Email verified successfully.');
        })
        .catch((error) => {
          setVerifyState('invalid');
          setMessage(error?.message || 'The verification token is invalid or expired.');
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  // Timer countdown logic for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setResendSuccess(false);

    try {
      await auth.resendVerification({ email });
      setResendSuccess(true);
      setResendTimer(60);
      setMessage('Verification email resent successfully.');
    } catch (error) {
      setMessage(error?.message || 'Unable to resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = async () => {
    setIsLoading(true);
    try {
      await auth.resendVerification({ email });
      setVerifyState('pending');
      setResendTimer(30);
      setMessage('A new verification email has been sent.');
    } catch (error) {
      setMessage(error?.message || 'Unable to request a new verification link.');
    } finally {
      setIsLoading(false);
    }
  };

  const wrapperStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-2xl' 
    : 'bg-white border-light-border text-gray-800 shadow-xl';

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-4 gap-6">
      
      <div className={`w-full max-w-md p-8 rounded-2xl border transition-all ${wrapperStyle}`}>
        {isLoading ? (
          <div className="text-center py-10 space-y-4">
            <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-gray-500">Processing verification request...</p>
          </div>
        ) : verifyState === 'successful' ? (
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
              <span>Go to Login</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : verifyState === 'invalid' ? (
          <div className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="h-7 w-7" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">Invalid or Expired Link</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {message || 'The verification token you clicked is invalid, malformed, or has already expired.'}
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
          <div className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
              <Mail className="h-7 w-7" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">Verify Your Email Address</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {message || 'Enter your email and token to complete verification, or request a fresh verification email.'}
              </p>
            </div>

            <div className="space-y-3 text-left">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
              />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Verification token"
                className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
              />
              <button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await auth.verifyEmail({ email, token });
                    setVerifyState('successful');
                    setMessage('Email verified successfully.');
                  } catch (error) {
                    setVerifyState('invalid');
                    setMessage(error?.message || 'Verification failed.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={!email || !token}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Verify Email
              </button>
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
