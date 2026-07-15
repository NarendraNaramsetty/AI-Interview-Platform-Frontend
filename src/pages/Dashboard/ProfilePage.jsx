import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Mail, Briefcase, FileText, Globe, Award, Sparkles, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, hydrateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [title, setTitle] = useState(user?.role || 'Full Stack Engineer');
  const [bio, setBio] = useState(user?.bio || '');
  const [github, setGithub] = useState(user?.github_url || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin_url || '');
  
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch fresh profile data on component mount
  useEffect(() => {
    hydrateUser();
  }, []);

  // Sync state variables whenever user in the store changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setTitle(user.role || 'Full Stack Engineer');
      setBio(user.bio || '');
      setGithub(user.github_url || '');
      setLinkedin(user.linkedin_url || '');
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
    updateProfile({
      first_name: firstName || name,
      last_name: lastNameParts.join(' ') || '.',
      email,
      bio,
      github_url: github,
      linkedin_url: linkedin,
      role: title
    }).then(() => {
      setLoading(false);
      setIsSaved(true);
      window.setTimeout(() => setIsSaved(false), 3000);
    }).catch(() => {
      setLoading(false);
    });
  };

  const badges = [
    { name: 'System Design Pro', desc: 'Scored 90%+ in high-scale system design architecture', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
    { name: 'ATS Optimized', desc: 'Achieved an ATS score above 85% on the Resume Scan', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { name: 'JavaScript Expert', desc: 'Completed 15 advanced JS coding challenges', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    { name: 'Grammar Master', desc: 'Mock interview transcription accuracy > 95%', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner Cover Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6 md:p-8">
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="relative pt-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
            <div className="h-28 w-28 rounded-full border-4 border-white dark:border-dark-card bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-bold font-display shadow-md">
              {name ? name.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold leading-tight">{name || 'Guest User'}</h2>
              <p className="text-indigo-500 font-medium flex items-center gap-1 justify-center md:justify-start">
                <Briefcase className="h-4 w-4" />
                {title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Joined {user?.joined || 'Recently'}</p>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            {user?.tier || 'Free Tier'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Stats and Badges */}
        <div className="space-y-8 lg:col-span-1">
          {/* Performance Summary Stats */}
          <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-500" />
              Practice Analytics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
                <p className="text-xs text-gray-500 dark:text-gray-400">Interviews</p>
                <p className="text-2xl font-bold font-display text-indigo-500 mt-1">12</p>
              </div>
              <div className="p-4 rounded-xl bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Score</p>
                <p className="text-2xl font-bold font-display text-emerald-500 mt-1">78%</p>
              </div>
              <div className="p-4 rounded-xl bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
                <p className="text-xs text-gray-500 dark:text-gray-400">ATS Score</p>
                <p className="text-2xl font-bold font-display text-violet-500 mt-1">82%</p>
              </div>
              <div className="p-4 rounded-xl bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
                <p className="text-xs text-gray-500 dark:text-gray-400">Roadmap Progress</p>
                <p className="text-2xl font-bold font-display text-pink-500 mt-1">64%</p>
              </div>
            </div>
          </div>

          {/* Achievements / Badges */}
          <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Achievements
            </h3>
            <div className="space-y-4">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/40 dark:bg-dark-hover/40">
                  <div className={`p-2 rounded-lg border shrink-0 ${badge.color}`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{badge.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Edit Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
            <h3 className="font-display font-bold text-xl mb-6">Profile Settings</h3>
            
            {isSaved && (
              <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2.5 animate-pulse-slow">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Your profile information has been successfully updated!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Alex Developer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Mail className="h-4 w-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="alex.dev@example.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Briefcase className="h-4 w-4" /> Professional Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Full Stack Engineer / Senior PM"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <FileText className="h-4 w-4" /> Short Bio
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Globe className="h-4 w-4" /> GitHub Profile URL
                  </label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Globe className="h-4 w-4" /> LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Saving Changes...' : 'Save Settings'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
