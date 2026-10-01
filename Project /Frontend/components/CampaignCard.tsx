import React from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../types';
import { User, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = Math.min(100, Math.round((campaign.raised_amount / campaign.target_amount) * 100));

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
      {/* Image & Category Badge */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80'}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 backdrop-blur shadow-sm border border-slate-200">
            {campaign.category}
          </span>
        </div>
        {campaign.status === 'APPROVED' && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Creator Attribution */}
          {campaign.creator_name && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
              <User className="w-3.5 h-3.5" />
              <span>By {campaign.creator_name}</span>
            </div>
          )}

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {campaign.title}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {campaign.description}
          </p>
        </div>

        {/* Progress & Stats */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-primary font-bold">{progress}% Funded</span>
              <span className="text-slate-500">₹{campaign.target_amount.toLocaleString()} Goal</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs text-slate-400 font-medium">Raised so far</p>
              <p className="text-base font-bold text-slate-900">₹{campaign.raised_amount.toLocaleString()}</p>
            </div>

            <Link
              to={`/campaigns/${campaign.id}`}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-slate-900 transition-colors shadow-sm"
            >
              Support
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
