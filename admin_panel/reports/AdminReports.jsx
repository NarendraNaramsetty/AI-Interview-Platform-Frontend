import React, { useState } from 'react';
import { FaFileCsv, FaPrint, FaChartBar, FaCalendarCheck } from 'react-icons/fa';
import { getApiUrl } from '../../src/utils/envConfig';

const AdminReports = () => {
  const [reportType, setReportType] = useState('daily');

  const handleExport = (type) => {
    // Triggers download from backend endpoints
    const baseUrl = getApiUrl();
    const token = localStorage.getItem('admin_access_token');
    
    // Create an anchor element to download the file directly with authorization or standard direct download
    let endpoint = '';
    if (type === 'users') {
      endpoint = '/api/admin/exports/users/';
    } else {
      endpoint = '/api/admin/exports/interviews/';
    }
    
    // Since direct window.open won't send headers, we trigger direct download using fetch
    fetch(`${baseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to download CSV.");
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => {
        alert(err.message);
      });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-200">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display">System Reports & CSV Exporters</h2>
        <p className="text-xs text-gray-400 mt-1">Compile candidate portfolios, extract mock history listings, and save offline spreadsheet files.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        
        {/* Export options */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm h-fit">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <FaFileCsv /> Offline spreadsheet exports (CSV)
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Download raw database table rosters mapped cleanly as CSV attachments. These exports map directly to spreadsheet apps like Excel or Google Sheets.
          </p>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleExport('users')}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <FaFileCsv /> Export Candidates
            </button>
            <button
              onClick={() => handleExport('interviews')}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <FaFileCsv /> Export Interviews
            </button>
          </div>
        </div>

        {/* Printable summary reports */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-light-border/40 dark:border-dark-border/40">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <FaChartBar /> Print summary reports
            </h3>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-650 text-white font-bold rounded-lg flex items-center gap-1.5 text-[10px] border border-light-border dark:border-dark-border"
            >
              <FaPrint /> Print summary
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['daily', 'weekly', 'monthly', 'yearly'].map(t => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`py-1.5 rounded uppercase font-bold text-[9px] border border-light-border dark:border-dark-border ${
                  reportType === t ? 'bg-indigo-600 text-white border-transparent' : 'text-gray-400 hover:bg-light-hover/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-4 rounded bg-light-hover/10 dark:bg-dark-bg border border-light-border dark:border-dark-border space-y-3 leading-relaxed text-[11px]">
            <div className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <FaCalendarCheck /> {reportType} report compilation
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400">Total Users registered:</span>
                <span className="font-bold text-gray-200 float-right">15 users</span>
              </div>
              <div>
                <span className="text-gray-400">Mock sessions run:</span>
                <span className="font-bold text-gray-200 float-right">120 runs</span>
              </div>
              <div>
                <span className="text-gray-400">Evaluations scored:</span>
                <span className="font-bold text-gray-200 float-right">98 tests</span>
              </div>
              <div>
                <span className="text-gray-400">Total revenue generated:</span>
                <span className="font-bold text-emerald-400 float-right">$4,850.00</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
