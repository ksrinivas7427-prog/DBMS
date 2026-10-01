import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { HeartHandshake, User, Mail, Lock, AlertCircle, Loader2, ArrowRight, Heart, Sparkles } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DONOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newUser = await register(name.trim(), email.trim().toLowerCase(), password, role);
      if (newUser.role === 'CREATOR') {
        navigate('/creator/dashboard', { replace: true });
      } else {
        navigate('/donor/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-surface">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
        <p className="text-sm text-slate-600">
          Join CrowdConnect as a verified donor or campaign creator.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Issue</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                I want to participate as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('DONOR')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    role === 'DONOR'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 mb-1 ${role === 'DONOR' ? 'text-primary' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Donor</p>
                    <p className="text-[10px] text-slate-500">Contribute to social causes</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CREATOR')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    role === 'CREATOR'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className={`w-5 h-5 mb-1 ${role === 'CREATOR' ? 'text-primary' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Creator</p>
                    <p className="text-[10px] text-slate-500">Raise funds for causes</p>
                  </div>
                </button>
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
                  Creating Account in MySQL...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
