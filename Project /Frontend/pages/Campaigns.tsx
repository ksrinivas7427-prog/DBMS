import React, { useEffect, useState } from 'react';
import { Campaign } from '../types';
import { api } from '../services/api';
import { CampaignCard } from '../components/CampaignCard';
import { Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Healthcare', 'Education', 'Disaster Relief', 'Community'];

export const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.campaigns.getPublic({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
      });
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCampaigns();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Approved Social Causes</h1>
        <p className="text-base text-slate-600">
          Browse verified campaigns audited and approved by administrators. All donations go directly to real beneficiaries.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:block shrink-0" />
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search causes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Campaign Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-base">Error Loading Campaigns</h4>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs text-rose-600 mt-2">Check whether MySQL is connected and backend server is active.</p>
            </div>
          </div>
          <button
            onClick={fetchCampaigns}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 text-2xl font-bold">
            ?
          </div>
          <h3 className="text-lg font-bold text-slate-900">No approved campaigns available.</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No causes matched "${searchQuery}" in category "${selectedCategory}". Try another search term.`
              : 'There are currently no approved campaigns in this category.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};
