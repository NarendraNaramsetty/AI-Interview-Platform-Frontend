import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/useInterviewStore';
import { useAuthStore } from '../store/useAuthStore';
import { questions } from '../services/questions';
import { useToastStore } from '../store/useToastStore';
import { 
  Play, 
  HelpCircle, 
  Sliders, 
  Clock, 
  Cpu, 
  ListOrdered,
  Keyboard,
  Mic,
  Settings
} from 'lucide-react';

export default function InterviewSetupPage() {
  const { theme } = useAuthStore();
  const { config, setSetupConfig, startInterview } = useInterviewStore();
  const { pushToast } = useToastStore();
  const navigate = useNavigate();
  const [availableRoles, setAvailableRoles] = React.useState([]);
  const [availableDifficulties, setAvailableDifficulties] = React.useState([]);
  const [availableExperience, setAvailableExperience] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([questions.roles(), questions.categories(), questions.topics()])
      .then(([roles, categories, topics]) => {
        if (!mounted) return;

        const rawRoles = Array.isArray(roles) ? roles : roles?.results || roles?.data || [];
        const mappedRoles = rawRoles.map(r => ({
          id: r.id,
          name: r.title,
          techStack: r.description ? r.description.split(',').map(s => s.trim()) : ['React', 'JavaScript', 'Tailwind']
        }));
        setAvailableRoles(mappedRoles);

        const rawCategories = Array.isArray(categories) ? categories : categories?.results || categories?.data || [];
        const mappedCats = rawCategories.map(c => ({
          id: c.name.toLowerCase(),
          name: c.name
        }));
        setAvailableDifficulties(mappedCats.length ? mappedCats : [
          { id: 'easy', name: 'Easy' },
          { id: 'medium', name: 'Medium' },
          { id: 'hard', name: 'Hard' }
        ]);

        const rawTopics = Array.isArray(topics) ? topics : topics?.results || topics?.data || [];
        const mappedTopics = rawTopics.map(t => ({
          id: t.name.toLowerCase(),
          name: t.name
        }));
        setAvailableExperience(mappedTopics.length ? mappedTopics : [
          { id: 'junior', name: 'Junior (0-2 years)' },
          { id: 'mid', name: 'Mid-Level (2-5 years)' },
          { id: 'senior', name: 'Senior (5+ years)' }
        ]);
      })
      .catch((error) => {
        if (mounted) {
          pushToast({ type: 'error', title: 'Failed to load interview setup', message: error.message });
        }
      });
    return () => { mounted = false; };
  }, [pushToast]);

  const handleRoleChange = (roleId) => {
    const selectedRole = availableRoles.find(r => r.id === roleId) || availableRoles[0];
    setSetupConfig({
      role: roleId,
      techStack: selectedRole ? selectedRole.techStack.slice(0, 3) : []
    });
  };

  const handleTechToggle = (tech) => {
    const currentStack = config.techStack || [];
    if (currentStack.includes(tech)) {
      setSetupConfig({ techStack: currentStack.filter(t => t !== tech) });
    } else {
      setSetupConfig({ techStack: [...currentStack, tech] });
    }
  };

  const handleLaunch = () => {
    startInterview(currentRoleObj.name);
    // Redirect to active interview session view
    navigate('/interview/session');
  };

  const currentRoleObj = availableRoles.find(r => r.id === config.role) || availableRoles[0] || { name: 'Frontend Engineer', techStack: [] };
  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="font-display font-extrabold text-3xl">AI Practice Arena</h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Define your target parameters below to generate your simulated interviewer sandbox.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Setup parameters Form */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 space-y-6 ${cardStyle}`}>
          
          {/* Step 1: Role */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              1. Select Target Job Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-200 ${
                    config.role === role.id 
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                      : (theme === 'dark' ? 'border-dark-border hover:bg-dark-hover text-gray-400' : 'border-light-border hover:bg-light-hover text-gray-600')
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Tech Stack */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              2. Core Skill Domains / Tech stack
            </label>
            <div className="flex flex-wrap gap-2">
              {currentRoleObj.techStack.map((tech) => {
                const isSelected = (config.techStack || []).includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all duration-200 ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400' 
                        : (theme === 'dark' ? 'border-dark-border hover:border-gray-500/30 text-gray-400' : 'border-light-border hover:border-gray-300 text-gray-600')
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Experience & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Target Experience
              </label>
              <select
                value={config.experienceLevel}
                onChange={(e) => setSetupConfig({ experienceLevel: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                  theme === 'dark' ? 'bg-dark-bg border-dark-border text-white' : 'bg-white border-light-border text-gray-800'
                }`}
              >
                {(availableExperience.length ? availableExperience : [
                  { id: 'junior', name: 'Junior (0-2 years)' },
                  { id: 'mid', name: 'Mid-Level (2-5 years)' },
                  { id: 'senior', name: 'Senior (5+ years)' }
                ]).map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Difficulty Level
              </label>
              <select
                value={config.difficulty}
                onChange={(e) => setSetupConfig({ difficulty: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                  theme === 'dark' ? 'bg-dark-bg border-dark-border text-white' : 'bg-white border-light-border text-gray-800'
                }`}
              >
                {(availableDifficulties.length ? availableDifficulties : [
                  { id: 'easy', name: 'Easy' },
                  { id: 'medium', name: 'Medium' },
                  { id: 'hard', name: 'Hard' }
                ]).map(diff => (
                  <option key={diff.id} value={diff.id}>{diff.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 4: Questions & Format Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                <ListOrdered className="h-3.5 w-3.5" />
                <span>Question count</span>
              </label>
              <select
                value={config.questionCount}
                onChange={(e) => setSetupConfig({ questionCount: parseInt(e.target.value) })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                  theme === 'dark' ? 'bg-dark-bg border-dark-border text-white' : 'bg-white border-light-border text-gray-800'
                }`}
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Answering Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSetupConfig({ mode: 'text' })}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    config.mode === 'text' 
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                      : (theme === 'dark' ? 'border-dark-border hover:bg-dark-hover text-gray-400' : 'border-light-border hover:bg-light-hover text-gray-600')
                  }`}
                >
                  <Keyboard className="h-4 w-4" />
                  <span>Text Mode</span>
                </button>
                <button
                  onClick={() => setSetupConfig({ mode: 'voice' })}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    config.mode === 'voice' 
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                      : (theme === 'dark' ? 'border-dark-border hover:bg-dark-hover text-gray-400' : 'border-light-border hover:bg-light-hover text-gray-600')
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  <span>Voice Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Setup Summary Card & CTA Launch */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border flex flex-col justify-between h-full ${cardStyle}`}>
            <div className="space-y-6">
              <h3 className="font-display font-bold text-lg flex items-center gap-2 border-b pb-3 border-gray-500/10">
                <Sliders className="h-5 w-5 text-indigo-500" />
                <span>Session Summary</span>
              </h3>

              <div className="space-y-3.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-bold text-gray-300">{currentRoleObj.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-gray-300">
                    {config.experienceLevel.charAt(0).toUpperCase() + config.experienceLevel.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="font-bold text-gray-300">
                    {config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-bold text-gray-300">{config.questionCount * 2} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-bold text-indigo-400 flex items-center gap-1 capitalize">
                    {config.mode === 'text' ? <Keyboard className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    {config.mode} mode
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLaunch}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 mt-8"
            >
              <Play className="h-4.5 w-4.5 fill-white" />
              <span>Launch AI Mocks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
