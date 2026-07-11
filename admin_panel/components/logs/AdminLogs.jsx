import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaSearch, FaHistory, FaCheckCircle, FaExclamationTriangle, FaServer } from 'react-icons/fa';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logType, setLogType] = useState('');
  const [search, setSearch] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    ApiService.getLogs({ type: logType, search })
      .then(res => {
        const data = res.data || res;
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [logType, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-200">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display">Security & System Logs</h2>
          <p className="text-xs text-gray-400 mt-1">Audit administrative operations, monitor security alerts, and track API exceptions.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-3.5 py-1.5 text-xs font-semibold bg-gray-700 hover:bg-gray-600 border border-light-border dark:border-dark-border rounded-lg"
        >
          Refresh Logs
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm text-xs font-semibold">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search log messages or emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-200"
          />
        </div>

        <div className="md:w-60">
          <select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-300 font-semibold"
          >
            <option value="">All Log Levels</option>
            <option value="Authentication">Authentication</option>
            <option value="API">API Gateway</option>
            <option value="Error">Exceptions / Errors</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm font-mono text-xs">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Auditing active logs...</div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Timestamp</th>
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Actor / User</th>
                  <th className="pb-3 px-2">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border text-[11px] leading-relaxed">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-light-hover/10 dark:hover:bg-dark-hover/10">
                    <td className="py-2.5 px-2 text-gray-400 whitespace-nowrap">{l.timestamp}</td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.2 rounded font-bold uppercase text-[9px] ${
                        l.type === 'Error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        l.type === 'Authentication' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {l.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-gray-300 whitespace-nowrap">{l.user}</td>
                    <td className="py-2.5 px-2 text-gray-300 max-w-lg truncate" title={l.message}>{l.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No matching logs recorded.</div>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
