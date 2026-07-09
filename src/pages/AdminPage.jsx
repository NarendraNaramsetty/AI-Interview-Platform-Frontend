import React, { useEffect, useState } from 'react';
import { Users, BarChart3, Database, ShieldAlert, Edit, Trash, Check, X, ToggleLeft, ToggleRight, Search, Activity } from 'lucide-react';
import { dashboard } from '../services/dashboard';
import { users } from '../services/users';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editTierVal, setEditTierVal] = useState('');
  const [maintMode, setMaintMode] = useState(false);
  
  const [systemLogs, setSystemLogs] = useState([]);

  useEffect(() => {
    users.leaderboard().then((data) => {
      const items = Array.isArray(data) ? data : data?.results || data?.data || [];
      const mapped = items.map(u => ({
        id: u.id,
        name: [u.user?.first_name, u.user?.last_name].filter(Boolean).join(' ') || 'User',
        email: u.user?.email || '',
        tier: u.user?.role || 'Free Tier',
        status: u.user?.is_active !== false ? 'Active' : 'Suspended',
        joined: u.created_at ? String(u.created_at).split('T')[0] : '2026-07-01'
      }));
      setUsers(mapped);
    }).catch(() => setUsers([]));
    dashboard.activity().then((data) => {
      setSystemLogs(Array.isArray(data) ? data : data?.results || data?.data || []);
    }).catch(() => setSystemLogs([]));
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditTierVal(user.tier);
  };

  const handleSaveEdit = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, tier: editTierVal } : u));
    setEditingUserId(null);
  };

  const toggleStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshLogs = () => {
    dashboard.activity().then((data) => {
      setSystemLogs(Array.isArray(data) ? data : data?.results || data?.data || []);
    }).catch(() => setSystemLogs([]));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Section metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Total Accounts</p>
            <p className="text-2xl font-bold font-display mt-0.5">14,823</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Monthly Revenue</p>
            <p className="text-2xl font-bold font-display mt-0.5">Live</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Simulations Run</p>
            <p className="text-2xl font-bold font-display mt-0.5">120,490</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">API Server Latency</p>
            <p className="text-2xl font-bold font-display mt-0.5 text-emerald-500">48ms</p>
          </div>
        </div>

      </div>

      {/* Main Splits: Users Table & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Management (2/3 width) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light-border dark:border-dark-border pb-4">
            <div>
              <h3 className="font-display font-bold text-lg">User Accounts Manager</h3>
              <p className="text-xs text-gray-400 mt-1">Audit tiers, access logs, or suspend users.</p>
            </div>
            
            {/* Search Input */}
            <div className="relative flex items-center w-full sm:w-60">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search user name/email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Tier</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Joined Date</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-light-hover/30 dark:hover:bg-dark-hover/20">
                    <td className="py-3.5 px-2 font-medium">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-2 font-semibold">
                      {editingUserId === u.id ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={editTierVal}
                            onChange={(e) => setEditTierVal(e.target.value)}
                            className="bg-light-hover dark:bg-dark-bg border border-light-border dark:border-dark-border text-xs px-2 py-1 rounded focus:outline-none"
                          >
                            <option value="Free Tier">Free Tier</option>
                            <option value="Pro Member">Pro Member</option>
                            <option value="Enterprise Team">Enterprise Team</option>
                          </select>
                          <button onClick={() => handleSaveEdit(u.id)} className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded">
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${
                          u.tier === 'Enterprise Team' ? 'bg-violet-500/10 text-violet-500 border-violet-500/20' :
                          u.tier === 'Pro Member' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {u.tier}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-gray-400">{u.joined}</td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors"
                          title="Modify Tier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors"
                          title="Suspend/Restore Account"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Console logs & operations (1/3 width) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Operations settings */}
          <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-indigo-500" />
              Critical Gateways
            </h3>
            
            <div className="flex items-center justify-between p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/20 dark:bg-dark-hover/10">
              <div>
                <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-200">Maintenance Mode</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Toggle maintenance overlay screen.</p>
              </div>
              <button onClick={() => setMaintMode(!maintMode)} className="text-gray-400 hover:text-indigo-500 transition-colors">
                {maintMode ? <ToggleRight className="h-7 w-7 text-indigo-500" /> : <ToggleLeft className="h-7 w-7" />}
              </button>
            </div>
          </div>

          {/* System logs box */}
          <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-light-border dark:border-dark-border pb-2.5">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                Live Log Auditing
              </h3>
              <button
                onClick={refreshLogs}
                className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-3 font-mono text-[10px] overflow-y-auto leading-relaxed">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-gray-400 shrink-0">{log.time}</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded text-[8px] uppercase shrink-0 ${
                    log.type === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    log.type === 'WARN' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                    'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
