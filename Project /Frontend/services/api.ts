import axios from 'axios';
import { User, Campaign, Donation, AdminStats, CampaignContent, HealthCheckResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Automatically injects JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Formats human-readable errors and handles 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on authentication failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to server. Please check whether the backend is running.';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  // Dual Database Health
  checkHealth: async () => {
    const res = await apiClient.get<HealthCheckResponse>('/health');
    return res.data;
  },

  // Auth (MySQL)
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const res = await apiClient.post<{ success: boolean; access_token: string; user: User }>('/auth/login', credentials);
      return res.data;
    },
    register: async (data: { name: string; email: string; password: string; role: string }) => {
      const res = await apiClient.post<{ success: boolean; access_token: string; user: User }>('/auth/register', data);
      return res.data;
    },
    me: async () => {
      const res = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
      return res.data.user;
    },
  },

  // Campaigns (MySQL + MongoDB)
  campaigns: {
    getPublic: async (params?: { category?: string; search?: string }) => {
      const res = await apiClient.get<{ success: boolean; campaigns: Campaign[]; count: number }>('/campaigns', { params });
      return res.data.campaigns;
    },
    getById: async (id: number) => {
      const res = await apiClient.get<{ success: boolean; campaign: Campaign }>(`/campaigns/${id}`);
      return res.data.campaign;
    },
    create: async (data: {
      title: string;
      description: string;
      category: string;
      target_amount: number;
      image_url?: string;
    }) => {
      const res = await apiClient.post<{ success: boolean; message: string; campaign: Campaign }>('/campaigns', data);
      return res.data;
    },
    getMy: async () => {
      const res = await apiClient.get<{ success: boolean; campaigns: Campaign[] }>('/campaigns/my');
      return res.data.campaigns;
    },

    // --- MongoDB Flexible Content Methods ---
    getContent: async (campaignId: number): Promise<CampaignContent | null> => {
      try {
        const res = await apiClient.get<{ success: boolean; content: CampaignContent | null }>(
          `/campaigns/${campaignId}/content`
        );
        return res.data.content || null;
      } catch (err) {
        console.warn(`[MongoDB] Content load failed for campaign ${campaignId}:`, err);
        return null;
      }
    },
    saveContent: async (campaignId: number, data: Partial<CampaignContent>) => {
      const res = await apiClient.put<{ success: boolean; message: string; content: CampaignContent }>(
        `/campaigns/${campaignId}/content`,
        data
      );
      return res.data;
    },
    createContent: async (campaignId: number, data: Partial<CampaignContent>) => {
      const res = await apiClient.post<{ success: boolean; message: string; content: CampaignContent }>(
        `/campaigns/${campaignId}/content`,
        data
      );
      return res.data;
    },
    deleteContent: async (campaignId: number) => {
      const res = await apiClient.delete<{ success: boolean; message: string }>(
        `/campaigns/${campaignId}/content`
      );
      return res.data;
    },
    addUpdate: async (campaignId: number, update: { title: string; content: string }) => {
      const res = await apiClient.post<{ success: boolean; message: string; update: any; content: CampaignContent }>(
        `/campaigns/${campaignId}/updates`,
        update
      );
      return res.data;
    },
  },


  // Donations
  donations: {
    donate: async (campaignId: number, amount: number) => {
      const res = await apiClient.post<{
        success: boolean;
        message: string;
        donation: Donation;
        updated_campaign: Campaign;
      }>(`/campaigns/${campaignId}/donate`, { amount });
      return res.data;
    },
    getMy: async () => {
      const res = await apiClient.get<{
        success: boolean;
        donations: Donation[];
        stats: { total_donated: number; causes_supported: number; total_donations_count: number };
      }>('/donations/my');
      return res.data;
    },
  },

  // Admin
  admin: {
    getCampaigns: async (status?: string) => {
      const res = await apiClient.get<{ success: boolean; campaigns: Campaign[] }>('/admin/campaigns', {
        params: { status },
      });
      return res.data.campaigns;
    },
    getCampaignById: async (id: number) => {
      const res = await apiClient.get<{ success: boolean; campaign: Campaign; reviews: any[] }>(`/admin/campaigns/${id}`);
      return res.data;
    },
    approveCampaign: async (id: number, remarks?: string) => {
      const res = await apiClient.put<{ success: boolean; message: string }>(`/admin/campaigns/${id}/approve`, { remarks });
      return res.data;
    },
    rejectCampaign: async (id: number, remarks: string) => {
      const res = await apiClient.put<{ success: boolean; message: string }>(`/admin/campaigns/${id}/reject`, { remarks });
      return res.data;
    },
    getUsers: async () => {
      const res = await apiClient.get<{ success: boolean; users: User[] }>('/admin/users');
      return res.data.users;
    },
    getStats: async () => {
      const res = await apiClient.get<{ success: boolean; stats: AdminStats }>('/admin/stats');
      return res.data.stats;
    },
  },
};
