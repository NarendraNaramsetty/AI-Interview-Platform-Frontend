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
  Loader2,
  AlertTriangle,
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
  const [showStats, setShowStats] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSkillConflictModal, setShowSkillConflictModal] = useState(false);

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

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
    Languages: ['Python', 'Java', 'JavaScript', 'TypeScript', 'Go', 'C++', 'C#', 'Rust'],
    Frameworks: ['React', 'Angular', 'Vue', 'Next.js', 'Django', 'Flask', 'Spring Boot', 'Node', 'Express'],
    Databases: ['Postgres', 'MongoDB', 'Redis', 'MySQL', 'SQLite'],
    Cloud: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'GCP', 'Git', 'CI/CD'],
    AI: ['OpenAI', 'LangChain', 'RAG', 'Vector DB', 'TensorFlow', 'PyTorch']
  };

  const experienceCards = [
    { id: 'fresher', title: 'Fresher', range: '0–1 years' },
    { id: 'junior', title: 'Junior', range: '1–3 years' },
    { id: 'mid', title: 'Mid-Level', range: '3–6 years' },
    { id: 'senior', title: 'Senior', range: '6–10 years' },
    { id: 'lead', title: 'Lead', range: '10+ years' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

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

  const getCategoryOfSkill = (skill) => {
    for (const [catName, skillList] of Object.entries(techCategories)) {
      if (skillList.includes(skill)) return catName;
    }
    return 'Other';
  };

  const handleTechToggle = (tech) => {
    const currentStack = config.techStack || [];
    if (currentStack.includes(tech)) {
      setSetupConfig({ techStack: currentStack.filter(t => t !== tech) });
    } else {
      const newStack = [...currentStack, tech];
      const selectedCats = new Set(newStack.map(getCategoryOfSkill));
      if (selectedCats.size > 2) {
        pushToast({
          type: 'warning',
          title: 'Category Limit Reached',
          message: 'You can select target skills from at most 2 categories for a focused mock interview.'
        });
        return;
      }
      setSetupConfig({ techStack: newStack });
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

  const handleLaunch = async (overrideClearSkills = false) => {
    const isNonTech = ['behavioral', 'hr', 'rapid', 'mixed'].includes(config.mode);
    const hasSkills = config.techStack && config.techStack.length > 0;

    if (isNonTech && hasSkills && !overrideClearSkills) {
      setShowSkillConflictModal(true);
      return;
    }

    if (overrideClearSkills) {
      setSetupConfig({ techStack: [] });
    }

    const roleName = currentRoleObj.name;
    setIsLaunching(true);
    try {
      await startInterview(roleName);
      navigate('/interview/session');
    } catch (err) {
      pushToast({
        type: 'error',
        title: 'Interview Setup Failed',
        message: err?.message || 'Could not start interview session. Please try again.'
      });
    } finally {
      setIsLaunching(false);
      setShowSkillConflictModal(false);
    }
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  const activeTechCategories = techCategories;

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 md:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10">
      
      {/* Premium Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-light-border dark:border-dark-border">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Simulate Your Next Interview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Configure and launch mock interview sessions tailored to your target role and stack.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN (70%) - Config Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Target Skills */}
          <div className={`p-4 sm:p-6 rounded-2xl border bg-white dark:bg-dark-card border-light-border dark:border-dark-border shadow-sm space-y-5 transition-all ${
            ['behavioral', 'hr', 'rapid', 'mixed'].includes(config.mode) ? 'opacity-85' : ''
          }`}>
            <div className="flex items-center gap-3">
              <span className="h-6 w-6 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-extrabold border border-emerald-500/10">
                1
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  Target Skills
                  {['behavioral', 'hr', 'rapid', 'mixed'].includes(config.mode) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                      Auto-Managed for {modes.find(m => m.id === config.mode)?.title}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {['behavioral', 'hr', 'rapid', 'mixed'].includes(config.mode)
                    ? `Specific technical stack skills are disabled for ${modes.find(m => m.id === config.mode)?.title}. Questions will be generated based on your selected Target Company (${config.companyFocus || 'Amazon'}) and Difficulty (${config.difficulty || 'Medium'}).`
                    : 'Search and toggle the specific skills to test.'}
                </p>
              </div>
            </div>

            {/* Filter input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                Search Skills
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Selected chips representation */}
            {config.techStack?.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Selected Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {config.techStack.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleTechToggle(tech)}
                        className="text-emerald-500 hover:text-emerald-700 font-bold ml-0.5"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {config.techStack.length > 6 && (
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-150 dark:bg-dark-hover/30 px-2 py-0.5 rounded-lg">
                      +{config.techStack.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Flat skill list grouped by category */}
            <div className="space-y-4 pt-2">
              {Object.entries(activeTechCategories).map(([category, items]) => {
                const filteredItems = items.filter(item => item.toLowerCase().includes(techSearch.toLowerCase()));
                if (filteredItems.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-2 pt-2 border-b border-light-border/40 dark:border-dark-border/40 last:border-0 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-1 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                        {category}
                      </span>
                      <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 dark:bg-dark-hover/20 px-1.5 py-0.5 rounded">
                        {filteredItems.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {filteredItems.map((tech) => {
                        const isSelected = (config.techStack || []).includes(tech);
                        return (
                          <button
                            key={tech}
                            onClick={() => handleTechToggle(tech)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all duration-150 ${
                              isSelected 
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' 
                                : 'border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-gray-300 dark:hover:border-gray-700 text-gray-600 dark:text-gray-300'
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
          </div>

          {/* Step 2: Difficulty */}
          <div className="p-4 sm:p-6 rounded-2xl border bg-white dark:bg-dark-card border-light-border dark:border-dark-border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-6 w-6 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-extrabold border border-emerald-500/10">
                2
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                  Session Difficulty
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select target question difficulty (Easy, Medium, or Hard).
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {difficulties.map((diff) => {
                const isSelected = config.difficulty === diff.toLowerCase();
                return (
                  <button
                    key={diff}
                    onClick={() => setSetupConfig({ difficulty: diff.toLowerCase() })}
                    className={`flex-1 min-w-[80px] px-4 py-2.5 rounded-xl border text-center transition-all duration-200 ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold' 
                        : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{diff}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Question Count */}
          <div className="p-4 sm:p-6 rounded-2xl border bg-white dark:bg-dark-card border-light-border dark:border-dark-border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-6 w-6 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-extrabold border border-emerald-500/10">
                3
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                  Question Count
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Determine the length of the mock interview session.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {[3, 5, 10, 15].map((count) => {
                const isSelected = config.questionCount === count;
                return (
                  <button
                    key={count}
                    onClick={() => setSetupConfig({ questionCount: count })}
                    className={`py-2.5 rounded-xl border text-center font-bold text-xs transition-all duration-200 ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' 
                        : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {count} Questions
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Interview Mode */}
          <div className="p-4 sm:p-6 rounded-2xl border bg-white dark:bg-dark-card border-light-border dark:border-dark-border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-6 w-6 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-extrabold border border-emerald-500/10">
                4
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                  Interview Mode
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose mock presentation style.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {modes.map((mode) => {
                const ModeIcon = mode.icon;
                const isSelected = config.mode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSetupConfig({ mode: mode.id })}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 relative ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-500/5' 
                        : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-1.5 rounded-lg border ${
                        isSelected 
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                          : 'border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-400 dark:text-gray-300'
                      }`}>
                        <ModeIcon className="h-4 w-4" />
                      </div>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[11px] text-gray-800 dark:text-gray-200">{mode.title}</h4>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">{mode.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Target Company Focus */}
          <div className="p-4 sm:p-6 rounded-2xl border bg-white dark:bg-dark-card border-light-border dark:border-dark-border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-6 w-6 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-extrabold border border-emerald-500/10">
                5
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                  Target Company Focus
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select target company interview style and engineering scenario context.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <select
                value={config.companyFocus || 'Amazon'}
                onChange={(e) => setSetupConfig({ companyFocus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {['Amazon', 'Google', 'Microsoft', 'Meta', 'Netflix', 'Uber', 'Atlassian', 'General / Tech Startup'].map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">{c}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (30%) - Summary & Sidebar widgets */}
        <div className="space-y-6 lg:sticky lg:top-8">
          
{/* Glass Sticky Summary Card */}
          <div className="p-4 sm:p-6 rounded-3xl border bg-white dark:bg-dark-card border-light-border dark:border-dark-border shadow-sm space-y-6">
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-500" />
                <span>Session Summary</span>
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Confirm your generated parameters below before starting the interview.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-light-border/40 dark:border-dark-border/40 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Target Role</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{currentRoleObj.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Interview Mode</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize flex items-center gap-1.5">
                  {config.mode === 'text' ? <Keyboard className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {config.mode}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Mock Duration</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{getEstimatedDuration()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Score Goal</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">85% minimum</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">AI Adaptivity</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Enabled</span>
              </div>
            </div>

            {/* Launch CTA */}
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 mt-4 ${
                isLaunching ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLaunching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Preparing AI Session...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start AI Interview</span>
                </>
              )}
            </button>

          </div>

          {/* Resume Integration Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
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
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${useResumeSkills ? 'bg-emerald-650' : 'bg-gray-300 dark:bg-dark-border'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${useResumeSkills ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Collapsible Gamification & History Section */}
      <div className="border-t border-light-border dark:border-dark-border pt-8 mt-12">
        <button
          type="button"
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
        >
          <span>{showStats ? 'Hide' : 'Show'} Gamification & Recent Practice Mocks</span>
          <span className="text-[10px]">{showStats ? '▲' : '▼'}</span>
        </button>

        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 transition-all duration-300">
            {/* Daily Streak */}
            <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col justify-between gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Streak</span>
                <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 block">
                  {streakDays} Days
                </span>
                <span className="text-[9px] text-gray-500 font-semibold">Active Practice Daily streak 🔥</span>
              </div>
            </div>

            {/* Level & XP */}
            <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col justify-between gap-3">
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

            {/* Achievements widget */}
            <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Award className="h-4 w-4 text-emerald-500" />
                <span>Earned Achievements</span>
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'First Mock Mocked', desc: 'Finished initial mock simulation.' },
                  { name: '100 Questions Solved', desc: 'Resolved target sandbox evaluations.' },
                  { name: 'Perfect Score 100%', desc: 'Secured exemplary scoring.' }
                ].map((ach, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs border-b border-light-border/40 dark:border-dark-border/40 last:border-b-0 pb-2 last:pb-0">
                    <span className="text-emerald-500 shrink-0 mt-0.5">✦</span>
                    <div className="space-y-0.5">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{ach.name}</span>
                      <p className="text-[9px] text-gray-500 leading-normal">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            {history.length > 0 && (
              <div className="md:col-span-3 space-y-4 mt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Recent Practice Mocks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.slice(0, 2).map((session, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex justify-between items-center gap-4">
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
                          className="text-[9px] font-bold text-emerald-500 hover:underline"
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
        )}
      </div>

      {/* Target Skills Conflict Popup Modal */}
      {showSkillConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Target Skills Selected</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Please unselect target skills for this mode</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-card/50 border border-gray-200 dark:border-dark-border space-y-2">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                You currently have <strong>{config.techStack?.join(', ')}</strong> selected under Target Skills, but you chose <strong>{modes.find(m => m.id === config.mode)?.title || config.mode}</strong>.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Target skills are not used for {modes.find(m => m.id === config.mode)?.title || config.mode} because questions are generated based on your selected <strong>Target Company</strong> and <strong>Difficulty</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleLaunch(true)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="h-4 w-4 fill-white" />
                <span>Clear Skills & Start</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSkillConflictModal(false)}
                className="flex-1 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all text-center border border-gray-200 dark:border-dark-border"
              >
                Unselect Manually
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
