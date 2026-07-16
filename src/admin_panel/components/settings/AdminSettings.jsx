import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaSave, FaSlidersH, FaEnvelope, FaKey, FaShieldAlt, FaRobot } from 'react-icons/fa';

const AdminSettings = () => {
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  // General Settings States
  const [appName, setAppName] = useState('');
  const [maintenance, setMaintenance] = useState(false);

  // SMTP Settings States
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpEmail, setSmtpEmail] = useState('');

  // API Keys
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  // AI Configurations
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  // Security Configurations
  const [jwtExpiry, setJwtExpiry] = useState(15);

  const fetchSettings = () => {
    setLoading(true);
    ApiService.getSettings()
      .then(res => {
        const data = res.data || res;
        const s = data.settings || {};
        setSettingsData(s);
        
        // General
        setAppName(s.general?.app_name || 'PrepAI');
        setMaintenance(!!s.general?.maintenance_mode);

        // SMTP
        setSmtpHost(s.smtp?.host || '');
        setSmtpPort(s.smtp?.port || 587);
        setSmtpEmail(s.smtp?.email || '');

        // API
        setOpenaiKey(s.apikeys?.openai || '');
        setGeminiKey(s.apikeys?.gemini || '');

        // AI Settings
        setTemperature(s.ai_settings?.temperature || 0.7);
        setMaxTokens(s.ai_settings?.max_tokens || 1024);

        // Security
        setJwtExpiry(s.security?.jwt_expiry_minutes || 15);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (key, value) => {
    try {
      await ApiService.updateSettings({ key, value });
      alert("Settings updated successfully!");
      fetchSettings();
    } catch (err) {
      alert("Failed to update settings.");
    }
  };

  if (loading || !settingsData) {
    return <div className="text-center py-12 text-xs text-gray-400">Fetching configurations...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-800 dark:text-gray-200">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display">Administrative Settings</h2>
        <p className="text-xs text-gray-400 mt-1">Configure SMTP relays, OpenAI/Gemini endpoints, dashboard policies, and security tokens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left tabs selector */}
        <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-1.5 shadow-sm text-xs font-semibold lg:col-span-1 h-fit">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'general' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-light-hover/10 dark:hover:bg-dark-hover/10'
            }`}
          >
            <FaSlidersH /> General Configuration
          </button>
          <button
            onClick={() => setActiveTab('smtp')}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'smtp' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-light-hover/10 dark:hover:bg-dark-hover/10'
            }`}
          >
            <FaEnvelope /> SMTP Settings
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'api' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-light-hover/10 dark:hover:bg-dark-hover/10'
            }`}
          >
            <FaKey /> API Integrations
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-light-hover/10 dark:hover:bg-dark-hover/10'
            }`}
          >
            <FaRobot /> AI Model Engine
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'security' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-light-hover/10 dark:hover:bg-dark-hover/10'
            }`}
          >
            <FaShieldAlt /> Token Security
          </button>
        </div>

        {/* Right content box */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm lg:col-span-3 text-xs font-semibold space-y-6">
          
          {/* GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">General settings</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-gray-400">Application Name</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center p-3.5 bg-light-hover/20 dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl">
                  <div>
                    <h4 className="font-bold">Maintenance Mode</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Locks simulated interviews for candidates temporarily.</p>
                  </div>
                  <button
                    onClick={() => setMaintenance(!maintenance)}
                    className={`px-3 py-1.5 rounded font-bold uppercase ${
                      maintenance ? 'bg-rose-600 text-white' : 'bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {maintenance ? "ON" : "OFF"}
                  </button>
                </div>
                <button
                  onClick={() => handleSave('general', { app_name: appName, maintenance_mode: maintenance })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <FaSave /> Save settings
                </button>
              </div>
            </div>
          )}

          {/* SMTP */}
          {activeTab === 'smtp' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">SMTP Relays Config</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-gray-400">SMTP Host Server</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400">Port Number</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400">Sender Email ID</label>
                  <input
                    type="email"
                    value={smtpEmail}
                    onChange={(e) => setSmtpEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleSave('smtp', { host: smtpHost, port: smtpPort, email: smtpEmail })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <FaSave /> Save SMTP
                </button>
              </div>
            </div>
          )}

          {/* API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Third Party API credentials</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-gray-400">OpenAI Api Secret Key</label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-400 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400">Gemini Google API Key</label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-400 font-mono"
                  />
                </div>
                <button
                  onClick={() => handleSave('apikeys', { openai: openaiKey, gemini: geminiKey })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <FaSave /> Update Keys
                </button>
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">AI LLM Model Engine parameters</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-gray-400">Temperature Model Rating ({temperature})</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400">Max tokens value limit</label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleSave('ai_settings', { temperature, max_tokens: maxTokens })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <FaSave /> Save parameters
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Security & tokens limits</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-gray-400">JWT Token Expiry limit (minutes)</label>
                  <input
                    type="number"
                    value={jwtExpiry}
                    onChange={(e) => setJwtExpiry(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleSave('security', { jwt_expiry_minutes: jwtExpiry })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <FaSave /> Save Security
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
