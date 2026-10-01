import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Campaign, CampaignContent, CampaignUpdate, CampaignMedia } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Database,
  ArrowLeft,
  Save,
  PlusCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  ExternalLink,
  Trash2,
  FileText,
  MapPin,
  Users,
  Image as ImageIcon,
  Clock
} from 'lucide-react';

export const ManageCampaignContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [content, setContent] = useState<CampaignContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form Fields (MongoDB Documents)
  const [story, setStory] = useState('');
  const [problem, setProblem] = useState('');
  const [causeBeneficiaries, setCauseBeneficiaries] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');

  // Beneficiary Info
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryLocation, setBeneficiaryLocation] = useState('');
  const [beneficiaryCount, setBeneficiaryCount] = useState<number | ''>('');
  const [beneficiaryDescription, setBeneficiaryDescription] = useState('');

  // Updates
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [postingUpdate, setPostingUpdate] = useState(false);

  // Media
  const [mediaList, setMediaList] = useState<CampaignMedia[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');

  const campaignId = Number(id);

  const loadData = async () => {
    if (!campaignId) return;
    setLoading(true);
    setSaveError(null);
    try {
      // 1. Fetch MySQL Campaign
      const camp = await api.campaigns.getById(campaignId);
      setCampaign(camp);

      // Verify creator ownership or admin
      if (user?.role !== 'ADMIN' && camp.creator_id !== user?.id) {
        setSaveError('You do not have permission to manage content for this campaign.');
        setLoading(false);
        return;
      }

      // 2. Fetch MongoDB Content
      const mongoContent = await api.campaigns.getContent(campaignId);
      if (mongoContent) {
        setContent(mongoContent);
        setStory(mongoContent.story || '');
        setProblem(mongoContent.cause_details?.problem || '');
        setCauseBeneficiaries(mongoContent.cause_details?.beneficiaries || '');
        setLocation(mongoContent.cause_details?.location || '');
        setDuration(mongoContent.cause_details?.project_duration || '');

        setBeneficiaryName(mongoContent.beneficiary_details?.name || '');
        setBeneficiaryLocation(mongoContent.beneficiary_details?.location || '');
        setBeneficiaryCount(mongoContent.beneficiary_details?.number_of_beneficiaries || '');
        setBeneficiaryDescription(mongoContent.beneficiary_details?.description || '');

        setUpdates(mongoContent.updates || []);
        setMediaList(mongoContent.media || []);
      } else {
        // Pre-fill with description from MySQL as draft story
        setStory(camp.description || '');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to load campaign data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [campaignId]);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    const payload: Partial<CampaignContent> = {
      campaign_id: campaignId,
      story: story.trim(),
      cause_details: {
        problem: problem.trim(),
        beneficiaries: causeBeneficiaries === '' ? 0 : Number(causeBeneficiaries),
        location: location.trim(),
        project_duration: duration.trim(),
      },
      beneficiary_details: {
        name: beneficiaryName.trim(),
        location: beneficiaryLocation.trim(),
        number_of_beneficiaries: beneficiaryCount === '' ? 0 : Number(beneficiaryCount),
        description: beneficiaryDescription.trim(),
      },
      updates,
      media: mediaList,
    };

    try {
      const res = await api.campaigns.saveContent(campaignId, payload);
      setSaveSuccess('All campaign content successfully committed to MongoDB (campaign_contents)!');
      if (res.content) {
        setContent(res.content);
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save to MongoDB.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) {
      alert('Please provide both update title and content.');
      return;
    }

    setPostingUpdate(true);
    try {
      const res = await api.campaigns.addUpdate(campaignId, {
        title: newUpdateTitle.trim(),
        content: newUpdateContent.trim(),
      });
      setUpdates(res.content?.updates || [
        ...updates,
        {
          title: newUpdateTitle.trim(),
          content: newUpdateContent.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setNewUpdateTitle('');
      setNewUpdateContent('');
      setSaveSuccess('New update added to MongoDB updates array!');
    } catch (err: any) {
      setSaveError(err.message || 'Failed to post update.');
    } finally {
      setPostingUpdate(false);
    }
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const newItem: CampaignMedia = {
      type: 'image',
      url: newMediaUrl.trim(),
      caption: newMediaCaption.trim() || undefined,
    };
    setMediaList([...mediaList, newItem]);
    setNewMediaUrl('');
    setNewMediaCaption('');
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList(mediaList.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading campaign content from MongoDB...</p>
      </div>
    );
  }

  if (saveError && !campaign) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold">Access Error</h2>
          <p className="text-sm">{saveError}</p>
          <Link
            to="/creator/campaigns"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/creator/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Campaigns
        </Link>
        {campaign?.status === 'APPROVED' && (
          <Link
            to={`/campaigns/${campaign.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-slate-900"
          >
            View Live Public Page
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            <Database className="w-3.5 h-3.5" />
            MongoDB Document Editor
          </span>
          <span className="text-slate-400 font-mono">Database: crowdconnect | Collection: campaign_contents</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Flexible Content: {campaign?.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Core relational info (Goal: ₹{campaign?.target_amount.toLocaleString()}, Status: {campaign?.status}) resides securely in MySQL.
          Use this editor to manage rich narrative stories, nested cause details, beneficiary profiles, milestone updates, and media in MongoDB.
        </p>
      </div>

      {/* Success / Error Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">MongoDB Persistence Confirmed</p>
            <p className="text-xs mt-0.5">{saveSuccess}</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error</p>
            <p className="text-xs mt-0.5">{saveError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Section 1: Detailed Story */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold">1. Detailed Campaign Story (MongoDB)</h2>
              <p className="text-xs text-slate-500">Provide an in-depth, multi-paragraph story explaining why this social initiative matters.</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Campaign Story Narrative
            </label>
            <textarea
              rows={8}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Write the comprehensive narrative, background context, urgent need, and community impact..."
              className="w-full px-4 py-3 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Cause Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold">2. Flexible Cause Details (Nested Document)</h2>
              <p className="text-xs text-slate-500">Structured parameters describing the problem and target location.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Problem Statement Description
              </label>
              <textarea
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. Severe seasonal fluorosis and mineral contamination in drinking borewells."
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Number of Beneficiaries
                </label>
                <input
                  type="number"
                  min="0"
                  value={causeBeneficiaries}
                  onChange={(e) => setCauseBeneficiaries(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 2400"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Location / Region
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kanchipuram, Tamil Nadu"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Project Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 6 Months"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Beneficiary Organization Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold">3. Beneficiary Profile (Nested Object)</h2>
              <p className="text-xs text-slate-500">Flexible attributes about the NGO, hospital, or community alliance receiving funds.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Beneficiary Organization / Group Name
              </label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="e.g. Rural Primary School Education Alliance"
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Headquarters / Operating Location
              </label>
              <input
                type="text"
                value={beneficiaryLocation}
                onChange={(e) => setBeneficiaryLocation(e.target.value)}
                placeholder="e.g. Tamil Nadu, India"
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Beneficiary Background & Charter
            </label>
            <textarea
              rows={3}
              value={beneficiaryDescription}
              onChange={(e) => setBeneficiaryDescription(e.target.value)}
              placeholder="e.g. Network of 12 government primary school headmasters and local parent committees..."
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            />
          </div>
        </div>

        {/* Section 4: Campaign Updates */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold">4. Campaign Updates (Array of Subdocuments)</h2>
              <p className="text-xs text-slate-500">Post milestone progress updates that keep donors informed in real-time.</p>
            </div>
          </div>

          {/* List Existing Updates */}
          {updates.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No updates posted yet. Add the first milestone below.</p>
          ) : (
            <div className="space-y-3">
              {updates.map((upd, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{upd.title}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(upd.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{upd.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Post New Update Box */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Post New Milestone Update</h4>
            <div className="space-y-2">
              <input
                type="text"
                value={newUpdateTitle}
                onChange={(e) => setNewUpdateTitle(e.target.value)}
                placeholder="Update Title (e.g. Filtration Equipment Delivered to Site)"
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
              <textarea
                rows={2}
                value={newUpdateContent}
                onChange={(e) => setNewUpdateContent(e.target.value)}
                placeholder="Update details for your donors..."
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium leading-relaxed"
              />
            </div>
            <button
              type="button"
              onClick={handleAddUpdate}
              disabled={postingUpdate}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-slate-900 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {postingUpdate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
              Publish Update to MongoDB
            </button>
          </div>
        </div>

        {/* Section 5: Media Metadata */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <ImageIcon className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold">5. Media Metadata (Array of Documents)</h2>
              <p className="text-xs text-slate-500">Store photo URLs and captions in MongoDB without burdening relational tables.</p>
            </div>
          </div>

          {/* Existing Media Items */}
          {mediaList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaList.map((m, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img
                    src={m.url}
                    alt={m.caption || 'Media'}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{m.caption || 'Campaign Photo'}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{m.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Media Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-6">
              <input
                type="url"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={newMediaCaption}
                onChange={(e) => setNewMediaCaption(e.target.value)}
                placeholder="Caption (e.g. Groundbreaking Ceremony)"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddMedia}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Image
              </button>
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <Link
            to="/creator/campaigns"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Done / Close
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Persisting to MongoDB...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All to MongoDB
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
