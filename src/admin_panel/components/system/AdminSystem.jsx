import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaServer, FaHdd, FaMicrochip, FaMemory, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const AdminSystem = () => {
  const [system, setSystem] = useState(null);
  const [cronJobs, setCronJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSystem = () => {
    setLoading(true);
    ApiService.getSystemStatus()
      .then(res => {
        const data = res.data || res;
        setSystem(data.system || {});
        setCronJobs(data.cron_jobs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSystem();
  }, []);

  if (loading || !system) {
    return <div className="text-center py-12 text-xs text-gray-400">Loading diagnostics logs...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-800 dark:text-gray-200">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display">Server Health & System Diagnostics</h2>
          <p className="text-xs text-gray-400 mt-1">Monitor background processors, active timers, RAM usage, and server availability indices.</p>
        </div>
        <button
          onClick={fetchSystem}
          className="px-3.5 py-1.5 text-xs font-semibold bg-gray-700 hover:bg-gray-600 border border-light-border dark:border-dark-border rounded-lg"
        >
          Re-evaluate
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FaMicrochip className="text-lg" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">CPU Core Load</div>
            <div className="text-md font-bold font-display mt-0.5">{system.cpu}</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FaMemory className="text-lg" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">RAM Allocation</div>
            <div className="text-md font-bold font-display mt-0.5">{system.ram}</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FaHdd className="text-lg" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Disk capacity</div>
            <div className="text-md font-bold font-display mt-0.5">{system.disk}</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <FaCheckCircle className="text-lg" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Uptime Index</div>
            <div className="text-md font-bold font-display mt-0.5">{system.uptime}</div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
        {/* API Latency check */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm md:col-span-1">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <FaServer /> Status indexes
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-light-border/40 dark:border-dark-border/40">
              <span className="text-gray-400">Database health:</span>
              <span className="font-bold text-emerald-400">{system.database_health}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-light-border/40 dark:border-dark-border/40">
              <span className="text-gray-400">Redis cache relay:</span>
              <span className="font-bold text-emerald-400">{system.cache_health}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">API Latency response:</span>
              <span className="font-bold text-emerald-400">42ms</span>
            </div>
          </div>
        </div>

        {/* Cron jobs */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm md:col-span-2">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <FaCalendarAlt /> Active scheduled tasks (Crons)
          </h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {cronJobs.map((c, i) => (
              <div key={i} className="p-3 rounded bg-light-hover/10 dark:bg-dark-bg border border-light-border dark:border-dark-border flex justify-between items-center">
                <div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Frequency trigger: {c.schedule}</div>
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-500/10 text-emerald-400">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;
