import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Lock, Mail, AlertCircle, Loader2, ArrowRight, Shield, UserCheck, Heart } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loggedUser = await login(email.trim(), password);
      // If there was a redirect origin (e.g. from donation page), go there
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      // Otherwise route by role
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedUser.role === 'CREATOR') {
        navigate('/creator/dashboard', { replace: true });
      } else {
        navigate('/donor/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo 1-click shortcut filler
  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-surface">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign in to CrowdConnect</h2>
        <p className="text-sm text-slate-600">
          Enter your credentials to access your donor, creator, or administrator dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Failed</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-primary hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying with MySQL...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Reviewer Credentials */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
              Quick Review Demo Credentials (Click to fill)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@crowdconnect.com', 'Admin@123')}
                className="p-2 rounded-xl text-left bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-rose-700">
                  <Shield className="w-3 h-3" />
                  Admin
                </div>
                <p className="text-[10px] text-rose-600 truncate mt-0.5">Admin@123</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('creator@crowdconnect.com', 'Creator@123')}
                className="p-2 rounded-xl text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-blue-700">
                  <UserCheck className="w-3 h-3" />
                  Creator
                </div>
                <p className="text-[10px] text-blue-600 truncate mt-0.5">Creator@123</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('donor@crowdconnect.com', 'Donor@123')}
                className="p-2 rounded-xl text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <Heart className="w-3 h-3" />
                  Donor
                </div>
                <p className="text-[10px] text-emerald-600 truncate mt-0.5">Donor@123</p>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
