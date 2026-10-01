import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Campaign, CampaignContent } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake, ShieldCheck, User, Calendar, CheckCircle2,
  AlertCircle, ArrowLeft, Heart, Loader2, BookOpen, Database,
  Users, RefreshCw, ImageIcon
} from 'lucide-react';

export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isDonor } = useAuth();

  // MySQL state
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MongoDB state
  const [content, setContent] = useState<CampaignContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'beneficiaries'>('story');

  // Donation form state
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donating, setDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState<string | null>(null);
  const [donationError, setDonationError] = useState<string | null>(null);

  const fetchCampaign = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.campaigns.getById(Number(id));
      setCampaign(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    if (!id) return;
    setContentLoading(true);
    try {
      const data = await api.campaigns.getContent(Number(id));
      setContent(data);
    } catch {
      // MongoDB content is optional; not all campaigns will have it
      setContent(null);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchContent();
  }, [id]);

  const handleQuickAmount = (val: number) => {
    setDonationAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setDonationAmount(parsed);
    }
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/campaigns/${id}` } } });
      return;
    }

    if (!isDonor) {
      setDonationError('Only accounts with the DONOR role can make donations. Please switch to a Donor account.');
      return;
    }

    if (donationAmount <= 0) {
      setDonationError('Please specify an amount greater than zero.');
      return;
    }

    setDonating(true);
    setDonationError(null);
    setDonationSuccess(null);

    try {
      const res = await api.donations.donate(Number(id), donationAmount);
      setDonationSuccess(res.message);
      if (res.updated_campaign && campaign) {
        setCampaign({
          ...campaign,
          raised_amount: res.updated_campaign.raised_amount,
          progress_percentage: res.updated_campaign.progress_percentage,
        });
      }
    } catch (err: any) {
      setDonationError(err.message || 'Donation failed.');
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading campaign details from MySQL...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold">Campaign Not Available</h2>
          <p className="text-sm">{error || 'Campaign not found or pending admin review.'}</p>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((campaign.raised_amount / campaign.target_amount) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all campaigns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Main Story & MongoDB Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 h-96">
            <img
              src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80'}
              alt={campaign.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur shadow-md">
                {campaign.category}
              </span>
            </div>
            {campaign.status === 'APPROVED' && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white backdrop-blur shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  Admin Verified
                </span>
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {campaign.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 py-3 border-y border-slate-200 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-medium">Campaign Creator</p>
                  <p className="font-semibold text-slate-900">{campaign.creator_name || 'Verified Creator'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published {new Date(campaign.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Social Cause</span>
              </div>

              {/* Database badge */}
              <div className="flex items-center gap-1.5 text-slate-500 font-medium ml-auto">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px]">MySQL + MongoDB</span>
              </div>
            </div>
          </div>

          {/* ── MySQL: Basic Description ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-bold text-slate-900">Campaign Description</h2>
              <span className="ml-auto text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                MySQL
              </span>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed whitespace-pre-line bg-white p-6 rounded-2xl border border-slate-200">
              {campaign.description}
            </div>
          </div>

          {/* ── MongoDB: Rich Content Tabs ── */}
          {contentLoading ? (
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Loading extended content from MongoDB...
            </div>
          ) : content ? (
            <div className="space-y-4">
              {/* Tab Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">Extended Content</h2>
                  <span className="ml-2 text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    MongoDB
                  </span>
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                {(['story', 'updates', 'beneficiaries'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                      activeTab === tab
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'story' && '📖 '}
                    {tab === 'updates' && '🔄 '}
                    {tab === 'beneficiaries' && '👥 '}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                {activeTab === 'story' && (
                  <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {content.story || (
                      <span className="text-slate-400 italic">No detailed story has been added yet by the creator.</span>
                    )}
                    {/* Media images from MongoDB */}
                    {content.media && content.media.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 gap-3 not-prose">
                        <div className="flex items-center gap-1.5 col-span-2 text-xs font-semibold text-slate-500">
                          <ImageIcon className="w-3.5 h-3.5" /> Campaign Media
                        </div>
                        {content.media.map((m, i) => (
                          <div key={i} className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img
                              src={m.url}
                              alt={m.caption || `Media ${i + 1}`}
                              className="w-full h-40 object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            {m.caption && (
                              <p className="text-xs text-slate-600 p-2 font-medium">{m.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="space-y-4">
                    {content.updates && content.updates.length > 0 ? (
                      content.updates.map((upd, i) => (
                        <div key={i} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-slate-900 text-sm">{upd.title}</h4>
                              <span className="text-[11px] text-slate-400">
                                {new Date(upd.created_at || upd.date || '').toLocaleDateString(undefined, { dateStyle: 'medium' })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{upd.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic text-center py-6">
                        No campaign updates posted yet. Check back soon.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'beneficiaries' && (
                  <div className="space-y-4">
                    {content.beneficiary_details ? (
                      <div className="space-y-3">
                        {content.beneficiary_details.name && (
                          <div className="flex gap-3 items-start">
                            <Users className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Beneficiary</p>
                              <p className="font-bold text-slate-900">{content.beneficiary_details.name}</p>
                            </div>
                          </div>
                        )}
                        {content.beneficiary_details.age && (
                          <div className="flex gap-3 items-start">
                            <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Age</p>
                              <p className="font-semibold text-slate-900">{content.beneficiary_details.age} years</p>
                            </div>
                          </div>
                        )}
                        {content.beneficiary_details.location && (
                          <div className="flex gap-3 items-start">
                            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Location</p>
                              <p className="font-semibold text-slate-900">{content.beneficiary_details.location}</p>
                            </div>
                          </div>
                        )}
                        {(content.beneficiary_details.condition || content.beneficiary_details.description) && (
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-900">
                            <p className="font-semibold mb-1">Medical / Social Condition</p>
                            <p className="leading-relaxed">
                              {content.beneficiary_details.condition || content.beneficiary_details.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic text-center py-6">
                        Beneficiary details have not been added yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-sm text-slate-400 text-center flex flex-col items-center gap-2">
              <Database className="w-5 h-5 text-slate-300" />
              <span>No extended MongoDB content for this campaign yet.</span>
            </div>
          )}

          {/* Transparency Box */}
          <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-4 text-sm text-blue-900">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">CrowdConnect Verification Guarantee</h4>
              <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                This campaign underwent documentation review and authorization by platform administrators before publication.
                All contributions are recorded in <strong>MySQL</strong> via atomic transactions. Rich content (story, updates,
                media) is stored in <strong>MongoDB</strong> for flexible document management.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Floating Donation Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            {/* Progress status */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{campaign.raised_amount.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  of ₹{campaign.target_amount.toLocaleString()} goal
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
                <span className="text-primary font-bold">{progress}% completed</span>
                <span>Status: <strong className="text-emerald-600">{campaign.status}</strong></span>
              </div>
            </div>

            {/* Donation Success Alert */}
            {donationSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-sm">Donation Confirmed!</p>
                  <p className="mt-0.5">{donationSuccess}</p>
                  <p className="mt-1 font-mono text-[11px] text-emerald-700">Atomic MySQL Transaction Committed.</p>
                </div>
              </div>
            )}

            {/* Donation Error Alert */}
            {donationError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-sm">Action Required</p>
                  <p className="mt-0.5">{donationError}</p>
                </div>
              </div>
            )}

            {/* Donation Form */}
            <form onSubmit={handleDonateSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Donation Amount (INR)
                </label>

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickAmount(amt)}
                      className={`py-2 rounded-xl text-sm font-bold transition-all border ${
                        donationAmount === amt && !customAmount
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Other custom amount"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={donating}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-white bg-primary hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {donating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Mock Payment...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-accent fill-accent" />
                    Donate ₹{donationAmount.toLocaleString()} Now
                  </>
                )}
              </button>

              {/* Subtext info */}
              <div className="text-center space-y-1">
                <p className="text-[11px] text-slate-500">
                  Mock payment process for college demonstration (no real money charged).
                </p>
                {!isAuthenticated && (
                  <p className="text-xs text-primary font-medium">
                    You will be redirected to sign in before confirming your donation.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
