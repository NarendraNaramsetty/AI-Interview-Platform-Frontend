import React, { useEffect, useState } from 'react';
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
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { roadmap } from '../services/roadmap';

export default function RoadmapPage() {
  const [activeTrack, setActiveTrack] = useState('backend');
  const [tracks, setTracks] = useState({ frontend: null, backend: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all, completed, bookmarked
  const [isLoading, setIsLoading] = useState(true);

  // Chatbot mentor variables
  const [chatQuery, setChatQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'mentor', text: "Hello! I am your AI Career Mentor. Let's get you ready for your target interview. Ask me anything about your current pathway!" }
  ]);

  // Quiz Modal Variables
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [aiQuizQuestions, setAiQuizQuestions] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [dashboardStats, setDashboardStats] = useState({
    problems_solved: 95,
    current_streak: 14,
    hours_learned: 42,
    mock_interviews: 12,
    readiness_score: 82,
    top_skills: ['Python', 'REST APIs', 'SQL', 'JWT'],
    weak_skills: ['Docker', 'Redis', 'Caching', 'System Design']
  });

  useEffect(() => {
    setIsLoading(true);
    roadmap.list().then((data) => {
      setIsLoading(false);
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setTracks((prev) => ({ ...prev, ...data }));
      }
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const toggleSubtopic = (trackId, milestoneIdx, subtopicIdx) => {
    // Optimistically toggle frontend
    const updated = { ...tracks };
    const track = updated[trackId];
    if (track && track.milestones) {
      const sub = track.milestones[milestoneIdx].subtopics[subtopicIdx];
      sub.completed = !sub.completed;
      setTracks(updated);
      
      roadmap.progress({
        user_roadmap_id: track.id || trackId,
        module_id: `${milestoneIdx}-${subtopicIdx}`,
        is_completed: sub.completed,
        notes: ''
      }).catch(() => {
        // Fallback on failure
      });
    }
  };

  const getProgress = (trackId) => {
    const track = tracks[trackId];
    if (!track || !track.milestones) return 0;
    let total = 0;
    let completed = 0;
    track.milestones.forEach((m) => {
      m.subtopics.forEach((s) => {
        total++;
        if (s.completed) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const handleAskMentor = (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMsg = chatQuery;
    setChatLog((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatQuery('');

    // Simulated response using keyword triggers to match the roadmap theme
    setTimeout(() => {
      let reply = "That is a vital focus area. Let's make sure you practice the coding sandbox assignments for this module.";
      const queryLower = userMsg.toLowerCase();
      if (queryLower.includes('jwt')) {
        reply = "JWT (JSON Web Token) consists of a Header, Payload, and Signature. It is stateless, which means the backend doesn't store active tokens in database tables, saving disk overhead.";
      } else if (queryLower.includes('explain') || queryLower.includes('what is')) {
        reply = "Let me summarize that concept. It is evaluated during system reviews for caching logic, auth tokens, database indexes, and network latency optimizations.";
      } else if (queryLower.includes('quiz') || queryLower.includes('quiz me')) {
        reply = "I have loaded 5 rapid multiple-choice questions for you. Select a node in the roadmap skill tree to begin the revision test!";
      } else if (queryLower.includes('docker')) {
        reply = "Docker packages code and its configurations into container instances. This ensures your microservices build identically on Vercel, Render, or cloud environments.";
      } else if (queryLower.includes('redis')) {
        reply = "Redis is an in-memory key-value dictionary. It is highly optimized for caching session states, throttle endpoints, and rate-limiting payloads.";
      }
      setChatLog((prev) => [...prev, { sender: 'mentor', text: reply }]);
    }, 1000);
  };

  const handleStartQuiz = (subtopic) => {
    const mockQuestions = [
      { id: 1, text: `What is the primary architectural purpose of ${subtopic.title}?`, options: ['Maximize database schema storage', 'Implement secure latency reduction', 'Increase thread overhead', 'Configure file downloads'], correct: 1 },
      { id: 2, text: `Which performance tradeoff is typical when caching with ${subtopic.title}?`, options: ['Memory utilization vs speed', 'CPU latency vs package size', 'Network headers volume', 'CORS whitelisting latency'], correct: 0 }
    ];
    setAiQuizQuestions(mockQuestions);
    setQuizScore(null);
    setSelectedAnswers({});
  };

  const handleAnswerSelect = (questionId, optionIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIdx });
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    aiQuizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) score += 50;
    });
    setQuizScore(score);
    pushToast({ type: 'success', title: 'Quiz Completed', message: `You scored ${score}% on the AI assessment.` });
  };

  const fallbackMilestones = [
    {
      title: 'Programming Foundations',
      subtopics: [
        { id: '1', title: 'Python Syntax & OOP Concepts', completed: true },
        { id: '2', title: 'Data Structures: Arrays, HashMaps', completed: true },
        { id: '3', title: 'Algorithms: Sorting, Binary Search', completed: false }
      ]
    },
    {
      title: 'Web Application Architectures',
      subtopics: [
        { id: '4', title: 'REST API Design & Endpoints', completed: false },
        { id: '5', title: 'Stateless JWT & Refresh Tokens', completed: false },
        { id: '6', title: 'Database Indexing & PostgreSQL', completed: false }
      ]
    },
    {
      title: 'Caching & Scaling Systems',
      subtopics: [
        { id: '7', title: 'Redis Caching & Invalidation', completed: false },
        { id: '8', title: 'Docker Containers & Portability', completed: false },
        { id: '9', title: 'System Design: Scaling, Latency', completed: false }
      ]
    }
  ];

  const currentTrack = tracks[activeTrack] || { 
    id: activeTrack, 
    title: activeTrack === 'backend' ? 'Backend Developer Path' : 'Frontend Developer Path', 
    description: 'Targeted preparation roadmaps.', 
    milestones: fallbackMilestones, 
    resources: [
      { title: 'Official Python Docs', link: 'https://docs.python.org/' },
      { title: 'Django Authentication Guide', link: 'https://docs.djangoproject.com/' }
    ] 
  };

  const progressPercent = getProgress(activeTrack) || 40;

  // Filter subtopics based on search and filters
  const filteredMilestones = currentTrack.milestones.map((m, mIdx) => {
    const filteredSubs = m.subtopics.map((s, sIdx) => ({ ...s, originalIdx: sIdx })).filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterMode === 'all' || 
        (filterMode === 'completed' && s.completed) || 
        (filterMode === 'incomplete' && !s.completed);
      return matchesSearch && matchesFilter;
    });
    return { ...m, subtopics: filteredSubs, originalMIdx: mIdx };
  }).filter(m => m.subtopics.length > 0);

  const cardStyle = 'bg-white dark:bg-dark-card border border-light-border dark:border-dark-border text-gray-800 dark:text-gray-200 shadow-sm';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
      
      {/* 1. HERO LEARNING HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-6 border-b border-light-border dark:border-dark-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              AI-Powered Pathway
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Mentor Online
            </span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-gray-100">
            Ready to become a {activeTrack === 'backend' ? 'Backend' : 'Frontend'} Engineer?
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Welcome back! You have <strong>3 Weeks Remaining</strong> to reach 100% target interview readiness.
          </p>
        </div>

        {/* Pathway selection */}
        <div className="flex gap-2 bg-light-hover dark:bg-dark-hover p-1.5 rounded-xl border border-light-border dark:border-dark-border">
          <button
            onClick={() => setActiveTrack('frontend')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTrack === 'frontend'
                ? 'bg-white dark:bg-dark-card text-indigo-500 shadow-sm border border-light-border dark:border-dark-border'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Frontend Track
          </button>
          <button
            onClick={() => setActiveTrack('backend')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTrack === 'backend'
                ? 'bg-white dark:bg-dark-card text-indigo-500 shadow-sm border border-light-border dark:border-dark-border'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Backend Track
          </button>
        </div>
      </div>

      {/* 2. PROGRESS OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className={`p-5 rounded-2xl ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Completion</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">{progressPercent}%</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Streak</span>
            <span className="text-lg font-extrabold text-orange-500">14 Days 🔥</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Learning Hours</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">42 Hours</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Readiness score</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">82% Score</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Roadmap Skill tree and controls (70%) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Filters and search panel */}
          <div className={`p-5 rounded-2xl ${cardStyle} flex flex-col sm:flex-row gap-4 items-center justify-between`}>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search technologies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 text-xs focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {['all', 'completed', 'incomplete'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`text-[10px] uppercase font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    filterMode === mode 
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400' 
                      : 'border-light-border dark:border-dark-border text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Tree Roadmap */}
          <div className={`p-6 rounded-2xl ${cardStyle} space-y-8`}>
            <div className="flex justify-between items-center border-b pb-4 border-light-border dark:border-dark-border">
              <h3 className="font-display font-bold text-lg">Interactive Skill Roadmap</h3>
              <span className="text-xs text-gray-500">Click topics to inspect resources, quizzes, and ask questions.</span>
            </div>

            {filteredMilestones.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No matching milestones found for current query.
              </div>
            ) : (
              <div className="relative pl-6 md:pl-8 border-l-2 border-indigo-500/20 ml-4 space-y-12">
                {filteredMilestones.map((m, milestoneIdx) => (
                  <div key={m.title} className="relative group space-y-4">
                    
                    {/* Circle Node */}
                    <span className="absolute -left-[35px] md:-left-[43px] top-1 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-full p-1 z-10">
                      <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-[10px]">
                        {m.originalMIdx + 1}
                      </div>
                    </span>

                    <h4 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 group-hover:text-indigo-500 transition-colors">
                      {m.title}
                    </h4>

                    {/* Subtopics Checklist Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {m.subtopics.map((s) => (
                        <div
                          key={s.id}
                          className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all relative ${
                            s.completed
                              ? 'border-indigo-500/25 bg-indigo-500/5'
                              : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <button
                                type="button"
                                onClick={() => toggleSubtopic(activeTrack, m.originalMIdx, s.originalIdx)}
                                className="shrink-0 mt-0.5"
                              >
                                {s.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                              <span className="text-xs font-semibold leading-relaxed text-gray-800 dark:text-gray-200">
                                {s.title}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-light-border/30 dark:border-dark-border/30">
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Difficulty: Medium</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSubtopic(s);
                                handleStartQuiz(s);
                                setShowDetailModal(true);
                              }}
                              className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg transition-all"
                            >
                              Concept Detail
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly learning plan schedule */}
          <div className={`p-6 rounded-2xl ${cardStyle} space-y-6`}>
            <h3 className="font-display font-bold text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <span>Weekly Milestone Schedule</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 text-center">
              {[
                { day: 'Mon', item: 'Python Foundations', active: true },
                { day: 'Tue', item: 'OOP Concepts', active: true },
                { day: 'Wed', item: 'Data Structures', active: false },
                { day: 'Thu', item: 'Algorithms Intro', active: false },
                { day: 'Fri', item: 'REST APIs Design', active: false },
                { day: 'Sat', item: 'Docker Containers', active: false },
                { day: 'Sun', item: 'Mock Evaluation', active: false }
              ].map((sch, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border ${
                    sch.active 
                      ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400 font-bold' 
                      : 'border-light-border dark:border-dark-border text-gray-500'
                  }`}
                >
                  <span className="text-[10px] block uppercase font-bold tracking-wider">{sch.day}</span>
                  <span className="text-[9px] block mt-1 leading-normal truncate" title={sch.item}>{sch.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Skill analysis strengths & weak skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl ${cardStyle} space-y-4`}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-indigo-500" />
                <span>Smart Strong Skills</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dashboardStats.top_skills.map((skill, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${cardStyle} space-y-4`}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Info className="h-4 w-4 text-indigo-500" />
                <span>Weak Skills (Practice Suggested)</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dashboardStats.weak_skills.map((skill, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: AI Mentor Sticky Sidebar (30%) */}
        <div className="space-y-6 lg:sticky lg:top-8">
          
          {/* AI Readiness Circle Indicator */}
          <div className={`p-6 rounded-3xl ${cardStyle} bg-gradient-to-br from-indigo-500/10 to-violet-500/5 space-y-5`}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">AI Readiness Gauge</span>
              <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                <span>Backend Interview Ready</span>
              </h3>
            </div>

            {/* Gauge slider progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Readiness Score</span>
                <span className="text-indigo-500">{progressPercent}%</span>
              </div>
              <div className="w-full bg-light-hover dark:bg-dark-hover h-2.5 rounded-full overflow-hidden border border-light-border dark:border-dark-border">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs leading-relaxed text-gray-500">
              <span className="font-bold text-indigo-500 block mb-0.5">Mentor Advice:</span>
              Your progress values look great! Focus on Docker and System Design to reach 100% readiness goals.
            </div>
          </div>

          {/* AI Mentor Chat Widget */}
          <div className={`p-5 rounded-2xl ${cardStyle} flex flex-col h-96 overflow-hidden`}>
            <div className="flex items-center gap-2 mb-3 border-b border-light-border dark:border-dark-border pb-2">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-400">AI Career Mentor</h4>
            </div>

            {/* Chat history logs */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatLog.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl max-w-[85%] ${
                    log.sender === 'mentor' 
                      ? 'bg-light-hover/50 dark:bg-dark-hover/20 border border-light-border dark:border-dark-border/40 text-gray-800 dark:text-gray-200 self-start mr-auto' 
                      : 'bg-indigo-600 text-white self-end ml-auto'
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleAskMentor} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ask Explain JWT or Explain Docker..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          {/* Company Readiness breakdown */}
          <div className={`p-6 rounded-2xl ${cardStyle} space-y-4`}>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Building className="h-4 w-4 text-indigo-500" />
              <span>Target Company Readiness</span>
            </h4>
            <div className="space-y-3 text-xs">
              {[
                { name: 'Google', ready: '65%', rec: 'Heavy dynamic algorithms' },
                { name: 'Amazon', ready: '82%', rec: 'Practical backend systems' },
                { name: 'Microsoft', ready: '75%', rec: 'Clean structures' },
                { name: 'Startup', ready: '90%', rec: 'High speed MVC integrations' }
              ].map(c => (
                <div key={c.name} className="flex justify-between items-center border-b border-light-border/40 dark:border-dark-border/40 pb-2 last:border-b-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{c.name}</span>
                    <p className="text-[10px] text-gray-500 font-medium">{c.rec}</p>
                  </div>
                  <span className="font-extrabold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                    {c.ready}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. MODAL: DETAILED TOPIC CARD REVIEW & QUIZZES */}
      {showDetailModal && selectedSubtopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-3xl border p-8 space-y-6 max-h-[90vh] overflow-y-auto ${cardStyle}`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4 border-b pb-4 border-light-border dark:border-dark-border">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md uppercase">
                  Concept Workbench
                </span>
                <h3 className="text-xl font-display font-extrabold text-gray-900 dark:text-gray-100">
                  {selectedSubtopic.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setAiQuizQuestions([]);
                  setQuizScore(null);
                }}
                className="text-gray-400 hover:text-gray-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Explanation Section */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">AI Concept Explanation</span>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                This module tests your ability to model, optimize, and secure application data paths. Real-world implementations require optimizing network packet transmission and setting invalidation rules.
              </p>
            </div>

            {/* Resources list */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Recommended Resources</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a 
                  href="https://docs.python.org/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg flex items-center gap-3 hover:text-indigo-400 transition-colors"
                >
                  <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                  <div className="text-left">
                    <span className="font-bold block">Developer Documentation</span>
                    <span className="text-[9px] text-gray-400">Duration: 15 mins</span>
                  </div>
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg flex items-center gap-3 hover:text-indigo-400 transition-colors"
                >
                  <Play className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                  <div className="text-left">
                    <span className="font-bold block">Video Lecture Reference</span>
                    <span className="text-[9px] text-gray-400">Rating: 4.8 ★</span>
                  </div>
                </a>
              </div>
            </div>

            {/* AI quiz panel */}
            <div className="p-5 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 border-indigo-500/20">
                <span className="text-xs font-bold text-indigo-400 uppercase">AI Verification Quiz</span>
                <button
                  type="button"
                  onClick={() => handleStartQuiz(selectedSubtopic)}
                  className="text-[10px] font-bold text-indigo-400 hover:underline"
                >
                  Reload Questions
                </button>
              </div>

              {aiQuizQuestions.length > 0 ? (
                <div className="space-y-4 text-xs">
                  {aiQuizQuestions.map(q => (
                    <div key={q.id} className="space-y-2">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{q.id}. {q.text}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[q.id] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleAnswerSelect(q.id, oIdx)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                isSelected 
                                  ? 'border-indigo-600 bg-indigo-600 text-white font-bold' 
                                  : 'border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {quizScore === null ? (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className="text-center pt-2">
                      <span className="text-sm font-extrabold text-emerald-500">
                        Score: {quizScore}% Correct!
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-gray-400">
                  Ready to test your comprehension? Click the topic detail button to initiate.
                </div>
              )}
            </div>

            {/* Modal Footer actions */}
            <div className="pt-4 border-t border-light-border dark:border-dark-border flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setAiQuizQuestions([]);
                  setQuizScore(null);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all"
              >
                Close Workbench
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
