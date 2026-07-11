import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader,
  CheckCircle2,
  Circle,
  BookOpen,
  Zap,
  TrendingUp,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../services/api';

export default function RoadmapPathwayPage() {
  const { theme } = useAuthStore();
  const { pushToast } = useToastStore();
  const { pathwayId } = useParams();
  const navigate = useNavigate();

  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [updatingMilestone, setUpdatingMilestone] = useState(null);

  useEffect(() => {
    fetchPathway();
  }, [pathwayId]);

  const fetchPathway = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/roadmap/pathways/${pathwayId}`);
      const data = response.data?.data || response.data;
      setPathway(data);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load roadmap';
      setError(errorMsg);
      pushToast({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneToggle = async (milestoneId, currentStatus) => {
    try {
      setUpdatingMilestone(milestoneId);
      
      const response = await api.patch(
        `/api/roadmap/pathways/${pathwayId}/milestone/${milestoneId}/complete`,
        {
          is_completed: !currentStatus,
          progress_percent: !currentStatus ? 100 : 0
        }
      );

      // Update local state
      const data = response.data?.data || response.data;
      setPathway(prev => ({
        ...prev,
        milestones: prev.milestones.map(m =>
          m.id === milestoneId ? data : m
        )
      }));

      pushToast({
        message: !currentStatus ? '🎉 Milestone completed!' : 'Milestone marked incomplete',
        type: 'success'
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update milestone';
      pushToast({ message: errorMsg, type: 'error' });
    } finally {
      setUpdatingMilestone(null);
    }
  };

  const handleUpdateProgress = async (milestoneId, progressPercent) => {
    try {
      setUpdatingMilestone(milestoneId);

      const response = await api.patch(
        `/api/roadmap/pathways/${pathwayId}/milestone/${milestoneId}/complete`,
        { progress_percent: progressPercent }
      );

      const data = response.data?.data || response.data;
      setPathway(prev => ({
        ...prev,
        milestones: prev.milestones.map(m =>
          m.id === milestoneId ? data : m
        )
      }));

      pushToast({
        message: `Progress updated to ${progressPercent}%`,
        type: 'success'
      });
    } catch (err) {
      pushToast({ message: 'Failed to update progress', type: 'error' });
    } finally {
      setUpdatingMilestone(null);
    }
  };

  const handleDeletePathway = async () => {
    if (!window.confirm('Are you sure you want to delete this roadmap? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/roadmap/pathways/${pathwayId}/delete`);
      pushToast({ message: 'Roadmap deleted', type: 'success' });
      navigate('/roadmap');
    } catch (err) {
      pushToast({
        message: err.response?.data?.message || 'Failed to delete roadmap',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/roadmap')}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </button>
          <div className={`p-6 rounded-xl border ${
            theme === 'dark'
              ? 'bg-dark-card border-red-500/20'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex gap-3">
              <AlertCircle className={`h-5 w-5 shrink-0 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
              <div>
                <h3 className="font-semibold mb-1">Error Loading Roadmap</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = pathway.milestones.filter(m => m.is_completed).length;
  const overallProgress = pathway.milestones.length > 0
    ? Math.round((completedCount / pathway.milestones.length) * 100)
    : 0;

  return (
    <div className={`min-h-screen space-y-8 pb-12 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
    }`}>
      
      {/* Header */}
      <div className={`rounded-2xl border p-8 lg:p-12 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-dark-card to-dark-bg border-dark-border'
          : 'bg-gradient-to-br from-indigo-50 to-light-card border-light-border'
      }`}>
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/roadmap')}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </button>

          {/* Title & Stats */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h1 className="font-display font-bold text-4xl lg:text-5xl">
                  {pathway.pathway_title}
                </h1>
                <p className={`text-base ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {pathway.inferred_level_reason}
                </p>
              </div>
              <button
                onClick={handleDeletePathway}
                className={`p-2.5 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-400'
                    : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                }`}
                title="Delete roadmap"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border'
                  : 'bg-white border-light-border'
              }`}>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Progress
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {overallProgress}%
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border'
                  : 'bg-white border-light-border'
              }`}>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {completedCount}/{pathway.milestones.length}
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border'
                  : 'bg-white border-light-border'
              }`}>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {pathway.total_hours}h
                </p>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className={`h-3 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-dark-card' : 'bg-light-hover'
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {completedCount} of {pathway.milestones.length} milestones completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-500" />
          Learning Milestones
        </h2>

        <div className="space-y-4">
          {pathway.milestones.map((milestone, idx) => (
            <div
              key={milestone.id}
              className={`rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-dark-card border-dark-border hover:border-indigo-500/50'
                  : 'bg-white border-light-border hover:border-indigo-500/50 shadow-sm'
              } ${expandedMilestone === milestone.id ? 'ring-2 ring-indigo-500/20' : ''}`}
            >
              
              {/* Milestone Header */}
              <button
                onClick={() => setExpandedMilestone(
                  expandedMilestone === milestone.id ? null : milestone.id
                )}
                className="w-full px-6 py-4 flex items-start gap-4 hover:opacity-75 transition-opacity text-left"
              >
                {/* Number Badge */}
                <div className="flex-shrink-0 mt-1">
                  {milestone.is_completed ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMilestoneToggle(milestone.id, milestone.is_completed);
                      }}
                      disabled={updatingMilestone === milestone.id}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMilestoneToggle(milestone.id, milestone.is_completed);
                      }}
                      disabled={updatingMilestone === milestone.id}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'border-dark-border text-gray-300 hover:border-indigo-500'
                          : 'border-light-border text-gray-600 hover:border-indigo-500'
                      }`}
                    >
                      {milestone.milestone_number}
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold ${
                      milestone.is_completed
                        ? theme === 'dark' ? 'text-gray-500 line-through' : 'text-gray-500 line-through'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {milestone.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                      milestone.difficulty_tag === 'Beginner'
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : milestone.difficulty_tag === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}>
                      {milestone.difficulty_tag}
                    </span>
                  </div>

                  {/* Progress Bar Mini */}
                  {!milestone.is_completed && milestone.progress_percent > 0 && (
                    <div className={`h-1 rounded-full overflow-hidden w-32 ${
                      theme === 'dark' ? 'bg-dark-bg' : 'bg-light-hover'
                    }`}>
                      <div
                        className="h-full bg-indigo-500 transition-all"
                        style={{ width: `${milestone.progress_percent}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedMilestone === milestone.id && (
                <div className={`px-6 pb-6 space-y-4 border-t ${
                  theme === 'dark' ? 'border-dark-border' : 'border-light-border'
                }`}>
                  
                  {/* Description */}
                  <div>
                    <p className={`text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {milestone.description}
                    </p>
                  </div>

                  {/* Why It Matters */}
                  <div className={`p-3 rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'bg-indigo-500/5 text-indigo-300'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    <span className="font-semibold">💡 Why it matters: </span>
                    {milestone.why_it_matters}
                  </div>

                  {/* Key Topics */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Key Topics:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {milestone.key_topics.map((topic, tidx) => (
                        <span
                          key={tidx}
                          className={`text-xs px-2 py-1 rounded-md font-medium ${
                            theme === 'dark'
                              ? 'bg-dark-bg text-gray-300'
                              : 'bg-light-hover text-gray-700'
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Time & Progress */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-dark-bg border border-dark-border'
                        : 'bg-light-hover border border-light-border'
                    }`}>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Estimated Time
                      </p>
                      <p className="font-semibold flex items-center gap-1">
                        <Zap className="h-4 w-4 text-amber-500" />
                        {milestone.estimated_hours}h
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-dark-bg border border-dark-border'
                        : 'bg-light-hover border border-light-border'
                    }`}>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Your Progress
                      </p>
                      <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {milestone.progress_percent}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Slider (if not completed) */}
                  {!milestone.is_completed && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={milestone.progress_percent}
                        onChange={(e) => handleUpdateProgress(milestone.id, parseInt(e.target.value))}
                        disabled={updatingMilestone === milestone.id}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Drag to update your progress
                      </p>
                    </div>
                  )}

                  {/* Mark Complete Button */}
                  {!milestone.is_completed && (
                    <button
                      onClick={() => handleMilestoneToggle(milestone.id, milestone.is_completed)}
                      disabled={updatingMilestone === milestone.id}
                      className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingMilestone === milestone.id ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
