import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../../types';
import { api } from '../../services/api';
import { PlusCircle, Loader2, AlertCircle, ArrowUpRight, Clock, CheckCircle2, XCircle, Database } from 'lucide-react';

export const MyCampaigns: React.FC = () => {
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
        setError(err.message || 'Failed to load your campaigns.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Submitted Campaigns</h1>
          <p className="text-sm text-slate-600 mt-1">
            Track real-time approval status and donor funds collected for all your registered initiatives.
          </p>
        </div>
        <Link
          to="/creator/campaigns/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-slate-900 transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Dual-DB Info Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/5 border border-slate-900/10 flex items-center gap-3 text-xs text-slate-700">
        <Database className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong>Dual Database:</strong> Core campaign data (goal, status, donations) is stored in{' '}
          <strong>MySQL</strong>. Use <strong>&quot;Manage Content&quot;</strong> to add rich stories,
          beneficiary details, and updates that are stored in <strong>MongoDB</strong>.
        </span>
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
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 font-bold text-xl">
            0
          </div>
          <h3 className="text-lg font-bold text-slate-900">No campaigns found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You have not submitted any campaigns under this account. Create one to begin fundraising.
          </p>
          <Link
            to="/creator/campaigns/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-slate-900"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Campaign
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Campaign Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Funding Goal</th>
                  <th className="py-4 px-6">Raised</th>
                  <th className="py-4 px-6">Progress</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {campaigns.map((camp) => {
                  const progress = Math.min(100, Math.round((camp.raised_amount / camp.target_amount) * 100));
                  return (
                    <tr key={camp.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{camp.title}</div>
                        <div className="text-xs text-slate-400">
                          Created {new Date(camp.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {camp.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        ₹{camp.target_amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-700">
                        ₹{camp.raised_amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 w-36">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-primary">{progress}%</span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
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
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {/* ← MongoDB Content Button */}
                          <Link
                            to={`/creator/campaigns/${camp.id}/content`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                            title="Edit rich content stored in MongoDB"
                          >
                            <Database className="w-3 h-3 text-primary" />
                            Manage Content
                          </Link>

                          {/* View live only when approved */}
                          {camp.status === 'APPROVED' && (
                            <Link
                              to={`/campaigns/${camp.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                            >
                              View Live
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
