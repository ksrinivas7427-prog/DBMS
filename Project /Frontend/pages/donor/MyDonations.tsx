import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Donation } from '../../types';
import { api } from '../../services/api';
import { Gift, Loader2, AlertCircle, ArrowUpRight, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';

export const MyDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.donations.getMy();
      setDonations(data.donations);
    } catch (err: any) {
      setError(err.message || 'Failed to load donation history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/donor/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Donor Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Donation History</h1>
          <p className="text-sm text-slate-600 mt-1">
            Audited transaction ledger recorded in MySQL. Every record reflects live data.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh from MySQL
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      ) : donations.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No donations yet.</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You have not made any donations with this account. Browse active campaigns to support a cause.
          </p>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-slate-900"
          >
            Explore Campaigns
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Campaign Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Amount Contributed</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {donations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-500">
                      DON-00{item.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{item.campaign_title}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.campaign_category || 'Cause'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-700 text-base">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SUCCESS
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(item.donated_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/campaigns/${item.campaign_id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                      >
                        View Cause
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
