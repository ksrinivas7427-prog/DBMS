export type UserRole = 'DONOR' | 'CREATOR' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
  campaigns_created?: number;
  donations_made?: number;
}

export interface Campaign {
  id: number;
  creator_id?: number;
  creator_name?: string;
  creator_email?: string;
  title: string;
  description: string;
  category: string;
  target_amount: number;
  raised_amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  image_url?: string;
  created_at: string;
  updated_at?: string;
  progress_percentage: number;
  total_donations?: number;
}

export interface Donation {
  id: number;
  donor_id?: number;
  campaign_id: number;
  campaign_title?: string;
  campaign_category?: string;
  campaign_image?: string;
  amount: number;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  donated_at: string;
}

export interface AdminReview {
  id: number;
  campaign_id: number;
  admin_id: number;
  admin_name?: string;
  decision: 'APPROVED' | 'REJECTED';
  remarks?: string;
  reviewed_at: string;
}

export interface AdminStats {
  total_users: number;
  total_campaigns: number;
  pending_campaigns: number;
  approved_campaigns: number;
  total_donations: number;
  total_funds_raised: number;
}

// -----------------------------------------------------------------------------
// MongoDB Secondary Document Interfaces (campaign_contents collection)
// -----------------------------------------------------------------------------

export interface CauseDetails {
  problem?: string;
  beneficiaries?: number;
  location?: string;
  project_duration?: string;
  [key: string]: any;
}

export interface BeneficiaryDetails {
  name?: string;
  location?: string;
  number_of_beneficiaries?: number;
  description?: string;   // used in ManageCampaignContent
  condition?: string;     // alias used in CampaignDetail view
  age?: number;
  [key: string]: any;
}

export interface CampaignUpdate {
  title: string;
  content: string;
  created_at: string;   // stored by ManageCampaignContent
  date?: string;        // alias used by some older backend responses
}

export interface CampaignMedia {
  type: string;
  url: string;
  caption?: string;
}

export interface CampaignContent {
  id?: string;
  campaign_id: number;
  story?: string;           // optional — document may not have story yet
  cause_details?: CauseDetails;
  beneficiary_details?: BeneficiaryDetails;
  updates?: CampaignUpdate[];
  media?: CampaignMedia[];
  created_at?: string;
  updated_at?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  database?: 'connected' | 'disconnected';
  mysql: 'connected' | 'disconnected';
  mongodb: 'connected' | 'disconnected';
  mysql_message?: string;
  mongodb_message?: string;
}

