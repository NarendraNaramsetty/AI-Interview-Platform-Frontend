import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaBell, FaPaperPlane, FaBroadcastTower } from 'react-icons/fa';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [specificEmail, setSpecificEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchNotifications = () => {
    setLoading(true);
    ApiService.getNotifications()
      .then(res => {
        const data = res.data || res;
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      alert("Title and Message body are required.");
      return;
    }
    if (targetGroup === 'specific' && !specificEmail) {
      alert("Please enter target email.");
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.createNotification({
        title,
        message,
        target_group: targetGroup,
        email: specificEmail
      });
      setTitle('');
      setMessage('');
      setSpecificEmail('');
      alert("Notification broadcast sent!");
      fetchNotifications();
    } catch (err) {
      alert("Failed to send broadcast notification.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-200">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display">Global Notification Center</h2>
        <p className="text-xs text-gray-400 mt-1">Broadcast user alerts, queue push notifications, or dispatch targeted email alerts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Broadcaster form */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <FaBroadcastTower /> Queue Broadcast
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-gray-400 block">Alert title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="System Update Alert..."
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 block">Audience target</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-300"
              >
                <option value="all">All Registrants</option>
                <option value="free">Free Tier Users Only</option>
                <option value="premium">Premium Pro Members Only</option>
                <option value="specific">Specific User Account</option>
              </select>
            </div>

            {targetGroup === 'specific' && (
              <div className="space-y-1.5">
                <label className="text-gray-400 block">User Email</label>
                <input
                  type="email"
                  value={specificEmail}
                  onChange={(e) => setSpecificEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-gray-400 block">Message Body</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                placeholder="Alert text content here..."
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
            >
              <FaPaperPlane /> {submitting ? "Broadcasting..." : "Broadcast Alert"}
            </button>
          </form>
        </div>

        {/* History log */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <FaBell /> Queued notifications logs
          </h3>

          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading history logs...</div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {notifications.map(n => (
                <div key={n.id} className="p-4 rounded-lg bg-light-hover/10 dark:bg-dark-bg border border-light-border dark:border-dark-border space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-200 font-bold">{n.title}</span>
                    <span className="text-[10px] text-gray-400">{n.date}</span>
                  </div>
                  <div className="text-xs text-gray-300 leading-relaxed">{n.message}</div>
                  <div className="pt-2 border-t border-light-border/40 dark:border-dark-border/40 flex justify-between items-center text-[9px] text-gray-400 font-semibold">
                    <span>Target user: {n.email}</span>
                    <span className={`px-2 py-0.2 rounded-full ${n.is_read ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {n.is_read ? "Delivered & Read" : "Sent"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs border border-dashed border-light-border dark:border-dark-border rounded-lg">
              No global notifications dispatched yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
