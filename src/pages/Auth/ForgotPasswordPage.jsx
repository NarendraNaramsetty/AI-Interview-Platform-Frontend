import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../services/auth';

export default function ForgotPasswordPage() {
  const { theme } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await auth.forgotPassword({ email });
      setIsSuccess(true);
    } catch (error) {
      setErrorMsg(error?.message || 'No account found matching this email address.');
    } finally {
      setIsLoading(false);
    }
  };

  const wrapperStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-2xl' 
    : 'bg-white border-light-border text-gray-800 shadow-xl';

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-8 rounded-2xl border transition-all ${wrapperStyle}`}>
        
        {isSuccess ? (
          // Success State View
          <div className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">OTP Sent Successfully!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                We have emailed a 6-digit confirmation code to <span className="font-semibold text-gray-700 dark:text-gray-200">{email}</span>.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/reset-password', { state: { email } })}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1"
            >
              <span>Proceed to Reset Password</span>
              <KeyRound className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Change email address
            </button>
          </div>
        ) : (
          // Input Form View
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-display font-extrabold tracking-tight">Recover Credentials</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Input your registered email below, and we will send a 6-digit verification code to reset your credentials.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 flex items-center gap-2.5 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Requesting OTP...</span>
                  </>
                ) : (
                  <span>Send Verification Code</span>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-light-border dark:border-dark-border text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-indigo-500 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
