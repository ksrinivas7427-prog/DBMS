import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Donation } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Heart, Gift, ArrowRight, Loader2, TrendingUp, CheckCircle2 } from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<{ total_donated: number; causes_supported: number; total_donations_count: number }>({
    total_donated: 0,
    causes_supported: 0,
    total_donations_count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.donations.getMy()
      .then((data) => {
        setDonations(data.donations);
        if (data.stats) {
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-primary text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            Verified Donor Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Thank you for bringing hope and vital resources to verified grassroots causes across our communities.
          </p>
        </div>

        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-slate-950 bg-accent hover:bg-amber-400 transition-all shadow-lg shrink-0"
        >
          Explore Causes to Support
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Contributed</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">₹{stats.total_donated.toLocaleString()}</p>
          <p className="text-xs text-slate-500 font-medium">Recorded in MySQL database</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Causes Supported</span>
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.causes_supported}</p>
          <p className="text-xs text-slate-500 font-medium">Distinct verified initiatives</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Donations</span>
            <Gift className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.total_donations_count}</p>
          <p className="text-xs text-slate-500 font-medium">Completed mock transactions</p>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Recent Contributions</h2>
            <p className="text-xs text-slate-500">Real transaction audit records</p>
          </div>
          <Link
            to="/donor/donations"
            className="text-xs font-bold text-primary hover:text-slate-900 flex items-center gap-1"
          >
            View Full Donation History
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <p className="text-base font-semibold text-slate-700">No donations recorded yet.</p>
            <p className="text-xs text-slate-500">Explore active campaigns and make your first verified contribution.</p>
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-slate-900"
            >
              Discover Causes
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Supported Campaign</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {donations.slice(0, 5).map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-3.5 px-6 text-xs text-slate-500">
                        {new Date(d.donated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="py-3.5 px-6">
                        <Link to={`/campaigns/${d.campaign_id}`} className="font-bold text-slate-900 hover:text-primary transition-colors">
                          {d.campaign_title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-emerald-700 text-base">
                        ₹{d.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Success
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right text-xs font-mono text-slate-400">
                        TXN-00{d.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
