import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminStats, Campaign } from '../../types';
import { api } from '../../services/api';
import { Shield, Clock, CheckCircle2, TrendingUp, Users, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.getStats(),
      api.admin.getCampaigns('PENDING'),
    ])
      .then(([statsData, pendingData]) => {
        setStats(statsData);
        setPendingCampaigns(pendingData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-primary text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <Shield className="w-3.5 h-3.5" />
            Administration & Verification Console
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Control Center</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Audit submitted social causes, manage user registrations, and ensure rigorous transparency standards across all platform transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/campaigns"
            className="px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
          >
            Review Campaigns
          </Link>
          <Link
            to="/admin/users"
            className="px-5 py-3 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Audit</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600">{stats.pending_campaigns}</p>
            <p className="text-xs text-slate-500">Waiting for review decision</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Approved Campaigns</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{stats.approved_campaigns}</p>
            <p className="text-xs text-slate-500">Publicly visible & collecting</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Raised</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">₹{stats.total_funds_raised.toLocaleString()}</p>
            <p className="text-xs text-slate-500">From {stats.total_donations} total contributions</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{stats.total_users}</p>
            <p className="text-xs text-slate-500">Donors, creators, and admins</p>
          </div>
        </div>
      )}

      {/* Pending Review Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900">Pending Review Queue</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
              {pendingCampaigns.length} Action Needed
            </span>
          </div>
          <Link
            to="/admin/campaigns"
            className="text-xs font-bold text-primary hover:text-slate-900 flex items-center gap-1"
          >
            View All Campaigns
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingCampaigns.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Review Queue is Clear!</h3>
            <p className="text-xs text-slate-500">No campaigns are currently waiting for admin authorization.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCampaigns.map((camp) => (
              <div key={camp.id} className="p-6 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500">{camp.category}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    PENDING
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{camp.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Submitted by: {camp.creator_name || 'Creator'}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">{camp.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Target Goal</span>
                    <p className="font-bold text-slate-900 text-sm">₹{camp.target_amount.toLocaleString()}</p>
                  </div>

                  <Link
                    to={`/admin/campaigns/${camp.id}`}
                    className="px-4 py-2 rounded-xl font-bold text-white bg-primary hover:bg-slate-900 transition-colors"
                  >
                    Audit & Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
