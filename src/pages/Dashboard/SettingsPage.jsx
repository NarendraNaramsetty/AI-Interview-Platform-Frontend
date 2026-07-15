import React, { useState } from 'react';
import { Settings, Shield, Bell, CreditCard, Check, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { auth } from '../../services/auth';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');
  
  // Account Form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [isPwSaved, setIsPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  // Preference Settings state
  const [prefLang, setPrefLang] = useState('javascript');
  const [fontSize, setFontSize] = useState('14px');
  const [emailDigest, setEmailDigest] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(false);
  const [linting, setLinting] = useState(true);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPwError('');
    setIsPwSaved(false);

    if (newPw !== confirmPw) {
      setPwError('New passwords do not match!');
      return;
    }

    auth.changePassword({ old_password: currentPw, new_password: newPw, password_confirm: confirmPw })
      .then(() => {
        setIsPwSaved(true);
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        window.setTimeout(() => setIsPwSaved(false), 3000);
      })
      .catch((error) => {
        setPwError(error.message || 'Unable to update password.');
      });
  };

  const invoiceHistory = [
    { date: '2026-06-10', id: 'INV-8201', amount: '$15.00', status: 'Paid' },
    { date: '2026-05-10', id: 'INV-7319', amount: '$15.00', status: 'Paid' },
    { date: '2026-04-10', id: 'INV-6548', amount: '$15.00', status: 'Paid' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-light-border dark:border-dark-border pb-4">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-500" />
          Settings Panel
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Adjust mock credentials, environment default preferences, or download past checkout receipts.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Side Tab Navigation */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {[
            { id: 'account', label: 'Security & Account', icon: Shield },
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'billing', label: 'Billing & Invoice', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all text-left ${
                  activeTab === tab.id
                    ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-500 font-bold'
                    : 'border-transparent text-gray-500 hover:bg-light-hover dark:hover:bg-dark-hover hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Content Panel */}
        <div className="md:col-span-3">
          <div className="p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm min-h-87.5">
            
            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base">Security & Password</h3>
                  <p className="text-xs text-gray-400 mt-1">Update your login credentials securely.</p>
                </div>

                {isPwSaved && (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2.5 animate-pulse-slow">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-medium">Password updated successfully! Your credentials are now active.</span>
                  </div>
                )}

                {pwError && (
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 flex items-center gap-2.5 font-medium text-xs">
                    <span>{pwError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all duration-200 shadow-md shadow-indigo-500/20"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Settings Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base">Sandbox IDE Preferences</h3>
                  <p className="text-xs text-gray-400 mt-1">Configure default code editor environments and options.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-light-border dark:border-dark-border pb-6 max-w-xl">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Default Sandbox Language</label>
                    <select
                      value={prefLang}
                      onChange={(e) => setPrefLang(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="javascript">JavaScript (ES6)</option>
                      <option value="python">Python 3</option>
                      <option value="cpp">C++ (GCC 11)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Editor Font Size</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="12px">12px (Compact)</option>
                      <option value="14px">14px (Standard)</option>
                      <option value="16px">16px (Large)</option>
                    </select>
                  </div>
                </div>

                {/* Checklist options */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-semibold text-sm">System Options</h4>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-xs text-gray-600 dark:text-gray-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailDigest}
                        onChange={(e) => setEmailDigest(e.target.checked)}
                        className="mt-0.5 rounded border-light-border dark:border-dark-border text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <div>
                        <span>Receive Weekly Career Insights</span>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-normal">Weekly summaries of trending interview tech stacks.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 text-xs text-gray-600 dark:text-gray-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sessionReminders}
                        onChange={(e) => setSessionReminders(e.target.checked)}
                        className="mt-0.5 rounded border-light-border dark:border-dark-border text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <div>
                        <span>Active Session Email Reminders</span>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-normal">Remind me if I have incomplete mock sessions today.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 text-xs text-gray-600 dark:text-gray-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={linting}
                        onChange={(e) => setLinting(e.target.checked)}
                        className="mt-0.5 rounded border-light-border dark:border-dark-border text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <div>
                        <span>Enable Automatic Editor Linting Checks</span>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-normal">Analyzes syntax parameters dynamically as you type.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Settings Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base">Billing & Invoice Ledger</h3>
                  <p className="text-xs text-gray-400 mt-1">Review active sub tier details or view receipt history.</p>
                </div>

                {/* Tier indicator */}
                <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-600/5 dark:bg-indigo-600/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-indigo-500 tracking-wider">Active Tier</span>
                    <h4 className="text-base font-bold mt-0.5">{user?.tier || 'Free Tier'}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {user?.tier === 'Free Tier' ? '3 complete interviews left.' : 'Enjoy unlimited sessions, voice mode transcription analytics, and roadmaps!'}
                    </p>
                  </div>
                  <Link
                    to="/pricing"
                    className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4.5 py-2 rounded-xl text-xs transition-colors"
                  >
                    Change Plan
                  </Link>
                </div>

                {/* Invoice Table */}
                <div className="pt-4 space-y-3">
                  <h4 className="font-semibold text-sm">Receipt Ledger</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-light-border dark:border-dark-border text-gray-500 uppercase font-semibold">
                          <th className="py-2.5 px-2">Invoice Code</th>
                          <th className="py-2.5 px-2">Date</th>
                          <th className="py-2.5 px-2">Amount</th>
                          <th className="py-2.5 px-2">Status</th>
                          <th className="py-2.5 px-2 text-right">Download</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-light-border dark:divide-dark-border">
                        {invoiceHistory.map((invoice, idx) => (
                          <tr key={idx} className="hover:bg-light-hover/30 dark:hover:bg-dark-hover/10">
                            <td className="py-3 px-2 font-mono font-medium">{invoice.id}</td>
                            <td className="py-3 px-2 text-gray-400">{invoice.date}</td>
                            <td className="py-3 px-2 font-semibold">{invoice.amount}</td>
                            <td className="py-3 px-2"><span className="text-emerald-500 font-semibold">{invoice.status}</span></td>
                            <td className="py-3 px-2 text-right">
                              <button
                                onClick={() => alert(`Downloading Invoice PDF: ${invoice.id}`)}
                                className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-indigo-500 transition-colors"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
