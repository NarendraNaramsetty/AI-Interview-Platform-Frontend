import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { Sparkles, Mail, Lock, Loader2 } from 'lucide-react';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import LinkedInLoginButton from '../../components/LinkedInLoginButton';

export default function LoginPage() {
  const { login, hydrateUser, theme } = useAuthStore();
  const { pushToast } = useToastStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const access = query.get('access');
    const refresh = query.get('refresh');
    const errorParam = query.get('error');

    if (errorParam) {
      pushToast({ message: decodeURIComponent(errorParam), type: 'error' });
      navigate('/login', { replace: true });
      return;
    }

    if (access && refresh) {
      setLoading(true);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      hydrateUser().then(() => {
        pushToast({ message: "Successfully logged in with LinkedIn!", type: "success" });
        navigate('/dashboard', { replace: true });
      }).catch((err) => {
        pushToast({ message: "Failed to retrieve user profile after LinkedIn handshake.", type: "error" });
        setLoading(false);
      });
    }
  }, [hydrateUser, navigate, pushToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.errors) {
        const messages = Object.entries(responseData.errors)
          .map(([field, msgs]) => {
            const formattedMsgs = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
            return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${formattedMsgs}`;
          })
          .join('\n');
        setError(messages || responseData.message || 'Login validation failed.');
      } else if (responseData?.message) {
        setError(responseData.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] flex flex-col md:flex-row ${
      theme === 'dark' ? 'bg-dark-bg text-gray-200' : 'bg-light-bg text-gray-800'
    }`}>
      {/* Left panel: Info/Visual */}
      <div className="flex-1 bg-gradient-to-br from-indigo-900/40 via-violet-950/20 to-transparent flex flex-col justify-center p-8 lg:p-16 border-b md:border-b-0 md:border-r border-gray-500/10">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
            <Sparkles className="h-4 w-4" />
            <span>Interactive Simulator sandbox</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
            Accelerate Your Technical Career Growth.
          </h2>
          <p className="text-sm text-gray-500">
            Prepare with hyper-realistic coding and speaking mocks. Review syntax checkmarks, pronunciation confidence levels, and model-level AI sample answers instantly.
          </p>
          <div className="p-4 rounded-xl border border-dashed border-gray-500/20 bg-dark-card/20 space-y-2">
            <p className="text-xs font-semibold text-indigo-400">Secure JWT authentication</p>
            <p className="text-xs text-gray-400">Use your registered email and password to sign in.</p>
          </div>
        </div>
      </div>

      {/* Right panel: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-dark-card/5">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h3 className="font-display font-bold text-2xl">Sign In</h3>
            <p className="text-sm text-gray-500 mt-1">Welcome back. Enter your details to continue.</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  theme === 'dark' 
                    ? 'bg-dark-bg border-dark-border text-white placeholder-gray-600' 
                    : 'bg-white border-light-border text-gray-800 placeholder-gray-400'
                }`}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  theme === 'dark' 
                    ? 'bg-dark-bg border-dark-border text-white placeholder-gray-600' 
                    : 'bg-white border-light-border text-gray-800 placeholder-gray-400'
                }`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-500/10"></div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-gray-500/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GoogleLoginButton />
            <LinkedInLoginButton />
          </div>

          <p className="text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
