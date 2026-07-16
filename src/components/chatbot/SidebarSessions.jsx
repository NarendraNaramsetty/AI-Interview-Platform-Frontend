import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Search, Sparkles } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';

export default function SidebarSessions() {
  const {
    sessions,
    currentSession,
    selectSession,
    createSession,
    deleteSession,
    isLoading
  } = useSessions();

  const [searchQuery, setSearchQuery] = useState("");
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const handleCreate = () => {
    createSession("New Chat Session");
  };

  // Filter sessions locally based on query
  const filteredSessions = sessions.filter(s => 
    (s.session_title || s.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full md:w-80 flex-col p-4.5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-xs shrink-0 h-[calc(100vh-14rem)] min-h-125 ${currentSession ? 'hidden md:flex' : 'flex'}`}>
      
      {/* Session Creator */}
      <button
        onClick={handleCreate}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        New Conversation
      </button>

      {/* Session Search */}
      <div className="relative mt-4 mb-3 flex items-center">
        <Search className="absolute left-3.5 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
        />
      </div>

      {/* Session Feed List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {isLoading && sessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading conversations...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            {searchQuery ? "No matching conversations found." : "No conversations started yet."}
          </div>
        ) : (
          filteredSessions.map((sess) => {
            const isSelected = currentSession?.id === sess.id;
            return (
              <div
                key={sess.id}
                onClick={() => selectSession(sess)}
                className={`group w-full py-2.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'bg-transparent border-transparent hover:bg-light-hover dark:hover:bg-dark-hover text-gray-600 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1 mr-2">
                  <MessageSquare className={`h-4 w-4 shrink-0 ${isSelected ? 'text-indigo-500' : 'text-gray-400'}`} />
                  <span className="text-xs truncate">{sess.session_title || sess.title}</span>
                </div>
                
                {/* Delete button (visible on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSessionToDelete(sess);
                  }}
                  className="p-1 hover:text-rose-500 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Branding Info */}
      <div className="pt-4 border-t border-light-border dark:border-dark-border mt-4 shrink-0 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI PREP ASSISTANT</span>
      </div>

      {/* Custom Modal Confirmation Dialog */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h4 className="font-display font-extrabold text-base text-gray-900 dark:text-white mb-2">
              Delete Conversation
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-200">"{sessionToDelete.session_title || sessionToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-light-border dark:border-dark-border text-gray-600 dark:text-gray-300 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteSession(sessionToDelete.id);
                  } catch (err) {
                    console.error("Failed to delete session:", err);
                  } finally {
                    setSessionToDelete(null);
                  }
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
