import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../types';
import { api } from '../services/api';
import { CampaignCard } from '../components/CampaignCard';
import { HeartHandshake, ShieldCheck, Sparkles, TrendingUp, Users, ArrowRight, AlertCircle, Database } from 'lucide-react';

export const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({ connected: false, message: 'Checking...' });

  useEffect(() => {
    // Check DB Health
    api.checkHealth()
      .then((data) => setDbStatus({ connected: data.status === 'ok', message: data.message }))
      .catch((err) => setDbStatus({ connected: false, message: err.message }));

    // Fetch Public Approved Campaigns
    api.campaigns.getPublic()
      .then((data) => {
        setCampaigns(data.slice(0, 3)); // show top 3 on home
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Live MySQL Health Banner */}
      <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="font-semibold text-slate-800">MySQL Database Status:</span>
            <span>{dbStatus.message}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono">
            <span>DB: crowdconnect</span>
            <span>Port: 3306</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-slate-900 to-slate-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
          {/* Subtle geometric circles in background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 rounded-full bg-secondary/10 pointer-events-none blur-3xl"></div>

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Verified Crowdfunding for Genuine Social Impact
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Empower Lives. Fund Real Change.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
              CrowdConnect connects compassionate donors with verified healthcare emergencies, educational equity programs, and disaster relief operations across India.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-accent hover:bg-amber-400 transition-all shadow-lg shadow-accent/20"
              >
                Donate to a Cause
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/creator/campaigns/create"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20 backdrop-blur"
              >
                Start a Fundraiser
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">100% Verified</p>
              <p className="text-xs text-slate-500 font-medium">Strict Admin Review Process</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Atomic Storage</p>
              <p className="text-xs text-slate-500 font-medium">Real MySQL ACID Transactions</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Direct Impact</p>
              <p className="text-xs text-slate-500 font-medium">Targeted Social Causes</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Role Governed</p>
              <p className="text-xs text-slate-500 font-medium">Donors, Creators & Admins</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Approved Campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
              <Database className="w-3.5 h-3.5" />
              Live Database Feed
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Approved Campaigns</h2>
            <p className="text-sm text-slate-500 mt-1">Verified campaigns currently active and accepting donations.</p>
          </div>

          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-slate-900 transition-colors"
          >
            View all approved campaigns
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-base">Unable to connect to backend server</h4>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs text-rose-600 mt-2">Make sure backend is running on http://localhost:8000 and MySQL is active.</p>
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
            <p className="text-lg font-semibold text-slate-700">No approved campaigns available.</p>
            <p className="text-sm text-slate-500 mt-1">Check back later or register as a creator to start a campaign.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">How CrowdConnect Works</h2>
            <p className="text-sm text-slate-600 mt-2">A secure, transparent lifecycle ensuring donor funds reach genuine recipients.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Creator Submits</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Creators register and submit social campaigns with target funding amounts. Campaigns are initialized with <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">PENDING</span> status.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Admin Audit & Review</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Administrators verify beneficiary documentation. Only thoroughly audited causes are marked as <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">APPROVED</span>.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Donations & Live Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Donors contribute securely. Raised funds update in real-time in MySQL through atomic ACID database transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
