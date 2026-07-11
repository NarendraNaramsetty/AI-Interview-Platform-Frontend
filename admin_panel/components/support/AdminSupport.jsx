import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaInbox, FaBug, FaReply, FaCheck, FaExclamationCircle } from 'react-icons/fa';

const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  
  // Modals
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSupport = () => {
    setLoading(true);
    ApiService.getSupport()
      .then(res => {
        const data = res.data || res;
        setMessages(data.messages || []);
        setBugs(data.bugs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSupport();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText) return;
    
    setSubmitting(true);
    try {
      await ApiService.replySupportMessage({
        id: selectedMessage.id,
        reply: replyText
      });
      alert("Reply sent & marked resolved!");
      setSelectedMessage(null);
      setReplyText('');
      fetchSupport();
    } catch (err) {
      alert("Failed to send reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveBug = async (id) => {
    try {
      await ApiService.resolveBugReport({ id });
      alert("Marked bug as resolved!");
      fetchSupport();
    } catch (err) {
      alert("Failed to resolve bug.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-200">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display">Client Support & Bug Center</h2>
        <p className="text-xs text-gray-400 mt-1">Audit guest contact submissions, reply to email tickets, or resolve bug tickets.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-light-border dark:border-dark-border gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'messages' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400'
          }`}
        >
          <FaInbox /> Support Messages Inbox ({messages.filter(m => m.status === 'Pending').length})
        </button>
        <button
          onClick={() => setActiveTab('bugs')}
          className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'bugs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400'
          }`}
        >
          <FaBug /> Bug Reports ({bugs.filter(b => b.status === 'Pending').length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400">Loading support logs...</div>
      ) : activeTab === 'messages' ? (
        /* Messages Box */
        <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm text-xs font-semibold">
          {messages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-2">Sender</th>
                    <th className="pb-3 px-2">Subject</th>
                    <th className="pb-3 px-2">Message</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border text-gray-300">
                  {messages.map(m => (
                    <tr key={m.id} className="hover:bg-light-hover/10 dark:hover:bg-dark-hover/10">
                      <td className="py-3 px-2">
                        <div className="font-bold">{m.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{m.email}</div>
                      </td>
                      <td className="py-3 px-2 font-semibold">{m.subject}</td>
                      <td className="py-3 px-2 max-w-xs truncate" title={m.message}>{m.message}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          m.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {m.status === 'Pending' ? (
                          <button
                            onClick={() => setSelectedMessage(m)}
                            className="p-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded transition-all text-xs"
                            title="Reply to message"
                          >
                            <FaReply />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[10px] italic">Replied</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">Inbox is empty.</div>
          )}
        </div>
      ) : (
        /* Bug list */
        <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm text-xs font-semibold">
          {bugs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-2">Owner</th>
                    <th className="pb-3 px-2">Bug Summary</th>
                    <th className="pb-3 px-2">Severity</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border text-gray-300">
                  {bugs.map(b => (
                    <tr key={b.id} className="hover:bg-light-hover/10 dark:hover:bg-dark-hover/10">
                      <td className="py-3 px-2 font-bold">{b.email}</td>
                      <td className="py-3 px-2">
                        <div className="font-bold">{b.title}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5 leading-relaxed">{b.description}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          b.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' :
                          b.severity === 'High' ? 'bg-rose-400/10 text-rose-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {b.severity}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          b.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {b.status === 'Pending' ? (
                          <button
                            onClick={() => handleResolveBug(b.id)}
                            className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded transition-all text-xs"
                            title="Mark resolved"
                          >
                            <FaCheck />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[10px] italic">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">No bug tickets filed.</div>
          )}
        </div>
      )}

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl p-6 relative text-gray-200">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-md font-bold font-display mb-2">Reply to user</h3>
            <p className="text-[10px] text-gray-400 mb-4">An automated email notification with your reply will be sent to <strong>{selectedMessage.email}</strong>.</p>

            <div className="p-3 mb-4 rounded-lg bg-light-hover/10 dark:bg-dark-bg border border-light-border dark:border-dark-border text-xs leading-relaxed text-gray-300">
              <div className="font-bold text-gray-400">Subject: {selectedMessage.subject}</div>
              <div className="mt-1">{selectedMessage.message}</div>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-gray-400 block">Response Text</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  placeholder="Enter response prompt..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-2"
              >
                {submitting ? "Sending reply..." : "Send Response"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
