import React, { useState } from 'react';
import ApiService from '../../service/Apiservice';
import { FaDatabase, FaDownload, FaSyncAlt } from 'react-icons/fa';

const AdminDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [outputMessage, setOutputMessage] = useState('');

  const handleAction = async (action) => {
    setLoading(true);
    setOutputMessage('');
    try {
      const res = await ApiService.runDatabaseAction({ action });
      const data = res.data || res;
      setOutputMessage(data.message || "Operation completed successfully.");
    } catch (err) {
      setOutputMessage("Operation failed: Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-800 dark:text-gray-200">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display">Database & Backups</h2>
        <p className="text-xs text-gray-400 mt-1">Audit table space sizes, trigger SQL database backups, and restore snapshots.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Actions panel */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm text-xs font-semibold">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <FaDatabase /> Administrative actions
          </h3>

          <p className="text-gray-400 leading-relaxed">
            Database backup compiles all dynamic schema states (user tables, interviews, payment transactions, system configurations) into a standalone SQL format.
          </p>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleAction('backup')}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <FaDownload /> Compile Backup
            </button>
            <button
              onClick={() => {
                if(window.confirm("Triggering restore will overwrite current table records. Proceed?")) {
                  handleAction('restore');
                }
              }}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-650 text-white font-bold rounded-lg border border-light-border dark:border-dark-border flex items-center justify-center gap-1.5"
            >
              <FaSyncAlt /> Restore Last
            </button>
          </div>
        </div>

        {/* Console logs */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm text-xs font-semibold flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Database console response</h3>
            <div className="mt-4 p-4 min-h-[120px] rounded-lg bg-light-hover/10 dark:bg-dark-bg border border-light-border dark:border-dark-border font-mono text-[10px] text-emerald-400 leading-relaxed whitespace-pre-wrap">
              {loading ? "Establishing database link & compiling..." : outputMessage || "Awaiting database trigger instruction..."}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDatabase;
