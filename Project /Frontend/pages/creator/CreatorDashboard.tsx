import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.campaigns.getMy()
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load creator campaigns.');
        setLoading(false);
      });
  }, []);

  const totalRaised = campaigns.reduce((acc, c) => acc + (c.raised_amount || 0), 0);
  const pendingCount = campaigns.filter((c) => c.status === 'PENDING').length;
  const approvedCount = campaigns.filter((c) => c.status === 'APPROVED').length;
  const rejectedCount = campaigns.filter((c) => c.status === 'REJECTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary to-secondary text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Creator Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-slate-200 text-sm max-w-xl leading-relaxed">
            Manage your social initiatives, submit new verified campaigns, and track donor engagement in real-time.
          </p>
        </div>

        <Link
          to="/creator/campaigns/create"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-lg shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-secondary" />
          Create New Campaign
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Raised</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">₹{totalRaised.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Across all your active campaigns</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Approved & Live</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{approvedCount}</p>
          <p className="text-xs text-slate-500">Actively collecting donor funds</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{pendingCount}</p>
          <p className="text-xs text-slate-500">Waiting for administrator audit</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{rejectedCount}</p>
          <p className="text-xs text-slate-500">Requires review or modification</p>
        </div>
      </div>

      {/* Recent Campaigns Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Campaigns</h2>
            <p className="text-xs text-slate-500">Real-time status stored in MySQL</p>
          </div>
          <Link
            to="/creator/campaigns"
            className="text-xs font-bold text-primary hover:text-slate-900 flex items-center gap-1"
          >
            View All Campaigns ({campaigns.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            {error}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <p className="text-base font-semibold text-slate-700">You haven't created any campaigns yet.</p>
            <p className="text-xs text-slate-500">Start your first social cause fundraiser in just 2 minutes.</p>
            <Link
              to="/creator/campaigns/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-slate-900"
            >
              <PlusCircle className="w-4 h-4" />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.slice(0, 3).map((camp) => (
              <div key={camp.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">{camp.category}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      camp.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : camp.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 line-clamp-1">{camp.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{camp.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">₹{camp.raised_amount.toLocaleString()}</span>
                    <span className="text-slate-400">of ₹{camp.target_amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(100, (camp.raised_amount / camp.target_amount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
