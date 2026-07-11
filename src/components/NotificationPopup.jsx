import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, Search, X, MailOpen } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { notifications as notificationsService } from '../services/notifications';

export default function NotificationPopup({ isOpen, onClose }) {
  const { theme } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      notificationsService.list()
        .then((data) => {
          setNotifications(Array.isArray(data) ? data : data?.results || []);
        })
        .catch(() => setNotifications([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleMarkRead = (id) => {
    notificationsService.markRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    notificationsService.markAllRead().then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }).catch(() => {});
  };

  // Filter notifications based on search
  const filtered = notifications.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show only unread first, then limit to 5
  const displayNotifications = [
    ...filtered.filter(n => !n.read),
    ...filtered.filter(n => n.read)
  ].slice(0, 5);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Popup Modal */}
      <div className={`fixed top-20 right-6 z-50 w-96 rounded-2xl border shadow-2xl transition-all duration-200 ${
        theme === 'dark'
          ? 'bg-dark-card border-dark-border'
          : 'bg-white border-light-border'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20">
              <Bell className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-indigo-500">{unreadCount} unread</p>
              )}
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
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Search */}
        <div className={`px-5 py-3 border-b ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border focus:outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border text-gray-200 focus:border-indigo-500'
                  : 'bg-light-hover border-light-border text-gray-800 focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-r-transparent" />
            </div>
          ) : displayNotifications.length > 0 ? (
            <div className="divide-y divide-light-border dark:divide-dark-border">
              {displayNotifications.map((not) => (
                <div
                  key={not.id}
                  className={`p-4 hover:bg-light-hover dark:hover:bg-dark-hover/50 transition-colors group ${
                    !not.read ? 'bg-light-hover/30 dark:bg-indigo-500/5' : ''
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    {/* Status dot */}
                    <div className="mt-1">
                      {!not.read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 block animate-pulse" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-xs font-semibold leading-tight ${
                          not.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {not.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                          {not.time}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed mt-1 ${
                        not.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {not.text}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      {!not.read && (
                        <button
                          onClick={() => handleMarkRead(not.id)}
                          className="p-1 hover:bg-indigo-500/20 rounded text-indigo-500 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(not.id)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                            : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <MailOpen className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  No notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  You're all caught up!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        {notifications.length > 0 && (
          <div className={`px-5 py-3 border-t flex items-center justify-between ${
            theme === 'dark' ? 'border-dark-border' : 'border-light-border'
          }`}>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Mark all as read
              </button>
            )}
            <a
              href="/notifications"
              onClick={onClose}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors ml-auto"
            >
              View all →
            </a>
          </div>
        )}
      </div>
    </>
  );
}
