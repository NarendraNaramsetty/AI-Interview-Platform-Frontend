import React, { useState, useEffect } from 'react';
import { Search, Calendar, Briefcase, Award, Clock, ArrowRight, Download, Trash2, RefreshCw, AlertCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { interview } from '../../services/interview';

export default function InterviewHistoryPage() {
  const { theme } = useAuthStore();
  const navigate = useNavigate();
  
  const [interviews, setInterviews] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    interview.history().then((data) => {
      const list = Array.isArray(data) ? data : data?.results || data?.data || [];
      const mapped = list.map(item => ({
        id: item.id,
        name: item.title || `${item.target_role} Practice`,
        level: item.difficulty || 'Mid-Level',
        difficulty: item.difficulty || 'Medium',
        role: item.target_role || 'General',
        company: item.target_company || 'Target',
        date: item.completed_at ? String(item.completed_at).split('T')[0] : (item.started_at ? String(item.started_at).split('T')[0] : 'Recent'),
        duration: `${item.duration_minutes || 10} mins`,
        overallScore: item.result?.overall_score || 0,
        technicalScore: item.result?.technical_score || 0,
        communicationScore: item.result?.communication_score || 0,
        confidenceScore: item.result?.confidence_score || 0,
        status: item.status === 'Completed' || item.status === 'finished' ? 'Completed' : 'Incomplete'
      }));
      setInterviews(mapped);
      setIsLoading(false);
    }).catch(() => {
      setInterviews([]);
      setIsLoading(false);
    });
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [minScore, setMinScore] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Actions states
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter & Search Logic
  const filteredInterviews = interviews.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? item.role === roleFilter : true;
    const matchesCompany = companyFilter ? item.company.toLowerCase() === companyFilter.toLowerCase() : true;
    const matchesDate = dateFilter ? item.date >= dateFilter : true;
    const matchesScore = item.status === 'Incomplete' ? (minScore === 0) : (item.overallScore >= minScore);
    
    return matchesSearch && matchesRole && matchesCompany && matchesDate && matchesScore;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInterviews = filteredInterviews.slice(startIndex, startIndex + itemsPerPage);

  const handleDownloadPDF = (id) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Download completed for Interview Report: ${id}`);
    }, 1500);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setInterviews(prev => prev.filter(item => item.id !== id));
      setDeletingId(null);
    }, 800);
  };

  const handleResume = (item) => {
    alert(`Resuming incomplete mock simulation: ${item.name} for ${item.role}`);
    navigate('/interview/session');
  };

  const triggerResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
    setCompanyFilter('');
    setDateFilter('');
    setMinScore(0);
    setCurrentPage(1);
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-3xl">Interview History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review past mock simulations, query granular scoring metrics, or download detailed report evaluations.
          </p>
        </div>
        <button 
          onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }}
          className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-xl text-gray-500 hover:text-indigo-500 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Filter Sandbox panel */}
      <div className={`p-5 rounded-2xl border ${cardStyle} grid grid-cols-1 md:grid-cols-5 gap-4`}>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Search</label>
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search session or company..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Role Filter</label>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="" className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">All Job Roles</option>
            <option value="Frontend Engineer" className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">Frontend Engineer</option>
            <option value="Backend Engineer" className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">Backend Engineer</option>
            <option value="Product Manager" className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">Product Manager</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Company</label>
          <input
            type="text"
            value={companyFilter}
            onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
            placeholder="e.g. Google"
            className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Since Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Min Score: {minScore}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) => { setMinScore(Number(e.target.value)); setCurrentPage(1); }}
            className="w-full h-2 bg-light-hover dark:bg-dark-hover rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2.5"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        {isLoading ? (
          // Skeleton loader
          <div className="space-y-4 py-4">
            <div className="h-6 bg-light-hover dark:bg-dark-hover rounded-lg animate-pulse w-1/4" />
            <div className="space-y-2">
              <div className="h-12 bg-light-hover dark:bg-dark-hover rounded-lg animate-pulse" />
              <div className="h-12 bg-light-hover dark:bg-dark-hover rounded-lg animate-pulse" />
              <div className="h-12 bg-light-hover dark:bg-dark-hover rounded-lg animate-pulse" />
            </div>
          </div>
        ) : paginatedInterviews.length > 0 ? (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-xs text-gray-400 uppercase tracking-wider font-bold">
                    <th className="pb-3.5 px-2">Interview Name</th>
                    <th className="pb-3.5 px-2">Role</th>
                    <th className="pb-3.5 px-2">Company</th>
                    <th className="pb-3.5 px-2">Date</th>
                    <th className="pb-3.5 px-2">Duration</th>
                    <th className="pb-3.5 px-2">Overall Score</th>
                    <th className="pb-3.5 px-2">Status</th>
                    <th className="pb-3.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border text-xs md:text-sm">
                  {paginatedInterviews.map((item) => (
                    <tr key={item.id} className="hover:bg-light-hover/20 dark:hover:bg-dark-hover/10 group transition-colors">
                      <td className="py-4 px-2 font-semibold">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal mt-0.5">{item.level} • {item.difficulty}</div>
                      </td>
                      <td className="py-4 px-2">{item.role}</td>
                      <td className="py-4 px-2 font-medium">{item.company}</td>
                      <td className="py-4 px-2 text-xs text-gray-400">{item.date}</td>
                      <td className="py-4 px-2 text-xs text-gray-400">{item.duration}</td>
                      <td className="py-4 px-2">
                        {item.status === 'Incomplete' ? (
                          <span className="text-gray-400 font-bold">—</span>
                        ) : (
                          <span className={`font-bold ${
                            item.overallScore >= 80 ? 'text-emerald-500' :
                            item.overallScore >= 60 ? 'text-yellow-500' : 'text-rose-500'
                          }`}>
                            {item.overallScore}%
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-1.5">
                          {item.status === 'Incomplete' ? (
                            <button
                              onClick={() => handleResume(item)}
                              className="px-3 py-1.5 bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 font-bold rounded-lg text-[10px] uppercase transition-colors"
                            >
                              Resume
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDownloadPDF(item.id)}
                              disabled={downloadingId === item.id}
                              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-indigo-500 rounded-lg transition-colors"
                              title="Download PDF Report"
                            >
                              <Download className={`h-4 w-4 ${downloadingId === item.id ? 'animate-bounce' : ''}`} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-rose-500 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-4 text-xs font-semibold text-gray-500">
                <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredInterviews.length)} of {filteredInterviews.length} sessions</span>
                
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
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto" />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">No mock sessions found</h4>
              <p className="text-xs text-gray-400 mt-1">Try resetting your filters or start a new interview session.</p>
            </div>
            <button
              onClick={triggerResetFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4.5 py-2 rounded-xl text-xs transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
