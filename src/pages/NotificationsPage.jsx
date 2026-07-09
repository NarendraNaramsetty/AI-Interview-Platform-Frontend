import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, Search, Filter, MailOpen, AlertTriangle, Sparkles, CreditCard, Code, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { notifications as notificationsService } from '../services/notifications';

export default function NotificationsPage() {
  const { theme } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    notificationsService.list().then((data) => {
      setNotifications(Array.isArray(data) ? data : data?.results || []);
    }).catch(() => setNotifications([]));
  }, []);

  const handleMarkRead = (id) => {
    notificationsService.markRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }).catch(() => {});
  };

  const handleMarkAllRead = () => {
    notificationsService.markAllRead().then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filter & Search Logic
  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' ? true : n.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getIcon = (type) => {
    switch (type) {
      case 'interview':
        return <Bell className="h-4.5 w-4.5 text-blue-500" />;
      case 'payment':
      case 'subscription':
        return <CreditCard className="h-4.5 w-4.5 text-emerald-500" />;
      case 'ai':
        return <Sparkles className="h-4.5 w-4.5 text-violet-500" />;
      case 'coding':
        return <Code className="h-4.5 w-4.5 text-pink-500" />;
      case 'resume':
        return <FileText className="h-4.5 w-4.5 text-orange-500" />;
      default:
        return <Bell className="h-4.5 w-4.5 text-indigo-500" />;
    }
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl">Notifications Center</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stay up to date with mock schedules, subscription metrics, AI score tips, and coding milestones.
          </p>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Check className="h-4 w-4 text-indigo-500" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className={`p-4.5 rounded-2xl border ${cardStyle} flex flex-col sm:flex-row gap-4`}>
        <div className="relative flex items-center flex-1">
          <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none"
          />
        </div>

        <div className="flex gap-2 bg-light-hover dark:bg-dark-hover p-1 rounded-xl border border-light-border dark:border-dark-border overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'interview', label: 'Interviews' },
            { id: 'ai', label: 'AI' },
            { id: 'coding', label: 'Coding' },
            { id: 'payment', label: 'Billing' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => { setTypeFilter(type.id); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                typeFilter === type.id
                  ? 'bg-white dark:bg-dark-card text-indigo-500 shadow-sm border border-light-border dark:border-dark-border'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Grid list */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        {paginated.length > 0 ? (
          <div className="space-y-4">
            <div className="divide-y divide-light-border dark:divide-dark-border">
              {paginated.map((not) => (
                <div
                  key={not.id}
                  className={`py-4 flex gap-4 items-start transition-all group ${
                    not.read ? 'opacity-60' : 'opacity-100 font-medium'
                  }`}
                >
                  {/* Category icon */}
                  <div className="p-2.5 rounded-xl bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border shrink-0 mt-0.5 relative">
                    {getIcon(not.type)}
                    {!not.read && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-dark-card animate-pulse" />
                    )}
                  </div>

                  {/* Body text */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{not.title}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{not.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pr-6">{not.text}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!not.read && (
                      <button
                        onClick={() => handleMarkRead(not.id)}
                        className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-indigo-500"
                        title="Mark as Read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(not.id)}
                      className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-4 text-xs font-semibold text-gray-500">
                <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} notifications</span>
                
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12 space-y-4">
            <MailOpen className="h-10 w-10 text-gray-400 mx-auto animate-bounce" />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Inbox is empty</h4>
              <p className="text-xs text-gray-400 mt-1">You are all caught up! No recent notifications found.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
