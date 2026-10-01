import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../../types';
import { api } from '../../services/api';
import { Shield, Loader2, AlertCircle, ArrowUpRight, CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';

const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

export const AdminCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getCampaigns(statusFilter);
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 mb-1">
            <Shield className="w-3.5 h-3.5" />
            Admin Audit Console
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaign Review & Oversight</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Audit campaigns submitted by creators and issue formal approval or rejection decisions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'All Campaigns' : st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          {error}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No campaigns waiting in this category.</h3>
          <p className="text-sm text-slate-500">Try changing the status filter above to inspect other campaigns.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">ID & Title</th>
                  <th className="py-4 px-6">Creator</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Funding Goal</th>
                  <th className="py-4 px-6">Raised</th>
                  <th className="py-4 px-6">Current Status</th>
                  <th className="py-4 px-6 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 line-clamp-1">{camp.title}</div>
                      <div className="text-xs text-slate-400 font-mono">CMP-00{camp.id} • {new Date(camp.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{camp.creator_name}</div>
                      <div className="text-xs text-slate-400">{camp.creator_email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {camp.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">₹{camp.target_amount.toLocaleString()}</td>
                    <td className="py-4 px-6 font-bold text-emerald-700">₹{camp.raised_amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      {camp.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      ) : camp.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/admin/campaigns/${camp.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-primary transition-colors shadow-sm"
                      >
                        Audit Details
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
