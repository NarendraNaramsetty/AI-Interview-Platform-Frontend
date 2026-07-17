import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, Search, X, MailOpen } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { notifications as notificationsService } from '../services/notifications';

export default function NotificationPopup({ isOpen, onClose, onUnreadCountChange }) {
  const { theme } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Update parent component when unread count changes
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [notifications, onUnreadCountChange]);

  const fetchNotifications = () => {
    setLoading(true);
    notificationsService.list()
      .then((data) => {
        const notificationArray = Array.isArray(data) ? data : data?.results || [];
        setNotifications(notificationArray);
      })
      .catch((error) => {
        console.error('Failed to load notifications:', error);
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  };

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
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Modal */}
      <div className={`fixed top-20 right-6 z-50 w-96 rounded-2xl border shadow-2xl transition-all duration-200 flex flex-col max-h-[600px] ${
        theme === 'dark'
          ? 'bg-dark-card border-dark-border'
          : 'bg-white border-light-border'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b shrink-0 ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 shrink-0">
              <Bell className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-indigo-500 font-medium">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ml-2 ${
              theme === 'dark'
                ? 'hover:bg-dark-hover text-gray-400 hover:text-gray-200'
                : 'hover:bg-light-hover text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className={`px-6 py-4 border-b shrink-0 ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border text-gray-200 placeholder-gray-500 focus:ring-indigo-500/30'
                  : 'bg-light-hover border-light-border text-gray-800 placeholder-gray-400 focus:ring-indigo-500/30'
              }`}
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 px-6">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-r-transparent" />
                <p className="text-xs text-gray-500">Loading notifications...</p>
              </div>
            </div>
          ) : displayNotifications.length > 0 ? (
            <div className="divide-y divide-light-border dark:divide-dark-border">
              {displayNotifications.map((not) => (
                <div
                  key={not.id}
                  className={`px-6 py-4 hover:bg-light-hover dark:hover:bg-dark-hover/50 transition-colors group cursor-pointer ${
                    !not.read ? 'bg-indigo-50 dark:bg-indigo-500/5' : ''
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    {/* Status dot and icon */}
                    <div className="mt-0.5 shrink-0 flex flex-col items-center gap-2">
                      {!not.read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 block animate-pulse" />
                      )}
                      {not.read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600 block" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-xs font-bold leading-tight line-clamp-2 ${
                          not.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {not.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0 ml-1">
                          {not.time}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${
                        not.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {not.text}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      {!not.read && (
                        <button
                          onClick={() => handleMarkRead(not.id)}
                          className="p-1.5 hover:bg-indigo-500/20 rounded-lg text-indigo-500 transition-colors hover:scale-110"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(not.id)}
                        className={`p-1.5 rounded-lg transition-colors hover:scale-110 ${
                          theme === 'dark'
                            ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                            : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <MailOpen className="h-10 w-10 text-gray-300 dark:text-gray-700 mb-3" />
              <div className="text-center">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
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
          <div className={`px-6 py-4 border-t flex items-center justify-between shrink-0 gap-3 ${
            theme === 'dark' ? 'border-dark-border' : 'border-light-border'
          }`}>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all"
              >
                Mark all read
              </button>
            )}
            <a
              href="/notifications"
              onClick={onClose}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all ml-auto flex items-center gap-1"
            >
              View all
              <span className="text-xs">→</span>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
