import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ApiService from '../../../service/Apiservice.jsx';
import { FaSearch, FaUserAlt, FaCheck, FaTimes, FaTrashAlt, FaEye, FaLock, FaKey, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const tier = searchParams.get('tier') || '';
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [activeTab, setActiveTab] = useState('history');

  const fetchUsers = () => {
    setLoading(true);
    ApiService.getUsers({
      search,
      tier,
      status: statusFilter,
      page,
      page_size: pageSize
    })
      .then(res => {
        const data = res.data || res;
        setUsers(data.results || []);
        setTotalCount(data.total_count || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [search, tier, statusFilter, page]);

  const handleAction = async (id, action, additionalData = {}) => {
    if (action === 'delete') {
      if (!window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;
      try {
        await ApiService.deleteUser(id);
        fetchUsers();
        if (selectedUser && selectedUser.id === id) setSelectedUser(null);
      } catch (err) {
        alert("Failed to delete user.");
      }
      return;
    }

    try {
      await ApiService.updateUser(id, { action, ...additionalData });
      fetchUsers();
      if (selectedUser && selectedUser.id === id) {
        // reload details
        handleViewDetail(selectedUser);
      }
    } catch (err) {
      alert(`Failed to perform action: ${action}`);
    }
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setDetailLoading(true);
    setDetailData(null);
    setShowPasswordReset(false);
    setActiveTab('history');
    
    ApiService.getUserDetail(user.id)
      .then(res => {
        setDetailData(res.data || res);
        setDetailLoading(false);
      })
      .catch(err => {
        console.error(err);
        setDetailLoading(false);
      });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display">User Accounts Directory</h2>
        <p className="text-xs text-gray-400 mt-1">Manage client profiles, subscription tiers, mock logs, and login rights.</p>
      </div>

      {/* Filter Roster */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-sm">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500 text-xs" />
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 md:w-80">
          <select
            value={tier}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newParams.set('tier', e.target.value);
              } else {
                newParams.delete('tier');
              }
              newParams.set('page', '1');
              setSearchParams(newParams);
              setPage(1);
            }}
            className="px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none text-slate-700 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="">All Tiers</option>
            <option value="Free Tier">Free Tier</option>
            <option value="Pro Member">Pro Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newParams.set('status', e.target.value);
              } else {
                newParams.delete('status');
              }
              newParams.set('page', '1');
              setSearchParams(newParams);
              setPage(1);
            }}
            className="px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none text-slate-700 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Querying directory...</div>
        ) : users.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-2">User details</th>
                    <th className="pb-3 px-2">Tier Level</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Joined</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-light-hover/10 dark:hover:bg-dark-hover/10">
                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{u.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          u.tier === 'Pro Member' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {u.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                          u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-400 text-xs">{u.joined}</td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleViewDetail(u)}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-indigo-400 transition-colors"
                            title="View Profile Stats"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleAction(u.id, u.status === 'Active' ? 'block' : 'unblock')}
                            className={`p-2 rounded-lg border text-xs transition-colors ${
                              u.status === 'Active'
                                ? 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15'
                                : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/15'
                            }`}
                            title={u.status === 'Active' ? 'Block User' : 'Unblock User'}
                          >
                            {u.status === 'Active' ? <FaTimes /> : <FaCheck />}
                          </button>
                          <button
                            onClick={() => handleAction(u.id, 'delete')}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-rose-400 transition-colors"
                            title="Delete user"
                          >
                            <FaTrashAlt />
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
              <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-4 text-xs font-semibold text-gray-400">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs">No user accounts found matching query.</div>
        )}
      </div>

      {/* User details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-2xl p-6 relative flex flex-col max-h-[90vh] text-gray-800 dark:text-gray-200">
            
            {/* Close */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-light-border dark:border-dark-border">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg font-display shrink-0">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-md font-bold font-display">{selectedUser.name}</h3>
                <p className="text-xs text-gray-400">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold border border-indigo-500/20 bg-indigo-500/5 text-indigo-400">
                    {selectedUser.tier}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                    selectedUser.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-light-border dark:border-dark-border my-4 shrink-0 gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'history' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400'
                }`}
              >
                Simulation History
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'billing' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400'
                }`}
              >
                Billing Profile
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {detailLoading ? (
                <div className="text-center py-8 text-gray-400">Fetching profile logs...</div>
              ) : detailData ? (
                activeTab === 'history' ? (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-400 tracking-wider">Interview Runs ({detailData.stats?.total_interviews || 0})</h4>
                    {detailData.interview_history && detailData.interview_history.length > 0 ? (
                      <div className="space-y-2">
                        {detailData.interview_history.map((h) => (
                          <div key={h.id} className="p-3 rounded-lg bg-light-hover/20 dark:bg-dark-hover/30 border border-light-border dark:border-dark-border flex justify-between items-center">
                            <div>
                              <div className="font-bold">{h.title}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">Role: {h.role} | {h.date}</div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-indigo-400">{h.score} pts</span>
                              <div className="text-[9px] text-gray-400 mt-1 uppercase">{h.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed border-light-border dark:border-dark-border text-center text-gray-400 rounded-lg">
                        No mock sessions conducted yet.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-400 tracking-wider">Billing History</h4>
                    <div className="p-4 rounded-lg bg-light-hover/20 dark:bg-dark-hover/30 border border-light-border dark:border-dark-border space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account status:</span>
                        <span className="font-bold text-indigo-400">{detailData.user?.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Billing tier:</span>
                        <span className="font-bold">{detailData.user?.tier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registered date:</span>
                        <span>{detailData.user?.joined}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone number:</span>
                        <span>{detailData.user?.phone_number || "—"}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="font-bold text-gray-400 tracking-wider">Transactions</h4>
                      {detailData.payment_history && detailData.payment_history.length > 0 ? (
                        <div className="space-y-2">
                          {detailData.payment_history.map(p => (
                            <div key={p.id} className="flex justify-between p-2.5 rounded bg-light-hover/10 dark:bg-dark-bg border border-light-border dark:border-dark-border">
                              <div>
                                <span className="font-bold text-indigo-400">${p.amount}</span>
                                <span className="text-[9px] text-gray-400 ml-2">ID: {p.id}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-400 mr-3">{p.date}</span>
                                <span className="text-[9px] uppercase font-bold text-emerald-400">{p.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 text-center text-gray-400 border border-dashed border-light-border dark:border-dark-border rounded">
                          No transactions found.
                        </div>
                      )}
                    </div>

                    {/* Operational Commands */}
                    <div className="pt-4 border-t border-light-border dark:border-dark-border flex flex-wrap justify-between items-center gap-2">
                      <div className="flex gap-2">
                        {detailData.user?.tier === 'Pro Member' ? (
                          <button
                            onClick={() => handleAction(selectedUser.id, 'remove_premium')}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          >
                            Remove Premium
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(selectedUser.id, 'assign_premium')}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                          >
                            Assign Premium
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(selectedUser.id, selectedUser.status === 'Active' ? 'block' : 'unblock')}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-light-hover dark:bg-dark-bg border border-light-border dark:border-dark-border hover:bg-light-hover/20 transition-colors"
                        >
                          {selectedUser.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                        </button>
                      </div>

                      <div>
                        <button
                          onClick={() => setShowPasswordReset(!showPasswordReset)}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                        >
                          <FaKey />
                          Reset Password
                        </button>
                      </div>
                    </div>

                    {showPasswordReset && (
                      <div className="p-3 border border-light-border dark:border-dark-border rounded-lg space-y-2 bg-light-hover/10 dark:bg-dark-bg">
                        <label className="block text-[10px] text-gray-400 font-bold uppercase">New password string</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter secure password..."
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-card focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!newPassword) return;
                              handleAction(selectedUser.id, 'reset_password', { password: newPassword });
                              setNewPassword('');
                              setShowPasswordReset(false);
                              alert("Password reset request sent!");
                            }}
                            className="px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-400">Failed to load user logs.</div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
