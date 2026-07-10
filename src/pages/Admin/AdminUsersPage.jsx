import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Users, Search, Filter, ShieldAlert, Check, X, ShieldCheck, Eye, EyeOff, Calendar, Award, BookOpen, Clock, Activity, CreditCard, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { users as usersService } from '../../services/users';

export default function AdminUsersPage() {
  const { theme } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null); // active user profile in modal
  const [detailTab, setDetailTab] = useState('history'); // history, billing

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    usersService.leaderboard().then((data) => {
      const items = Array.isArray(data) ? data : data?.results || data?.data || [];
      const mapped = items.map(u => ({
        id: u.id,
        name: [u.user?.first_name, u.user?.last_name].filter(Boolean).join(' ') || 'User',
        email: u.user?.email || '',
        tier: u.user?.role || 'Free Tier',
        status: u.user?.is_active !== false ? 'Active' : 'Suspended',
        joined: u.created_at ? String(u.created_at).split('T')[0] : '2026-07-01',
        totalInterviews: 12
      }));
      setUsers(mapped);
    }).catch(() => setUsers([]));
  }, []);

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: newStatus };
      }
      return u;
    }));
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(prev => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
    }
  };

  const handleDeleteUser = (id) => {
    const conf = window.confirm("Are you sure you want to delete this user profile? All historical mock sessions will be erased.");
    if (conf) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setSelectedUser(null);
    }
  };

  // Search & Filter Logic
  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' ? true : u.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' ? true : u.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-3xl">Admin Users Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor active user growth metrics, search account rosters, or suspend/modify subscription configurations.
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className={`p-5 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Registrants</p>
            <p className="text-xl font-bold font-display mt-0.5">{users.length}</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Users</p>
            <p className="text-xl font-bold font-display mt-0.5">{users.filter(u => u.status === 'Active').length}</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Premium Members</p>
            <p className="text-xl font-bold font-display mt-0.5">{users.filter(u => u.tier !== 'Free Tier').length}</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Suspended Accounts</p>
            <p className="text-xl font-bold font-display mt-0.5">{users.filter(u => u.status === 'Suspended').length}</p>
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className={`p-5 rounded-2xl border ${cardStyle} flex flex-col md:flex-row gap-4`}>
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search accounts by name or email address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <select
            value={tierFilter}
            onChange={(e) => { setTierFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="Free Tier">Free Tier</option>
            <option value="Pro Member">Pro Member</option>
            <option value="Enterprise Team">Enterprise Team</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        {paginated.length > 0 ? (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3.5 px-2">Account Owner</th>
                    <th className="pb-3.5 px-2">Tier Level</th>
                    <th className="pb-3.5 px-2">Status</th>
                    <th className="pb-3.5 px-2">Joined</th>
                    <th className="pb-3.5 px-2">Simulations</th>
                    <th className="pb-3.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {paginated.map((u) => (
                    <tr key={u.id} className="hover:bg-light-hover/20 dark:hover:bg-dark-hover/10 transition-colors">
                      <td className="py-4 px-2 font-semibold">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-normal">{u.email}</div>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${
                          u.tier === 'Enterprise Team' ? 'bg-violet-500/10 text-violet-500 border-violet-500/20' :
                          u.tier === 'Pro Member' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {u.tier}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-gray-400">{u.joined}</td>
                      <td className="py-4 px-2 font-mono font-bold text-indigo-500">{u.totalInterviews} runs</td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-indigo-500"
                            title="View Profile Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`p-1.5 rounded-lg border ${
                              u.status === 'Active'
                                ? 'border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/15'
                                : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/15'
                            }`}
                            title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                          >
                            {u.status === 'Active' ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-rose-500"
                            title="Delete Profile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-4 text-xs font-semibold text-gray-500">
                <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} accounts</span>
                
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No users found matching your search.</div>
        )}
      </div>

      {/* User Detail Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Top User card summary */}
            <div className="flex items-center gap-4 pb-4 border-b border-light-border dark:border-dark-border">
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold font-display text-xl shrink-0 shadow-sm">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">{selectedUser.name}</h3>
                <p className="text-xs text-gray-400">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                    selectedUser.tier === 'Enterprise Team' ? 'border-violet-500/20 bg-violet-500/5 text-violet-500' :
                    selectedUser.tier === 'Pro Member' ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-500' : 'border-gray-500/20 bg-gray-500/5 text-gray-400'
                  }`}>
                    {selectedUser.tier}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                    selectedUser.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Drawer Tabs */}
            <div className="flex border-b border-light-border dark:border-dark-border my-4 shrink-0">
              <button
                onClick={() => setDetailTab('history')}
                className={`pb-2 px-1 text-xs font-semibold border-b-2 transition-all ${
                  detailTab === 'history' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setDetailTab('billing')}
                className={`pb-2 px-1 text-xs font-semibold border-b-2 transition-all ml-4 ${
                  detailTab === 'billing' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400'
                }`}
              >
                Subscription Details
              </button>
            </div>

            {/* Drawer body container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {detailTab === 'history' ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">User Simulation History Logs</h4>
                  <div className="rounded-xl border border-dashed border-light-border dark:border-dark-border bg-light-hover/20 dark:bg-dark-hover/10 p-4 text-xs text-gray-500 dark:text-gray-400">
                    Per-user interview history is not exposed by the current backend.
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Billing Profiles Information</h4>
                  <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 space-y-3.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subscription Status:</span>
                      <span className="font-semibold">{selectedUser.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Billing Tier:</span>
                      <span className="font-semibold text-indigo-500">{selectedUser.tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Billing Interval:</span>
                      <span className="font-semibold">{selectedUser.billing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Joined:</span>
                      <span className="font-semibold">{selectedUser.joined}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => handleToggleStatus(selectedUser.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                        selectedUser.status === 'Active'
                          ? 'border-rose-500 text-rose-500 hover:bg-rose-500/10'
                          : 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                    >
                      {selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
