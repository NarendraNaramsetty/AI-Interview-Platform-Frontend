import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Check, Eye, EyeOff, Copy } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function EnvironmentConfigPopup({ isOpen, onClose }) {
  const { theme } = useAuthStore();
  const [apiUrl, setApiUrl] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('');
  const [qdrantHost, setQdrantHost] = useState('');
  const [showApiUrl, setShowApiUrl] = useState(false);
  const [copied, setCopied] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved configuration from localStorage
    setApiUrl(localStorage.getItem('VITE_API_URL') || import.meta.env.VITE_API_URL || '');
    setOllamaUrl(localStorage.getItem('OLLAMA_BASE_URL') || import.meta.env.VITE_OLLAMA_URL || '');
    setQdrantHost(localStorage.getItem('QDRANT_HOST') || import.meta.env.VITE_QDRANT_HOST || '');
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('VITE_API_URL', apiUrl);
    localStorage.setItem('OLLAMA_BASE_URL', ollamaUrl);
    localStorage.setItem('QDRANT_HOST', qdrantHost);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReset = () => {
    setApiUrl(import.meta.env.VITE_API_URL || '');
    setOllamaUrl(import.meta.env.VITE_OLLAMA_URL || '');
    setQdrantHost(import.meta.env.VITE_QDRANT_HOST || '');
    localStorage.removeItem('VITE_API_URL');
    localStorage.removeItem('OLLAMA_BASE_URL');
    localStorage.removeItem('QDRANT_HOST');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl border shadow-2xl ${
        theme === 'dark'
          ? 'bg-dark-card border-dark-border'
          : 'bg-white border-light-border'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Environment Configuration</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Set your service endpoints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-dark-hover text-gray-400'
                : 'hover:bg-light-hover text-gray-500'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* API URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              API Base URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiUrl ? 'text' : 'password'}
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-dark-bg border-dark-border text-gray-200 focus:border-indigo-500'
                      : 'bg-light-hover border-light-border text-gray-800 focus:border-indigo-500'
                  }`}
                />
                <button
                  onClick={() => setShowApiUrl(!showApiUrl)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showApiUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={() => handleCopy(apiUrl, 'api')}
                className={`p-2.5 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-dark-hover text-gray-400 hover:text-gray-200'
                    : 'hover:bg-light-hover text-gray-500 hover:text-gray-700'
                }`}
                title="Copy to clipboard"
              >
                {copied === 'api' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              e.g., https://api.prepai.com or https://your-domain.com/api
            </p>
          </div>

          {/* Ollama URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Ollama Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="https://ollama.example.com"
                className={`flex-1 px-4 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-dark-border text-gray-200 focus:border-indigo-500'
                    : 'bg-light-hover border-light-border text-gray-800 focus:border-indigo-500'
                }`}
              />
              <button
                onClick={() => handleCopy(ollamaUrl, 'ollama')}
                className={`p-2.5 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-dark-hover text-gray-400 hover:text-gray-200'
                    : 'hover:bg-light-hover text-gray-500 hover:text-gray-700'
                }`}
                title="Copy to clipboard"
              >
                {copied === 'ollama' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              LLM provider endpoint
            </p>
          </div>

          {/* Qdrant Host */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Qdrant Host
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={qdrantHost}
                onChange={(e) => setQdrantHost(e.target.value)}
                placeholder="qdrant.example.com"
                className={`flex-1 px-4 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-dark-border text-gray-200 focus:border-indigo-500'
                    : 'bg-light-hover border-light-border text-gray-800 focus:border-indigo-500'
                }`}
              />
              <button
                onClick={() => handleCopy(qdrantHost, 'qdrant')}
                className={`p-2.5 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-dark-hover text-gray-400 hover:text-gray-200'
                    : 'hover:bg-light-hover text-gray-500 hover:text-gray-700'
                }`}
                title="Copy to clipboard"
              >
                {copied === 'qdrant' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Vector database host
            </p>
          </div>

          {/* Info Box */}
          <div className={`p-3 rounded-lg border ${
            theme === 'dark'
              ? 'bg-blue-500/5 border-blue-500/20'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> These settings are saved locally in your browser. Use production URLs for deployment.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-2 p-6 border-t ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <button
            onClick={handleReset}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-dark-hover border border-dark-border'
                : 'text-gray-600 hover:bg-light-hover border border-light-border'
            }`}
          >
            Reset
          </button>
          <button
            onClick={() => {
              handleSave();
              setTimeout(onClose, 1000);
            }}
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save & Close'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
