import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { PlusCircle, ArrowLeft, AlertCircle, Loader2, Info, Sparkles } from 'lucide-react';

const CATEGORIES = ['Healthcare', 'Education', 'Disaster Relief', 'Community', 'Animal Welfare', 'Environment'];

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Healthcare');
  const [targetAmount, setTargetAmount] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !targetAmount || !description.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    const numAmount = parseFloat(targetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Target amount must be a valid number greater than zero.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.campaigns.create({
        title: title.trim(),
        category,
        target_amount: numAmount,
        image_url: imageUrl.trim() || undefined,
        description: description.trim(),
      });
      // Redirect to creator campaigns list
      navigate('/creator/campaigns');
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        to="/creator/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Creator Dashboard
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Verified Cause Submission
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Start a New Campaign</h1>
        <p className="text-sm text-slate-600">
          Fill in the details below to submit a social cause. Your campaign will be saved to MySQL with <strong className="text-amber-700">PENDING</strong> status and reviewed by an administrator before going live.
        </p>
      </div>

      {/* Audit Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-amber-950">Administrative Verification Process</p>
          <p className="mt-0.5">
            Under CrowdConnect rules, creators cannot immediately make campaigns APPROVED. Once submitted, our administrators will inspect the cause details and approve it before it appears in public searches or receives donations.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Submission Error</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solar Drinking Water Plant for Kanchipuram School"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Cause Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Funding Target Amount (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="50000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to use a high-resolution default cover photo.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Campaign Story & Beneficiary Details *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Describe why this funding is needed, who will directly benefit, timeline of implementation, and cost breakdowns..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Link
              to="/creator/dashboard"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-slate-900 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving to MySQL...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Submit for Admin Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
