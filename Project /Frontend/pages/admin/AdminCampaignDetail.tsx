import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Campaign, AdminReview } from '../../types';
import { api } from '../../services/api';
import { Shield, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Loader2, User, Calendar, History, FileText } from 'lucide-react';

export const AdminCampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getCampaignById(Number(id));
      setCampaign(data.campaign);
      setReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign audit details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDecision = async (decision: 'APPROVE' | 'REJECT') => {
    if (!id) return;
    if (decision === 'REJECT' && !remarks.trim()) {
      setError('Please provide remarks explaining why this campaign is being rejected.');
      return;
    }

    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (decision === 'APPROVE') {
        const res = await api.admin.approveCampaign(Number(id), remarks.trim() || undefined);
        setSuccessMessage(res.message);
      } else {
        const res = await api.admin.rejectCampaign(Number(id), remarks.trim());
        setSuccessMessage(res.message);
      }
      // Reload details to show updated status and review log
      await fetchDetail();
    } catch (err: any) {
      setError(err.message || 'Audit action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Unable to load campaign</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Link
          to="/admin/campaigns"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Review Queue
        </Link>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        to="/admin/campaigns"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Campaigns
      </Link>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-slate-400">CMP-00{campaign.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                campaign.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : campaign.status === 'PENDING'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              Current Status: {campaign.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{campaign.title}</h1>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">Funding Target</p>
          <p className="text-2xl font-extrabold text-slate-900">₹{campaign.target_amount.toLocaleString()}</p>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Campaign Story & Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80'}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Submitted Campaign Narrative
              </h3>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {campaign.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-400 uppercase">Category</span>
                <p className="font-semibold text-slate-900 mt-0.5">{campaign.category}</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase">Submitted On</span>
                <p className="font-semibold text-slate-900 mt-0.5">{new Date(campaign.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Audit History Log */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Audit Trail & Review Log
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No previous administrator reviews recorded for this campaign.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Decision by {rev.admin_name || 'Admin'}</span>
                      <span
                        className={`font-bold uppercase ${
                          rev.decision === 'APPROVED' ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {rev.decision}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">"{rev.remarks || 'No remarks provided'}"</p>
                    <p className="text-[10px] text-slate-400">{new Date(rev.reviewed_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Audit Action Box */}
        <div className="md:col-span-1 space-y-6">
          {/* Creator Information Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Creator Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{campaign.creator_name}</p>
                <p className="text-xs text-slate-500">{campaign.creator_email}</p>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-600" />
              Review & Audit Action
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Audit Remarks / Justification
              </label>
              <textarea
                rows={4}
                placeholder="Enter remarks for verification or reason for rejection..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision('APPROVE')}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve & Publish Campaign
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision('REJECT')}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Reject Campaign
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Decisions are permanently saved to MySQL <code className="text-slate-600 font-mono">admin_reviews</code> table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
