import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Loader, 
  AlertCircle,
  CheckCircle2,
  Zap,
  BookOpen,
  Target
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../services/api';

export default function RoadmapGenerationPage() {
  const { theme } = useAuthStore();
  const { pushToast } = useToastStore();
  const navigate = useNavigate();
  
  const [interest, setInterest] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState('');

  // Suggested prompts for inspiration
  const suggestedPrompts = [
    'I want to become a QA Engineer',
    'I want to get better at backend APIs with Django',
    'I want to learn full-stack development with React and Node.js',
    'I want to transition to data science',
    'I want to improve my system design skills',
    'I want to learn cloud engineering with AWS',
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!interest.trim()) {
      setError('Please enter what you want to learn or become');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/api/roadmap/generate', {
        interest: interest.trim(),
        self_described_experience: experience.trim() || undefined,
      });
      
      const data = response.data?.data || response.data;
      setGenerated(data);
      
      pushToast({
        message: `🎯 Roadmap generated: ${data.pathway_title}`,
        type: 'success' 
      });
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to generate roadmap';
      setError(errorMsg);
      pushToast({
        message: errorMsg,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInterest(prompt);
    setError('');
  };

  const handleSaveRoadmap = () => {
    if (generated) {
      // Navigate to roadmap detail view
      navigate(`/roadmap/pathways/${generated.id}`, {
        state: { pathway: generated }
      });
    }
  };

  return (
    <div className={`min-h-screen space-y-8 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      
      {/* Hero Section */}
      <div className={`rounded-2xl border p-8 lg:p-12 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-dark-card to-dark-bg border-dark-border' 
          : 'bg-gradient-to-br from-indigo-50 to-light-card border-light-border'
      }`}>
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20">
              <Sparkles className="h-6 w-6 text-indigo-500" />
            </div>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              AI-Powered Roadmap
            </span>
          </div>
          
          <h1 className="font-display font-bold text-4xl lg:text-5xl">
            Your Personalized Learning Path
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Tell us what you want to become or learn. We'll generate a realistic, step-by-step roadmap to get you there.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Form Section */}
        {!generated && (
          <form onSubmit={handleGenerate} className={`rounded-2xl border p-8 space-y-6 ${
            theme === 'dark' 
              ? 'bg-dark-card border-dark-border' 
              : 'bg-white border-light-border shadow-sm'
          }`}>
            
            {/* Interest Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" />
                What do you want to become or learn?
              </label>
              <textarea
                value={interest}
                onChange={(e) => {
                  setInterest(e.target.value);
                  setError('');
                }}
                placeholder="e.g., 'I want to become a QA Engineer' or 'I want to get better at backend APIs with Django'"
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none transition-colors resize-none ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-dark-border text-gray-100 focus:border-indigo-500'
                    : 'bg-light-hover border-light-border text-gray-900 focus:border-indigo-500'
                } ${error ? 'border-red-500 dark:border-red-500' : ''}`}
                rows="3"
              />
              {error && (
                <div className="flex gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Experience Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Your current experience (optional)
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g., 'I've done manual QA for 2 years' or 'I'm completely new to this field'"
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none transition-colors resize-none ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-dark-border text-gray-100 focus:border-indigo-500'
                    : 'bg-light-hover border-light-border text-gray-900 focus:border-indigo-500'
                }`}
                rows="2"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This helps us pick the right starting difficulty and pacing
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating your roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate My Path
                </>
              )}
            </button>
          </form>
        )}

        {/* Suggested Prompts */}
        {!generated && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              💡 Try one of these or create your own:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className={`p-3 text-left rounded-lg border transition-all text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-dark-bg border-dark-border text-gray-300 hover:border-indigo-500/50 hover:bg-dark-hover'
                      : 'bg-light-hover border-light-border text-gray-700 hover:border-indigo-500/50 hover:bg-indigo-50'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generated Roadmap Display */}
        {generated && (
          <div className={`rounded-2xl border p-8 space-y-8 ${
            theme === 'dark' 
              ? 'bg-dark-card border-dark-border' 
              : 'bg-white border-light-border shadow-sm'
          }`}>
            
            {/* Roadmap Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <h2 className="font-display font-bold text-3xl">
                    {generated.pathway_title}
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {generated.inferred_level_reason}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-block px-3 py-1.5 bg-indigo-500/10 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {generated.inferred_starting_level} Level
                  </div>
                </div>
              </div>

              {/* Readiness Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Current Readiness</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {generated.overall_readiness_estimate_percent}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-dark-bg' : 'bg-light-hover'
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                    style={{ width: `${generated.overall_readiness_estimate_percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Your Learning Milestones
              </h3>

              <div className="space-y-4">
                {generated.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-dark-bg border-dark-border'
                        : 'bg-light-hover border-light-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Milestone Number Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                          {milestone.milestone_number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-base">
                            {milestone.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                            milestone.difficulty_tag === 'Beginner'
                              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                              : milestone.difficulty_tag === 'Intermediate'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'bg-red-500/10 text-red-700 dark:text-red-400'
                          }`}>
                            {milestone.difficulty_tag}
                          </span>
                          <span className={`text-xs font-medium flex items-center gap-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <Zap className="h-3 w-3" />
                            {milestone.estimated_hours}h
                          </span>
                        </div>

                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {milestone.description}
                        </p>

                        <div className={`text-sm p-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-indigo-500/5 text-indigo-300'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          <span className="font-medium">Why it matters: </span>
                          {milestone.why_it_matters}
                        </div>

                        {/* Key Topics */}
                        <div className="pt-2 space-y-1">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            Key Topics:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {milestone.key_topics.map((topic, tidx) => (
                              <span
                                key={tidx}
                                className={`text-xs px-2 py-1 rounded-md font-medium ${
                                  theme === 'dark'
                                    ? 'bg-dark-border text-gray-300'
                                    : 'bg-light-border text-gray-700'
                                }`}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border'
                  : 'bg-light-hover border-light-border'
              }`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Total Milestones
                    </p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {generated.milestones.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Total Learning Hours
                    </p>
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      {generated.total_hours}h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-dark-border dark:border-dark-border">
              <button
                onClick={() => {
                  setGenerated(null);
                  setInterest('');
                  setExperience('');
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all border ${
                  theme === 'dark'
                    ? 'border-dark-border text-gray-300 hover:bg-dark-hover'
                    : 'border-light-border text-gray-700 hover:bg-light-hover'
                }`}
              >
                Generate Another
              </button>
              <button
                onClick={handleSaveRoadmap}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                Start Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
