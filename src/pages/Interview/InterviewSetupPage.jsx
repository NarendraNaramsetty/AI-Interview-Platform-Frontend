import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useResumeStore } from '../../store/useResumeStore';
import { questions } from '../../services/questions';
import { useToastStore } from '../../store/useToastStore';
import { 
  Server, 
  Monitor, 
  Layers, 
  Cloud, 
  Brain, 
  Database, 
  Sparkles, 
  Shield, 
  Clipboard, 
  PenTool, 
  Bug, 
  Clock, 
  Play, 
  Keyboard, 
  Mic, 
  Video, 
  Code, 
  Globe, 
  UserCheck, 
  Briefcase, 
  Zap, 
  Shuffle, 
  Flame, 
  Award, 
  Search, 
  Info, 
  Check, 
  Trophy, 
  TrendingUp, 
  Sliders, 
  Eye, 
  HelpCircle,
  FileText,
  User
} from 'lucide-react';

export default function InterviewSetupPage() {
  const { theme } = useAuthStore();
  const { config, setSetupConfig, startInterview, history } = useInterviewStore();
  const { parsedData, hydrateResume } = useResumeStore();
  const { pushToast } = useToastStore();
  const navigate = useNavigate();

  const [availableRoles, setAvailableRoles] = useState([]);
  const [techSearch, setTechSearch] = useState('');
  const [dynamicTechCategories, setDynamicTechCategories] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('Startup');
  const [selectedFocus, setSelectedFocus] = useState(['Authentication', 'REST APIs']);
  const [aiPersonality, setAiPersonality] = useState('FAANG Style');
  const [timePressure, setTimePressure] = useState(true);
  const [codingPreference, setCodingPreference] = useState(true);
  const [behavioralSlider, setBehavioralSlider] = useState(25);
  const [voiceLang, setVoiceLang] = useState('US English');
  const [voiceSpeed, setVoiceSpeed] = useState('Normal');
  const [useResumeSkills, setUseResumeSkills] = useState(true);

  // Gamification Metrics
  const xpPoints = 1250;
  const currentLevel = 'Gold';
  const streakDays = 7;

  useEffect(() => {
    let mounted = true;
    // Load lists from backend API, hydrate resume details
    Promise.all([
      questions.roles(), 
      questions.categories(), 
      questions.topics(),
      hydrateResume()
    ])
      .then(([roles, categories, topics]) => {
        if (!mounted) return;

        const rawRoles = Array.isArray(roles) ? roles : roles?.results || roles?.data || [];
        const mappedRoles = rawRoles.map(r => ({
          id: r.id || r.title?.toLowerCase().replace(/\s+/g, '-'),
          name: r.title,
          description: r.description || 'System development, REST endpoints, microservices.',
          techStack: r.description ? r.description.split(',').map(s => s.trim()) : ['React', 'JavaScript', 'Tailwind']
        }));
        setAvailableRoles(mappedRoles.length ? mappedRoles : fallbackRoles);

        const rawCategories = Array.isArray(categories) ? categories : categories?.results || categories?.data || [];
        const rawTopics = Array.isArray(topics) ? topics : topics?.results || topics?.data || [];

        if (rawCategories.length > 0) {
          const dynamicTech = {};
          rawCategories.forEach(cat => {
            if (cat.name) {
              dynamicTech[cat.name] = [];
            }
          });
          rawTopics.forEach(topic => {
            const catName = topic.category_name || (rawCategories.find(c => c.id === topic.category)?.name);
            if (catName) {
              if (!dynamicTech[catName]) {
                dynamicTech[catName] = [];
              }
              dynamicTech[catName].push(topic.name);
            }
          });
          setDynamicTechCategories(dynamicTech);
        }
      })
      .catch((error) => {
        if (mounted) {
          pushToast({ type: 'error', title: 'Failed to load interview setup', message: error.message });
        }
      });
    return () => { mounted = false; };
  }, [pushToast, hydrateResume]);

  const fallbackRoles = [
    { id: 'backend', name: 'Backend Engineer', description: 'REST APIs, Microservices, Databases, Python', techStack: ['Python', 'Django', 'Postgres', 'Docker', 'Redis', 'AWS'] },
    { id: 'frontend', name: 'Frontend Engineer', description: 'React, Vite, Web performance, Styling systems', techStack: ['React', 'JavaScript', 'Tailwind', 'Next.js', 'Redux'] },
    { id: 'fullstack', name: 'Full Stack Engineer', description: 'End-to-end applications, devops deployment layers', techStack: ['React', 'Node.js', 'Express', 'Postgres', 'Docker'] },
    { id: 'devops', name: 'DevOps Engineer', description: 'CI/CD Pipelines, Cloud metrics, orchestration systems', techStack: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
    { id: 'ai-engineer', name: 'AI Engineer', description: 'LLMs, Vector Databases, LangChain integrations', techStack: ['Python', 'OpenAI', 'LangChain', 'Vector DB', 'PyTorch'] }
  ];

  const roleIcons = {
    'backend': Server,
    'frontend': Monitor,
    'fullstack': Layers,
    'devops': Cloud,
    'ai-engineer': Brain,
    'data-engineer': Database,
    'ml-engineer': Sparkles,
    'cyber-security': Shield,
    'product-manager': Clipboard,
    'designer': PenTool,
    'qa-engineer': Bug
  };

  const techCategories = {
    Languages: ['Python', 'Java', 'JavaScript', 'Go', 'C#', 'Rust'],
    Frameworks: ['React', 'Angular', 'Vue', 'Django', 'Flask', 'Spring Boot', 'Node', 'Express'],
    Databases: ['Postgres', 'MongoDB', 'Redis', 'MySQL'],
    Cloud: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    AI: ['OpenAI', 'LangChain', 'RAG', 'Vector DB', 'TensorFlow', 'PyTorch']
  };

  const experienceCards = [
    { id: 'fresher', title: 'Fresher', range: '0–1 years' },
    { id: 'junior', title: 'Junior', range: '1–3 years' },
    { id: 'mid', title: 'Mid-Level', range: '3–6 years' },
    { id: 'senior', title: 'Senior', range: '6–10 years' },
    { id: 'lead', title: 'Lead', range: '10+ years' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert', 'Adaptive AI'];

  const modes = [
    { id: 'text', title: 'Text Interview', desc: 'Type answers', icon: Keyboard },
    { id: 'voice', title: 'Voice Interview', desc: 'Speak answers', icon: Mic },
    { id: 'coding', title: 'Coding Interview', desc: 'Sandbox evaluation', icon: Code },
    { id: 'sys-design', title: 'System Design', desc: 'Architect schemas', icon: Globe },
    { id: 'behavioral', title: 'Behavioral Round', desc: 'Situational prompts', icon: UserCheck },
    { id: 'hr', title: 'HR Round', desc: 'Background fit', icon: Briefcase },
    { id: 'rapid', title: 'Rapid Fire', desc: 'Fast timed replies', icon: Zap },
    { id: 'mixed', title: 'Mixed Mock', desc: 'Hybrid evaluation', icon: Shuffle }
  ];

  const sessionTemplates = [
    { title: 'Backend Django Interview', role: 'backend', experience: 'mid', difficulty: 'Medium', skills: ['Python', 'Django', 'Postgres'], mode: 'text' },
    { title: 'React Frontend Mock', role: 'frontend', experience: 'junior', difficulty: 'Medium', skills: ['React', 'JavaScript', 'Tailwind'], mode: 'voice' },
    { title: 'Full Stack MERN Arena', role: 'fullstack', experience: 'mid', difficulty: 'Hard', skills: ['React', 'Node.js', 'Express', 'MongoDB'], mode: 'text' },
    { title: 'DevOps Kubernetes Prep', role: 'devops', experience: 'senior', difficulty: 'Hard', skills: ['Docker', 'Kubernetes', 'AWS'], mode: 'voice' }
  ];

  const currentRoleObj = availableRoles.find(r => r.id === config.role) || availableRoles[0] || fallbackRoles[0];

  const handleRoleChange = (roleId) => {
    const selectedRole = availableRoles.find(r => r.id === roleId) || availableRoles[0];
    setSetupConfig({
      role: roleId,
      techStack: selectedRole ? selectedRole.techStack.slice(0, 4) : []
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

  const handleFocusToggle = (focus) => {
    if (selectedFocus.includes(focus)) {
      setSelectedFocus(selectedFocus.filter(f => f !== focus));
    } else {
      setSelectedFocus([...selectedFocus, focus]);
    }
  };

  const handleApplyTemplate = (tpl) => {
    setSetupConfig({
      role: tpl.role,
      experienceLevel: tpl.experience,
      difficulty: tpl.difficulty.toLowerCase(),
      techStack: tpl.skills,
      mode: tpl.mode
    });
    pushToast({ type: 'success', title: 'Template Applied', message: `${tpl.title} configuration loaded.` });
  };

  const getEstimatedDuration = () => {
    const count = config.questionCount || 5;
    if (count <= 5) return '10 mins';
    if (count <= 10) return '20 mins';
    if (count <= 15) return '35 mins';
    return '45 mins';
  };

  const calculateReadyScore = () => {
    let score = 50;
    if (config.experienceLevel === 'junior') score += 15;
    if (config.experienceLevel === 'mid') score += 25;
    if (config.experienceLevel === 'senior') score += 35;
    if (config.techStack?.length > 3) score += 10;
    if (useResumeSkills && parsedData) score += 5;
    return Math.min(score, 100);
  };

  const getAiRecommendation = () => {
    const skillsStr = config.techStack?.join(', ') || 'selected stack';
    if (config.difficulty === 'easy' && ['mid', 'senior'].includes(config.experienceLevel)) {
      return `We recommend changing difficulty to Medium or Hard because your target experience level is ${config.experienceLevel}.`;
    }
    return `Expect comprehensive system queries on ${skillsStr} covering REST standards, API latency, and data integrity.`;
  };

  const handleLaunch = () => {
    const roleName = currentRoleObj.name;
    startInterview(roleName);
    navigate('/interview/session');
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  const activeTechCategories = dynamicTechCategories || techCategories;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
      
      {/* Premium Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-light-border dark:border-dark-border">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              AI Practice Arena
            </span>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Sparkles className="h-3 w-3" />
              Adaptive Mode Active
            </span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight py-2 animate-pulse">
            Simulate Your Next Interview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Generate personalized simulated interview sessions tailored to your target role and real-world experience level.
          </p>
        </div>

        {/* Header Indicators Widget */}
        <div className="flex gap-4 self-start md:self-center">
          <div className="px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-dark-card/50 border border-light-border dark:border-dark-border flex items-center gap-3">
            <Clock className="h-5 w-5 text-indigo-500" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">Est. Time</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{getEstimatedDuration()}</span>
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-dark-card/50 border border-light-border dark:border-dark-border flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">AI Adaptivity</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN (70%) - Config Section */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Tech Stack selection */}
          <div className="p-6 rounded-2xl border bg-white/70 dark:bg-dark-card/50 backdrop-blur-md border-light-border dark:border-dark-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  1. Technology stack / Skills
                </h3>
                <p className="text-[11px] text-gray-500">
                  Select core frameworks and compilers to shape code tasks and evaluations.
                </p>
              </div>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(activeTechCategories).map(([category, items]) => {
                const filteredItems = items.filter(item => item.toLowerCase().includes(techSearch.toLowerCase()));
                if (filteredItems.length === 0) return null;
                return (
                  <div key={category} className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider block">
                      {category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {filteredItems.map((tech) => {
                        const isSelected = (config.techStack || []).includes(tech);
                        return (
                          <button
                            key={tech}
                            onClick={() => handleTechToggle(tech)}
                            className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all duration-200 ${
                              isSelected 
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                                : 'border-light-border dark:border-dark-border hover:border-gray-550/30 text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:dark:text-white'
                            }`}
                          >
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {config.techStack?.length > 0 && (
              <div className="pt-2 flex items-center justify-between text-xs border-t border-light-border/50 dark:border-dark-border/50">
                <span className="text-gray-500">Selected Skills:</span>
                <span className="font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  {config.techStack.length} Skills
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Target Experience Level */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              2. Experience Level
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {experienceCards.map((exp) => {
                const isSelected = config.experienceLevel === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setSetupConfig({ experienceLevel: exp.id })}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' 
                        : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10 text-gray-755 dark:text-gray-200 hover:text-gray-950 hover:dark:text-white'
                    }`}
                  >
                    <span className="font-bold text-xs block">{exp.title}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-1">{exp.range}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Difficulty and mode settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Difficulty Segmented Controls */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                3. Session Difficulty
              </h3>
              <div className="p-1 rounded-2xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg flex flex-wrap gap-1">
                {difficulties.map((diff) => {
                  const isSelected = config.difficulty === diff.toLowerCase();
                  return (
                    <button
                      key={diff}
                      onClick={() => setSetupConfig({ difficulty: diff.toLowerCase() })}
                      className={`flex-1 min-w-[70px] text-[11px] font-bold py-2 rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? 'bg-white dark:bg-dark-card text-indigo-600 shadow-sm border border-light-border/40 dark:border-dark-border/40' 
                          : 'text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions count slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  4. Question Count
                </h3>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  {config.questionCount} Questions
                </span>
              </div>
              <div className="pt-2">
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={config.questionCount || 5}
                  onChange={(e) => setSetupConfig({ questionCount: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 h-1.5 bg-gray-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-semibold">
                  <span>3 Mocks</span>
                  <span>5 Mocks</span>
                  <span>10 Mocks</span>
                  <span>15 Mocks</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section 5: Interview Mode list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              5. Interview Mode
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {modes.map((mode) => {
                const ModeIcon = mode.icon;
                const isSelected = config.mode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSetupConfig({ mode: mode.id })}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 relative ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-500/5' 
                        : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10'
                    }`}
                  >
                    <div className={`p-2 rounded-lg border ${
                      isSelected 
                        ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-500' 
                        : 'border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-400 dark:text-gray-300'
                    }`}>
                      <ModeIcon className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200">{mode.title}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">{mode.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>



          {/* Recent Sessions */}
          {history.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Recent Practice Mocks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {history.slice(0, 2).map((session, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-light-border dark:border-dark-border bg-white/70 dark:bg-dark-card/50 backdrop-blur-md flex justify-between items-center gap-4">
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">{session.role}</h4>
                      <div className="flex gap-2.5 text-[9px] text-gray-500 font-semibold">
                        <span>{session.date}</span>
                        <span>{session.duration}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10 block w-fit ml-auto mb-1">
                        {session.overallScore}%
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSetupConfig({
                            role: session.role?.toLowerCase().includes('front') ? 'frontend' : 'backend',
                            experienceLevel: session.level?.toLowerCase() || 'mid',
                            difficulty: session.difficulty?.toLowerCase() || 'medium'
                          });
                          pushToast({ type: 'info', title: 'Session Reloaded', message: `Template matching ${session.role} loaded.` });
                        }}
                        className="text-[9px] font-bold text-indigo-400 hover:underline"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (30%) - Summary & Sidebar widgets */}
        <div className="space-y-6 lg:sticky lg:top-8">
          
          {/* Glass Sticky Summary Card */}
          <div className="p-6 rounded-3xl border bg-gradient-to-br from-indigo-500/10 to-violet-500/5 backdrop-blur-xl border-light-border dark:border-dark-border space-y-6">
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-500 animate-pulse" />
                <span>Session Summary</span>
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Confirm your generated parameters below before booting the interviewer sandbox.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-light-border/40 dark:border-dark-border/40 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Target Role</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{currentRoleObj.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Experience</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 capitalize">{config.experienceLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 capitalize">{config.difficulty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Interview Mode</span>
                <span className="font-bold text-indigo-500 capitalize flex items-center gap-1">
                  {config.mode === 'text' ? <Keyboard className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  {config.mode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Mock Duration</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{getEstimatedDuration()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Score Goal</span>
                <span className="font-bold text-indigo-500">85% minimum</span>
              </div>
            </div>

            {/* Circular Progress & readiness */}
            <div className="pt-4 border-t border-light-border/40 dark:border-dark-border/40 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Ready Score</span>
                <span className="text-lg font-extrabold text-gray-900 dark:text-gray-100 block">
                  {calculateReadyScore()}%
                </span>
              </div>
              {/* Progress Circle Visual */}
              <div className="relative h-12 w-12 shrink-0">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200 dark:text-dark-border" />
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-indigo-600 transition-all duration-300" strokeDasharray="125" strokeDashoffset={125 - (125 * calculateReadyScore()) / 100} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-indigo-500">
                  {calculateReadyScore()}%
                </span>
              </div>
            </div>

            {/* Launch CTA */}
            <button
              onClick={handleLaunch}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-2xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/25 mt-4"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Start AI Interview</span>
            </button>

          </div>

          {/* Resume Integration Card */}
          <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white/70 dark:bg-dark-card/50 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">Resume Integration</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate block">
                  {parsedData ? 'Resume Sync Active' : 'No Resume Connected'}
                </span>
              </div>
            </div>
            {parsedData && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-light-border/40 dark:border-dark-border/40">
                <span className="text-gray-500">Personalize questions with resume data</span>
                <button
                  type="button"
                  onClick={() => setUseResumeSkills(!useResumeSkills)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${useResumeSkills ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-dark-border'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${useResumeSkills ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}
          </div>

          {/* Gamification Streak & Levels */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Daily Streak */}
            <div className="p-4 rounded-2xl border border-light-border dark:border-dark-border bg-white/70 dark:bg-dark-card/50 backdrop-blur-md flex flex-col justify-between gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Streak</span>
                <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20 animate-bounce" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 block">
                  {streakDays} Days
                </span>
                <span className="text-[9px] text-gray-500 font-semibold">Active Practice Daily streak 🔥</span>
              </div>
            </div>

            {/* Level & XP */}
            <div className="p-4 rounded-2xl border border-light-border dark:border-dark-border bg-white/70 dark:bg-dark-card/50 backdrop-blur-md flex flex-col justify-between gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Gamification</span>
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 block">
                  {currentLevel} Tier
                </span>
                <span className="text-[9px] text-gray-500 font-semibold">{xpPoints} XP accumulated</span>
              </div>
            </div>

          </div>

          {/* Achievements widget */}
          <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white/70 dark:bg-dark-card/50 backdrop-blur-md space-y-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Award className="h-4 w-4 text-indigo-500" />
              <span>Earned Achievements</span>
            </h4>
            <div className="space-y-2">
              {[
                { name: 'First Mock Mocked', desc: 'Finished initial mock simulation.' },
                { name: '100 Questions Solved', desc: 'Resolved target sandbox evaluations.' },
                { name: 'Perfect Score 100%', desc: 'Secured exemplary scoring.' }
              ].map((ach, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs border-b border-light-border/40 dark:border-dark-border/40 last:border-b-0 pb-2 last:pb-0">
                  <span className="text-indigo-500 shrink-0 mt-0.5">✦</span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{ach.name}</span>
                    <p className="text-[9px] text-gray-500 leading-normal">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
