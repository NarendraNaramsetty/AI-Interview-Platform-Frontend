import React, { useEffect, useState, useRef } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  BookOpen, 
  Link as LinkIcon, 
  Cpu, 
  Play, 
  Flame, 
  Trophy, 
  Search, 
  Filter, 
  Send, 
  MessageSquare, 
  ChevronRight, 
  Info, 
  TrendingUp, 
  Award,
  Sparkles,
  Calendar,
  ThumbsUp,
  FileText,
  Clock,
  Check,
  Building,
  Bookmark,
  ChevronDown,
  Layers,
  ListTodo,
  Columns,
  StickyNote,
  Heart,
  ChevronLeft,
  X,
  Target,
  Users,
  AlertTriangle,
  BrainCircuit,
  Settings,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import { roadmap } from '../../services/roadmap';

export default function RoadmapPage() {
  const { theme } = useAuthStore();
  const { pushToast } = useToastStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  // ONBOARDING SETUP FORM STATES
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [targetCompany, setTargetCompany] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [learningStyles, setLearningStyles] = useState(['Practice Problems']);
  const [isGenerating, setIsGenerating] = useState(false);

  // DASHBOARD MANAGEMENT STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, not_started, in_progress, completed
  const [bookmarkFilter, setBookmarkFilter] = useState(false);
  const [sortBy, setSortBy] = useState('order'); // order, difficulty, estimated_time
  const [viewMode, setViewMode] = useState('roadmap'); // roadmap, timeline, kanban, calendar

  // WORKBENCH SIDE PANEL STATE
  const [selectedModule, setSelectedModule] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState('description'); // description, resources, quiz, coding, projects, prep, notes

  // INTERACTIVE WORKBENCH STATE FOR MODULES
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizScoreReport, setQuizScoreReport] = useState(null);
  const [userNotes, setUserNotes] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);

  // AI MENTOR IN MODULE STATE
  const [aiMentorLog, setAiMentorLog] = useState([]);
  const [aiMentorQuery, setAiMentorQuery] = useState('');
  const [aiMentorLoading, setAiMentorLoading] = useState(false);

  const careerOptions = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "React Developer",
    "Node.js Developer", "Java Developer", "Python Developer", "MERN Stack Developer",
    "MEAN Stack Developer", "DevOps Engineer", "Cloud Engineer", "Data Engineer",
    "Data Analyst", "Data Scientist", "AI Engineer", "Machine Learning Engineer",
    "Prompt Engineer", "Android Developer", "Flutter Developer", "Cyber Security Engineer",
    "Software Engineer", "QA Engineer", "System Design Engineer"
  ];

  const companiesList = ['General/Any Company', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Adobe', 'Atlassian', 'Uber', 'Walmart', 'Service Based Company', 'Startup'];

  const learningStyleOptions = ['Reading Documentation', 'Practice Problems', 'Interview Questions'];

  const fetchActiveRoadmap = () => {
    setIsLoading(true);
    roadmap.current()
      .then((res) => {
        if (res && res.success && res.data) {
          setActiveRoadmap(res.data);
        } else {
          setActiveRoadmap(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setActiveRoadmap(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchActiveRoadmap();
  }, []);

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  // 1. GENERATE ROADMAP ROUTINE
  const handleGenerateRoadmap = async () => {
    if (selectedCareers.length === 0) {
      pushToast({ type: 'warning', title: 'Target Role Required', message: 'Please click at least one career role to continue.' });
      return;
    }
    setIsGenerating(true);
    pushToast({ type: 'info', title: 'AI Roadmap Generator', message: 'Synthesizing customized pathway...' });

    const payload = {
      career_track: selectedCareers.join(' & '),
      experience_level: experienceLevel,
      target_company: targetCompany,
      weekly_hours: weeklyHours,
      preferred_learning_style: learningStyles
    };

    try {
      const res = await roadmap.generateAI(payload);
      if (res && res.success) {
        pushToast({ type: 'success', title: 'Curriculum Generated', message: 'Welcome to your AI sandbox path!' });
        fetchActiveRoadmap();
      } else {
        throw new Error(res?.message || 'Server failed to generate roadmap.');
      }
    } catch (err) {
      pushToast({ type: 'error', title: 'AI Generation Failed', message: err.message || 'Check connection settings.' });
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. TOGGLE MODULE COMPLETION
  const handleToggleComplete = async (module) => {
    if (!activeRoadmap) return;
    const currentCompleted = module.is_completed;
    try {
      const res = await roadmap.progress({
        user_roadmap_id: activeRoadmap.id,
        module_id: module.id,
        is_completed: !currentCompleted
      });
      if (res && res.success) {
        if (!currentCompleted) {
          triggerConfetti();
        }
        fetchActiveRoadmap();
        pushToast({ 
          type: 'success', 
          title: !currentCompleted ? 'Topic Completed' : 'Topic Reset', 
          message: !currentCompleted ? 'Unlocked next node! 🟢' : 'Topic status set to not completed.' 
        });
        
        // sync selected module if panel is open
        if (selectedModule && selectedModule.id === module.id) {
          setSelectedModule({ ...selectedModule, is_completed: !currentCompleted });
        }
      }
    } catch (err) {
      pushToast({ type: 'error', title: 'Progress Error', message: 'Could not record module completion.' });
    }
  };

  // 3. TOGGLE BOOKMARK STATUS
  const handleToggleBookmark = async (module) => {
    if (!activeRoadmap) return;
    const currentBookmarked = module.is_bookmarked;
    try {
      const res = await roadmap.progress({
        user_roadmap_id: activeRoadmap.id,
        module_id: module.id,
        is_bookmarked: !currentBookmarked
      });
      if (res && res.success) {
        fetchActiveRoadmap();
        pushToast({ 
          type: 'success', 
          title: !currentBookmarked ? 'Bookmarked' : 'Unbookmarked', 
          message: !currentBookmarked ? 'Added topic to dashboard bookmarks.' : 'Removed from bookmarks.' 
        });
        if (selectedModule && selectedModule.id === module.id) {
          setSelectedModule({ ...selectedModule, is_bookmarked: !currentBookmarked });
        }
      }
    } catch (err) {
      pushToast({ type: 'error', title: 'Action Failed', message: 'Could not bookmark resource.' });
    }
  };

  // 4. AUTOSAVE MODULE STUDY NOTES
  const handleSaveNotes = async (moduleId, notesText) => {
    if (!activeRoadmap) return;
    try {
      const res = await roadmap.progress({
        user_roadmap_id: activeRoadmap.id,
        module_id: moduleId,
        notes: notesText
      });
      if (res && res.success) {
        fetchActiveRoadmap();
        pushToast({ type: 'success', title: 'Notes Saved', message: 'Markdown study notes saved successfully.' });
      }
    } catch (err) {
      pushToast({ type: 'error', title: 'Save Failed', message: 'Could not write notes.' });
    }
  };

  // 5. UPDATE SOLVED CODING QUESTION STATUS
  const handleSolveCodingQuestion = async (moduleId, questionIdx, statusString) => {
    if (!activeRoadmap) return;
    const module = activeRoadmap.roadmap_details.modules.find(m => m.id === moduleId);
    if (!module) return;
    const newStatus = { ...module.coding_status };
    newStatus[questionIdx] = statusString;

    try {
      const res = await roadmap.progress({
        user_roadmap_id: activeRoadmap.id,
        module_id: moduleId,
        coding_status: newStatus
      });
      if (res && res.success) {
        fetchActiveRoadmap();
        pushToast({ type: 'success', title: 'Problem Tracked', message: `Marked question as ${statusString}.` });
        if (selectedModule && selectedModule.id === moduleId) {
          setSelectedModule({ ...selectedModule, coding_status: newStatus });
        }
      }
    } catch (err) {
      pushToast({ type: 'error', title: 'Save Failed', message: 'Could not sync coding progress.' });
    }
  };

  // 6. RECORD QUIZ RESULTS
  const handleSaveQuizScore = async (moduleId, scoreValue) => {
    if (!activeRoadmap) return;
    try {
      const res = await roadmap.progress({
        user_roadmap_id: activeRoadmap.id,
        module_id: moduleId,
        quiz_score: scoreValue
      });
      if (res && res.success) {
        fetchActiveRoadmap();
        if (selectedModule && selectedModule.id === moduleId) {
          setSelectedModule({ ...selectedModule, quiz_score: scoreValue });
        }
      }
    } catch (err) {
      console.error("Failed to save quiz score in DB", err);
    }
  };

  // 7. ASK AI MENTOR INTEGRATION WITHIN MODULES
  const handleAskMentor = async (e) => {
    e.preventDefault();
    if (!aiMentorQuery.trim() || !selectedModule) return;

    const userMessageText = aiMentorQuery;
    setAiMentorLog(prev => [...prev, { sender: 'user', text: userMessageText }]);
    setAiMentorQuery('');
    setAiMentorLoading(true);

    const mentorPrompt = `
You are an expert AI Career Coach.
The user is learning the module "${selectedModule.title}" (Difficulty: ${selectedModule.difficulty}) inside their roadmap.
User Question: "${userMessageText}"

Please provide a helpful, clean explanation or solution outline. Use markdown formatting. Keep the output under 15 lines.
`;

    try {
      const res = await roadmap.mentor({
        module_id: selectedModule.id,
        message: userMessageText
      });
      const reply = res.reply || res.data?.reply || "AI Mentor response compiled.";
      setAiMentorLog(prev => [...prev, { sender: 'mentor', text: reply }]);
    } catch (err) {
      setAiMentorLog(prev => [...prev, { sender: 'mentor', text: "Hello! Caching details, OOP concepts, or complex syntax validation requires sandbox compilations." }]);
    } finally {
      setAiMentorLoading(false);
    }
  };

  const loadQuickPrompt = async (promptType) => {
    if (!selectedModule) return;
    let textPrompt = "";
    switch (promptType) {
      case 'explain':
        textPrompt = `Explain ${selectedModule.title} for a absolute beginner in simple terms.`;
        break;
      case 'interview':
        textPrompt = `Give me the top 3 interview questions asked by top FAANG companies on ${selectedModule.title}.`;
        break;
      case 'flashcards':
        textPrompt = `Generate 3 quick revision flashcards for the topic ${selectedModule.title}.`;
        break;
      case 'project':
        textPrompt = `Generate a unique mini project idea related to ${selectedModule.title}.`;
        break;
      default:
        textPrompt = `Summarize core concepts of ${selectedModule.title}.`;
    }
    setAiMentorQuery(textPrompt);
  };

  // QUIZ LOGIC
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setSelectedAnswers({});
    setQuizScoreReport(null);
  };

  const handleSelectQuizAnswer = (qIdx, optIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = (quizList) => {
    let correctCount = 0;
    quizList.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount++;
      }
    });
    const finalScorePercent = Math.round((correctCount / quizList.length) * 100);
    setQuizScoreReport(finalScorePercent);
    handleSaveQuizScore(selectedModule.id, finalScorePercent);
    if (finalScorePercent >= 70) {
      pushToast({ type: 'success', title: 'Quiz Passed', message: `Awesome job! You scored ${finalScorePercent}%.` });
    } else {
      pushToast({ type: 'warning', title: 'Keep Learning', message: `You scored ${finalScorePercent}%. Review and try again.` });
    }
  };

  // FILTERING AND SORTING MODULES
  const getFilteredModules = () => {
    if (!activeRoadmap || !activeRoadmap.roadmap_details?.modules) return [];
    let list = [...activeRoadmap.roadmap_details.modules];

    // Search query
    if (searchQuery.trim()) {
      list = list.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Difficulty
    if (difficultyFilter !== 'all') {
      list = list.filter(m => m.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    }

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter(m => {
        if (statusFilter === 'completed') return m.is_completed;
        if (statusFilter === 'in_progress') return !m.is_completed && Object.keys(m.coding_status || {}).length > 0;
        if (statusFilter === 'not_started') return !m.is_completed && Object.keys(m.coding_status || {}).length === 0;
        return true;
      });
    }

    // Bookmarks
    if (bookmarkFilter) {
      list = list.filter(m => m.is_bookmarked);
    }

    // Sorting
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
      list.sort((a, b) => (difficultyOrder[a.difficulty.toLowerCase()] || 2) - (difficultyOrder[b.difficulty.toLowerCase()] || 2));
    } else if (sortBy === 'estimated_time') {
      list.sort((a, b) => a.estimated_hours - b.estimated_hours);
    } else {
      list.sort((a, b) => a.module_order - b.module_order);
    }

    return list;
  };

  // RENDER SELECTION CHIP
  const toggleCareerSelection = (role) => {
    if (selectedCareers.includes(role)) {
      setSelectedCareers(selectedCareers.filter(r => r !== role));
    } else {
      setSelectedCareers([...selectedCareers, role]);
    }
  };

  const toggleLearningStyle = (style) => {
    if (learningStyles.includes(style)) {
      setLearningStyles(learningStyles.filter(s => s !== style));
    } else {
      setLearningStyles([...learningStyles, style]);
    }
  };

  // STATS DETAILS CALCULATORS
  const getDashboardMetrics = () => {
    if (!activeRoadmap) return { percent: 0, completed: 0, total: 0, hours: 0, confidence: 50 };
    const modules = activeRoadmap.roadmap_details?.modules || [];
    const total = modules.length;
    const completed = modules.filter(m => m.is_completed).length;
    const hours = modules.reduce((acc, curr) => acc + (curr.is_completed ? curr.estimated_hours : 0), 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Dynamically calculate Readiness Score
    // Includes modules completed, plus quiz scores, plus coding questions status
    let scoreSum = 0;
    modules.forEach(m => {
      if (m.is_completed) scoreSum += 30;
      if (m.quiz_score !== null) {
        scoreSum += m.quiz_score * 0.4;
      }
      const solvedCount = Object.values(m.coding_status || {}).filter(s => s === 'solved').length;
      scoreSum += solvedCount * 10;
    });
    const confidence = total > 0 ? Math.min(100, Math.max(10, Math.round((scoreSum / (total * 45)) * 100))) : 40;

    return { percent, completed, total, hours, confidence };
  };

  const metrics = getDashboardMetrics();

  const handleOpenPanel = (module) => {
    setSelectedModule(module);
    setUserNotes(module.notes || '');
    setQuizStarted(false);
    setQuizScoreReport(null);
    setAiMentorLog([
      { sender: 'mentor', text: `Hi! I am your AI Coach for ${module.title}. Ask me to explain concepts, suggest coding templates, or build revision flashcards!` }
    ]);
    setIsPanelOpen(true);
    setPanelTab('description');
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-xl' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
      
      {/* Dynamic Celebration Overlay */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-transparent">
          <div className="text-center bg-white dark:bg-dark-card p-6 rounded-3xl border border-indigo-500 shadow-2xl scale-up animate-pulse">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-2 animate-bounce" />
            <h2 className="text-xl font-display font-extrabold text-indigo-500 uppercase tracking-widest">Milestone Achieved!</h2>
            <p className="text-xs text-gray-500 mt-1">Next curriculum module unlocked successfully!</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-gray-400">Loading career curriculum...</p>
        </div>
      ) : !activeRoadmap ? (
        
        // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // SETUP LANDING PAGE (Onboarding Form)
        // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          
          <div className="text-center">
            <h1 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight py-2 animate-pulse">
              Create Your Personalized AI Learning Roadmap
            </h1>
          </div>

          <div className={`p-8 rounded-3xl border ${cardStyle} space-y-8`}>
            
            {/* Step 1: Career track roles */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                1. What do you want to become? (Select one or more roles)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {careerOptions.map((role) => {
                  const isSelected = selectedCareers.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleCareerSelection(role)}
                      className={`text-[11px] px-3.5 py-2.5 rounded-2xl border font-bold text-left transition-all duration-200 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' 
                          : 'border-light-border dark:border-dark-border hover:border-gray-500/30 text-gray-600 dark:text-gray-400 bg-light-hover/10 dark:bg-dark-hover/5'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Experience Tier and Target Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                  2. Experience Level
                </label>
                <div className="flex border border-light-border dark:border-dark-border rounded-2xl overflow-hidden text-xs">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`flex-1 py-3 font-bold transition-all ${experienceLevel === lvl ? 'bg-indigo-600 text-white' : 'bg-light-hover/30 dark:bg-dark-hover/10 text-gray-500'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                  3. Target Company (Optional)
                </label>
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 text-xs text-gray-700 dark:text-gray-200 focus:outline-none"
                >
                  <option value="">No Target Company</option>
                  {companiesList.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Step 3: Hours commitments */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                  4. Weekly Study Commitment
                </label>
                <span className="text-xs font-bold text-indigo-500">{weeklyHours} Hours / Week</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>5 Hours</span>
                <span>25 Hours</span>
                <span>50 Hours</span>
              </div>
            </div>

            {/* Step 4: Learning styles */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                5. Preferred Learning Styles
              </label>
              <div className="grid grid-cols-2 gap-3">
                {learningStyleOptions.map((style) => {
                  const isSelected = learningStyles.includes(style);
                  return (
                    <label key={style} className="flex items-center gap-3 p-3.5 rounded-xl border border-light-border dark:border-dark-border hover:bg-light-hover/20 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleLearningStyle(style)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span className="text-gray-600 dark:text-gray-300 font-semibold">{style}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit onboarding CTA */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateRoadmap}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4.5 rounded-2xl text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                  <span>Synthesizing AI Roadmap Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 fill-white text-white" />
                  <span>Generate AI Roadmap</span>
                </>
              )}
            </button>

          </div>

        </div>
      ) : (
        
        // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // ACTIVE LEARNING CURRICULUM DASHBOARD
        // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        <div className="space-y-8 animate-slide-up">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-light-border dark:border-dark-border">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
                  AI-Driven Pathway
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Interactive Curriculum
                </span>
              </div>
              <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                {activeRoadmap.roadmap_title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeRoadmap.roadmap_details?.description || 'Your custom roadmap roadmap syllabus details.'}
              </p>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this custom roadmap? Your learning history, notes, and quiz details will be lost forever.")) {
                  roadmap.pause({ roadmap_id: activeRoadmap.roadmap }).then(() => fetchActiveRoadmap());
                }
              }}
              className="text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500/5 px-4.5 py-2.5 rounded-2xl transition-all"
            >
              Reset Roadmap Setup
            </button>
          </div>

          {/* 1. PROGRESS ANALYTICS CARD GRID (Step 6) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className={`p-5 rounded-2xl ${cardStyle} space-y-3`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overall Progress</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white block">{metrics.percent}%</span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.percent}%` }} />
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl ${cardStyle} space-y-3`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl">
                  <Flame className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Topics Finished</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white block">{metrics.completed} / {metrics.total}</span>
                <span className="text-[10px] text-gray-400 block">{metrics.total - metrics.completed} remaining nodes</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl ${cardStyle} space-y-3`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Learning Hours</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white block">{metrics.hours} Hours</span>
                <span className="text-[10px] text-gray-400 block">Estimated commitment time</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl ${cardStyle} space-y-3`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Readiness Score</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white block">{metrics.confidence}% Readiness</span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.confidence}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* 2. VIEWS AND FILTERS ROW (Step 7 & 8) */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white/70 dark:bg-dark-card/50 p-4 rounded-3xl border border-light-border dark:border-dark-border">
            
            <div className="flex items-center gap-2 border-r border-light-border dark:border-dark-border pr-4 w-full lg:w-auto">
              <span className="text-xs font-bold text-gray-400">View:</span>
              <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl gap-1 text-[11px]">
                {[
                  { id: 'roadmap', label: 'Cards Grid', icon: Layers },
                  { id: 'timeline', label: 'Timeline', icon: Calendar },
                  { id: 'kanban', label: 'Kanban Board', icon: Columns }
                ].map(view => {
                  const IconComp = view.icon;
                  return (
                    <button
                      key={view.id}
                      onClick={() => setViewMode(view.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${viewMode === view.id ? 'bg-white dark:bg-dark-card text-indigo-500 shadow-sm border border-light-border/40 dark:border-dark-border/40' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <IconComp className="h-3.5 w-3.5" />
                      <span>{view.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter inputs */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px] lg:flex-initial">
                <Search className="absolute left-3 top-2 text-gray-400 h-3.5 w-3.5" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900 focus:outline-none"
                />
              </div>

              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-gray-600 dark:text-gray-300"
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Difficulty Select */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-gray-600 dark:text-gray-300"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              {/* Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-gray-600 dark:text-gray-300"
              >
                <option value="order">Chronological Order</option>
                <option value="difficulty">Difficulty Level</option>
                <option value="estimated_time">Estimated Time</option>
              </select>

              {/* Bookmarks toggle */}
              <button
                onClick={() => setBookmarkFilter(!bookmarkFilter)}
                className={`p-2 rounded-xl border transition-all ${bookmarkFilter ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-light-border dark:border-dark-border text-gray-400 hover:text-gray-700'}`}
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>

            </div>

          </div>

          {/* 3. SWITCH RENDER VIEWS */}
          {getFilteredModules().length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${cardStyle} text-xs text-gray-500`}>
              No matching modules found for your query. Try clearing search filters.
            </div>
          ) : viewMode === 'roadmap' ? (
            
            // --- GRIDS VIEW (Step 4 & 5) ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredModules().map((m) => {
                const codingSolvedCount = Object.values(m.coding_status || {}).filter(s => s === 'solved').length;
                const codingTotal = m.coding_questions_data?.length || 0;
                const hasStarted = m.is_completed || codingSolvedCount > 0 || m.quiz_score !== null;
                
                return (
                  <div
                    key={m.id}
                    className={`p-6 rounded-3xl border flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-lg relative overflow-hidden group ${
                      m.is_completed
                        ? 'border-emerald-500/25 bg-emerald-500/[0.02]'
                        : hasStarted
                        ? 'border-indigo-500/25 bg-indigo-500/[0.02]'
                        : 'border-light-border dark:border-dark-border hover:bg-light-hover/30'
                    }`}
                  >
                    {/* Status accent stripe */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${m.is_completed ? 'bg-emerald-500' : hasStarted ? 'bg-amber-500' : 'bg-slate-200 dark:bg-dark-border'}`} />

                    <div className="space-y-4">
                      {/* Badge / Difficulty header */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                          m.difficulty.toLowerCase() === 'beginner' 
                            ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10'
                            : m.difficulty.toLowerCase() === 'intermediate'
                            ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/10'
                            : 'text-rose-500 bg-rose-500/10 border-rose-500/10'
                        }`}>
                          {m.difficulty}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleBookmark(m)}
                            className={`p-1 rounded-full text-xs hover:scale-105 transition-all ${m.is_bookmarked ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}
                          >
                            <Heart className="h-4.5 w-4.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Info */}
                      <div className="space-y-1.5">
                        <h4 className="font-display font-extrabold text-base text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors line-clamp-1">
                          {m.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      {/* Progress summary bar */}
                      <div className="space-y-1 border-t border-dashed border-light-border/40 dark:border-dark-border/40 pt-3">
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                          <span>Progress</span>
                          <span>{m.is_completed ? '100%' : codingTotal > 0 ? `${Math.round((codingSolvedCount / codingTotal) * 100)}%` : '0%'}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${m.is_completed ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: m.is_completed ? '100%' : codingTotal > 0 ? `${(codingSolvedCount / codingTotal) * 100}%` : '0%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA actions */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenPanel(m)}
                          className="px-3.5 py-2 text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded-xl transition-all"
                        >
                          Learn & Practice
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleComplete(m)}
                        className={`p-2 rounded-xl text-xs flex items-center justify-center border transition-all ${
                          m.is_completed
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                            : 'border-light-border dark:border-dark-border text-gray-400 hover:text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Check className="h-4.5 w-4.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : viewMode === 'timeline' ? (
            
            // --- TIMELINE STEPPER VIEW (Step 7) ---
            <div className={`p-8 rounded-3xl border ${cardStyle} relative pl-12 md:pl-16 space-y-12 border-l-2 border-indigo-500/20 ml-6`}>
              {getFilteredModules().map((m, idx) => {
                return (
                  <div key={m.id} className="relative group space-y-3">
                    
                    {/* Node stepper */}
                    <span className="absolute -left-[53px] md:-left-[69px] top-1.5 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-full p-1 z-10 hover:scale-110 transition-transform">
                      <button
                        onClick={() => handleToggleComplete(m)}
                        className={`h-7 w-7 rounded-full flex items-center justify-center font-display font-extrabold text-xs transition-all ${
                          m.is_completed 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                        }`}
                      >
                        {m.is_completed ? <Check className="h-4 w-4" /> : m.module_order}
                      </button>
                    </span>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="font-display font-extrabold text-lg text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors">
                          {m.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xl">
                          {m.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          ⏱ {m.estimated_hours} Hours
                        </span>
                        <button
                          onClick={() => handleOpenPanel(m)}
                          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm shadow-indigo-600/10"
                        >
                          Details & Panel
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            
            // --- KANBAN BOARD VIEW (Step 7) ---
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Not Started */}
              <div className={`p-5 rounded-3xl border ${cardStyle} space-y-4`}>
                <h4 className="font-display font-bold text-sm text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Circle className="h-4 w-4 text-slate-400" />
                  <span>Not Started ({getFilteredModules().filter(m => !m.is_completed && Object.keys(m.coding_status || {}).length === 0).length})</span>
                </h4>
                <div className="space-y-3">
                  {getFilteredModules().filter(m => !m.is_completed && Object.keys(m.coding_status || {}).length === 0).map(m => (
                    <div key={m.id} className="p-4 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60 space-y-2 hover:border-gray-400 transition-colors">
                      <span className="text-[9px] uppercase font-extrabold text-gray-400">{m.difficulty}</span>
                      <h5 className="font-bold text-xs leading-relaxed text-gray-900 dark:text-gray-100">{m.title}</h5>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-gray-500">⏱ {m.estimated_hours} Hours</span>
                        <button onClick={() => handleOpenPanel(m)} className="text-[10px] font-bold text-indigo-500 hover:underline">Start Path</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className={`p-5 rounded-3xl border ${cardStyle} space-y-4`}>
                <h4 className="font-display font-bold text-sm text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>In Progress ({getFilteredModules().filter(m => !m.is_completed && Object.keys(m.coding_status || {}).length > 0).length})</span>
                </h4>
                <div className="space-y-3">
                  {getFilteredModules().filter(m => !m.is_completed && Object.keys(m.coding_status || {}).length > 0).map(m => (
                    <div key={m.id} className="p-4 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60 space-y-2 hover:border-gray-400 transition-colors">
                      <span className="text-[9px] uppercase font-extrabold text-amber-500">{m.difficulty}</span>
                      <h5 className="font-bold text-xs leading-relaxed text-gray-900 dark:text-gray-100">{m.title}</h5>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-gray-500">⏱ {m.estimated_hours} Hours</span>
                        <button onClick={() => handleOpenPanel(m)} className="text-[10px] font-bold text-indigo-500 hover:underline">Resume</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className={`p-5 rounded-3xl border ${cardStyle} space-y-4`}>
                <h4 className="font-display font-bold text-sm text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Completed ({getFilteredModules().filter(m => m.is_completed).length})</span>
                </h4>
                <div className="space-y-3">
                  {getFilteredModules().filter(m => m.is_completed).map(m => (
                    <div key={m.id} className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] space-y-2 hover:border-emerald-400 transition-colors">
                      <span className="text-[9px] uppercase font-extrabold text-emerald-500">{m.difficulty}</span>
                      <h5 className="font-bold text-xs leading-relaxed text-gray-900 dark:text-gray-100">{m.title}</h5>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-gray-500">⏱ {m.estimated_hours} Hours</span>
                        <button onClick={() => handleOpenPanel(m)} className="text-[10px] font-bold text-indigo-500 hover:underline">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      // SLIDING DETAIL DRAWER (Step 9)
      // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {isPanelOpen && selectedModule && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white dark:bg-dark-card border-l border-light-border dark:border-dark-border h-full flex flex-col justify-between animate-slide-left shadow-2xl relative">
            
            {/* Panel Header */}
            <div className="p-6 border-b border-light-border dark:border-dark-border flex justify-between items-start">
              <div className="space-y-1 pr-6">
                <span className="text-[9px] uppercase font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">
                  {selectedModule.difficulty} • M{selectedModule.module_order}
                </span>
                <h3 className="text-xl font-display font-extrabold text-gray-900 dark:text-gray-100">
                  {selectedModule.title}
                </h3>
              </div>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-1.5 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/40 text-xs px-6 gap-4">
              {[
                { id: 'description', label: 'Overview', icon: BookOpen },
                { id: 'resources', label: 'Study Resources', icon: LinkIcon },
                { id: 'quiz', label: 'Quiz Assessment', icon: HelpCircle },
                { id: 'coding', label: 'Practice Problems', icon: Cpu },
                { id: 'projects', label: 'Mini Project', icon: ListTodo },
                { id: 'prep', label: 'Interview Questions', icon: Target },
                { id: 'notes', label: 'Syllabus Notes', icon: StickyNote }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPanelTab(tab.id)}
                  className={`py-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${panelTab === tab.id ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Panel Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tab 1: Description */}
              {panelTab === 'description' && (
                <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Description & Objectives:</h4>
                    <p>{selectedModule.description}</p>
                  </div>

                  {selectedModule.prerequisites && (
                    <div className="p-4 rounded-2xl border border-dashed border-indigo-500/20 bg-indigo-500/5 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Prerequisites Required:</span>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{selectedModule.prerequisites}</p>
                    </div>
                  )}

                  {/* Dynamic AI Summary */}
                  <div className="p-4.5 rounded-2xl border border-light-border dark:border-dark-border bg-gradient-to-br from-indigo-500/5 to-violet-500/5 space-y-2">
                    <h5 className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      <BrainCircuit className="h-4.5 w-4.5 text-indigo-500" />
                      <span>AI Mentorial Summary</span>
                    </h5>
                    <p className="text-xs leading-relaxed text-gray-500">
                      This curriculum block acts as a gateway for intermediate tasks. Expect standard scenario queries matching the target role tier. Check interview guidelines to optimize prep answers.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Resources */}
              {panelTab === 'resources' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Recommended Reference Resources</h4>
                  <div className="space-y-3">
                    {selectedModule.resources?.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60 hover:border-indigo-500/40 transition-colors flex justify-between items-center group block"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-indigo-500">{res.resource_type} • {res.provider}</span>
                          <h5 className="font-bold text-xs text-gray-800 dark:text-gray-200 group-hover:text-indigo-500 transition-colors">{res.title}</h5>
                          {res.duration > 0 && <span className="text-[10px] text-gray-400">{res.duration} mins watch time</span>}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Quiz Assessment (Step 12) */}
              {panelTab === 'quiz' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-4 border-light-border dark:border-dark-border">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">AI Quiz Assessment</h4>
                    {selectedModule.quiz_score !== null && (
                      <span className="text-xs font-bold text-emerald-500">Best Score: {selectedModule.quiz_score}%</span>
                    )}
                  </div>

                  {!quizStarted ? (
                    <div className="text-center py-12 space-y-4">
                      <HelpCircle className="h-12 w-12 text-indigo-500 mx-auto animate-pulse" />
                      <div className="space-y-1">
                        <h5 className="font-bold text-sm">Test Your Skill Readiness</h5>
                        <p className="text-xs text-gray-500">Complete this 3-question MCQ quiz to validate your subject comprehension.</p>
                      </div>
                      <button
                        onClick={handleStartQuiz}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all"
                      >
                        Start Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedModule.quiz_data?.map((q, qIdx) => (
                        <div key={qIdx} className="space-y-3 p-5 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60">
                          <h5 className="font-bold text-xs leading-relaxed text-gray-800 dark:text-gray-100">
                            {qIdx + 1}. {q.text}
                          </h5>
                          <div className="grid grid-cols-1 gap-2">
                            {q.options?.map((opt, optIdx) => {
                              const isSelected = selectedAnswers[qIdx] === optIdx;
                              const isCorrect = q.correct === optIdx;
                              const showResults = quizScoreReport !== null;

                              return (
                                <button
                                  key={optIdx}
                                  disabled={showResults}
                                  onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                                    showResults
                                      ? isCorrect
                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                                        : isSelected
                                        ? 'bg-rose-500/10 border-rose-500 text-rose-600'
                                        : 'border-light-border dark:border-dark-border'
                                      : isSelected
                                      ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 shadow-sm'
                                      : 'border-light-border dark:border-dark-border hover:bg-light-hover'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {quizScoreReport === null ? (
                        <button
                          onClick={() => handleSubmitQuiz(selectedModule.quiz_data)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition-all"
                        >
                          Submit Quiz Answers
                        </button>
                      ) : (
                        <div className="space-y-4 text-center">
                          <div className="text-xl font-bold">
                            You scored: <span className={quizScoreReport >= 70 ? 'text-emerald-500' : 'text-rose-500'}>{quizScoreReport}%</span>
                          </div>
                          <button
                            onClick={handleStartQuiz}
                            className="px-6 py-2 border border-light-border dark:border-dark-border hover:bg-light-hover rounded-xl text-xs font-semibold text-gray-500"
                          >
                            Retry Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* Tab 4: Coding Challenges (Step 11) */}
              {panelTab === 'coding' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Dynamic Coding Challenges</h4>
                  <div className="space-y-3">
                    {selectedModule.coding_questions_data?.map((q, idx) => {
                      const status = selectedModule.coding_status?.[idx] || 'todo';
                      return (
                        <div key={idx} className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60 space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">{q.difficulty}</span>
                              <h5 className="font-bold text-xs text-gray-800 dark:text-gray-100">{q.title}</h5>
                            </div>
                            <select
                              value={status}
                              onChange={(e) => handleSolveCodingQuestion(selectedModule.id, idx, e.target.value)}
                              className="px-2 py-1 rounded border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-[10px] font-bold text-gray-600 dark:text-gray-300"
                            >
                              <option value="todo">Todo</option>
                              <option value="solved">Solved</option>
                              <option value="retry">Needs Retry</option>
                            </select>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{q.description}</p>
                          <div className="flex gap-4 text-[10px] text-gray-400 pt-2 border-t border-light-border/40 dark:border-dark-border/40">
                            <span>Time: <strong className="text-slate-500">{q.time_complexity}</strong></span>
                            <span>Space: <strong className="text-slate-500">{q.space_complexity}</strong></span>
                            {q.companies?.length > 0 && <span>Companies: <strong className="text-indigo-400">{q.companies.join(', ')}</strong></span>}
                          </div>
                          
                          {/* Solution details */}
                          <div className="space-y-1 pt-2">
                            <span className="text-[10px] font-bold text-gray-400 block">AI Recommended Solution:</span>
                            <pre className="p-3 bg-gray-900 text-gray-300 rounded-lg text-[10px] overflow-x-auto whitespace-pre font-mono">
                              {q.solution}
                            </pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 5: Mini Projects (Step 13) */}
              {panelTab === 'projects' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Subject Mini Projects</h4>
                  <div className="space-y-3">
                    {selectedModule.projects_data?.map((p, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">{p.difficulty} • ⏱ {p.estimated_hours} Hours</span>
                          <h5 className="font-bold text-xs text-gray-800 dark:text-gray-100">{p.title}</h5>
                        </div>
                        <div className="space-y-2 text-xs text-gray-500">
                          <span className="font-bold text-gray-400 block">Skills Covered:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {p.skills_covered?.map(s => <span key={s} className="bg-slate-200 dark:bg-dark-border text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-[9px] font-bold">{s}</span>)}
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-gray-500 border-t border-light-border/40 dark:border-dark-border/40 pt-3">
                          <span className="font-bold text-gray-400 block">GitHub Milestones Checklist:</span>
                          <ul className="list-disc pl-5 space-y-1">
                            {p.github_checklist?.map(checkItem => <li key={checkItem}>{checkItem}</li>)}
                          </ul>
                        </div>

                        <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-1 text-xs leading-relaxed text-indigo-600 dark:text-indigo-400">
                          <span className="font-bold block">Deployment & Review Instructions:</span>
                          <p>{p.deployment_guide}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: Interview Preparation (Step 14) */}
              {panelTab === 'prep' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Common Interview Questions</h4>
                  <div className="space-y-3">
                    {selectedModule.interview_questions_data?.map((q, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60 space-y-2">
                        <span className="text-[9px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{q.type} Question</span>
                        <h5 className="font-bold text-xs text-gray-800 dark:text-gray-100">{q.question}</h5>
                        <div className="p-3.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs text-gray-650 dark:text-gray-300 leading-relaxed pt-2">
                          <strong className="text-gray-400 dark:text-gray-500 font-bold block mb-1">Answer Guideline:</strong>
                          {q.answer_guideline}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 7: Notes (Step 15) */}
              {panelTab === 'notes' && (
                <div className="space-y-4 flex flex-col h-full">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Study Notes & Cheat Sheets</h4>
                  <p className="text-[11px] text-gray-500">Record formulas, logic outlines, or deployment links below. Content is auto-saved.</p>
                  
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Write your study notes here..."
                    className="w-full flex-1 min-h-[300px] p-4 rounded-2xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    onClick={() => handleSaveNotes(selectedModule.id, userNotes)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm shadow-indigo-600/10"
                  >
                    Save Notes
                  </button>
                </div>
              )}

            </div>

            {/* Ask AI Mentor Side Overlay (Step 10) */}
            <div className="p-6 border-t border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/60 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-500 flex items-center gap-1">
                  <BrainCircuit className="h-4.5 w-4.5 text-indigo-500" />
                  <span>AI Mentor Chat Integration</span>
                </span>
                
                {/* AI quick options */}
                <div className="flex gap-1.5 text-[9px] font-bold text-gray-400">
                  <button onClick={() => loadQuickPrompt('explain')} className="hover:text-indigo-500">Explain</button>
                  <span>•</span>
                  <button onClick={() => loadQuickPrompt('interview')} className="hover:text-indigo-500">FAANG Qs</button>
                  <span>•</span>
                  <button onClick={() => loadQuickPrompt('flashcards')} className="hover:text-indigo-500">Flashcards</button>
                  <span>•</span>
                  <button onClick={() => loadQuickPrompt('project')} className="hover:text-indigo-500">Project</button>
                </div>
              </div>

              {/* Chat log */}
              <div className="max-h-36 overflow-y-auto space-y-2 text-xs border border-light-border dark:border-dark-border p-3 bg-white dark:bg-dark-card rounded-xl">
                {aiMentorLog.map((log, idx) => (
                  <div key={idx} className={`p-2 rounded-lg leading-relaxed ${log.sender === 'user' ? 'bg-indigo-500/10 text-indigo-600 text-right font-bold ml-12' : 'bg-slate-100 dark:bg-dark-bg text-gray-600 dark:text-gray-300 mr-12'}`}>
                    {log.text}
                  </div>
                ))}
                {aiMentorLoading && <div className="text-[10px] text-gray-400 animate-pulse">AI mentor is thinking...</div>}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskMentor} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask career mentor: 'Explain arrays complexity'..."
                  value={aiMentorQuery}
                  onChange={(e) => setAiMentorQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={aiMentorLoading}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs transition-all disabled:opacity-50"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
