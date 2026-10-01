import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { Users, Loader2, AlertCircle, Shield, Heart, Sparkles, RefreshCw } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 mb-1">
            <Users className="w-3.5 h-3.5" />
            User Access Management
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registered Platform Users</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Complete MySQL registry of authenticated users, role assignments, and platform activity.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Full Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Assigned Role</th>
                  <th className="py-4 px-6">Campaigns Created</th>
                  <th className="py-4 px-6">Donations Made</th>
                  <th className="py-4 px-6">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">
                      USR-00{u.id}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-600">
                      {u.email}
                    </td>
                    <td className="py-4 px-6">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <Shield className="w-3 h-3" />
                          ADMIN
                        </span>
                      ) : u.role === 'CREATOR' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                          <Sparkles className="w-3 h-3" />
                          CREATOR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <Heart className="w-3 h-3" />
                          DONOR
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {u.campaigns_created ?? 0}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {u.donations_made ?? 0}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
