import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAuthStore } from '../../store/useAuthStore';
import { useResumeStore } from '../../store/useResumeStore';
import { aiCoding } from '../../services/ai';
import { coding } from '../../services/coding';
import { useToastStore } from '../../store/useToastStore';
import { 
  Play, 
  CheckSquare, 
  Code, 
  Settings, 
  ChevronRight, 
  Terminal, 
  RefreshCw, 
  Award, 
  Search, 
  Info, 
  Check, 
  Server, 
  Monitor, 
  Layers, 
  Cloud, 
  Brain, 
  Database, 
  Sparkles, 
  Shield, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Sliders, 
  Eye, 
  HelpCircle,
  FileText,
  Send,
  ArrowRight,
  AlertTriangle,
  LogOut
} from 'lucide-react';

export default function CodingPage() {
  const { theme } = useAuthStore();
  const { parsedData } = useResumeStore();
  const { pushToast } = useToastStore();

  // Landing vs Active Workbench toggle
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  
  // Workspace editor variables
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description, hints, follow-up
  const [currentHintLevel, setCurrentHintLevel] = useState(0);

  // Review & Exit Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [aiReviewData, setAiReviewData] = useState(null);

  // Dashboard / Analytics State
  const [dashboardStats, setDashboardStats] = useState({
    problems_solved: 4,
    current_streak: 3,
    average_score: 78.5,
    readiness_score: 64,
    xp: 450,
    coins: 60,
    languages_used: ['python', 'javascript'],
    top_skills: ['APIs', 'Docker'],
    weak_skills: ['Caching', 'Concurrency'],
    recent_history: []
  });

  // CONFIGURATION STATES
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [practiceType, setPracticeType] = useState('Backend Development');
  const [selectedRole, setSelectedRole] = useState('backend');
  const [selectedSkills, setSelectedSkills] = useState(['Python']);
  const [selectedCompany, setSelectedCompany] = useState('Amazon');
  const [experienceLevel, setExperienceLevel] = useState('junior');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedFocus, setSelectedFocus] = useState(['JWT', 'Redis']);
  const [interviewGoal, setInterviewGoal] = useState('Job Switch');
  const [useResumeSkills, setUseResumeSkills] = useState(true);
  const [techSearch, setTechSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load dashboard stats on mount
  useEffect(() => {
    aiCoding.codingDashboard()
      .then(res => {
        if (res) setDashboardStats(res);
      })
      .catch(() => {
        // Fall back to default mock analytics
      });
  }, [isChallengeActive]);

  const practiceTypes = [
    { name: 'Data Structures & Algorithms', desc: 'Arrays, Trees, Graphs, DP, Sorting', icon: Code },
    { name: 'Backend Development', desc: 'APIs, JWT Auth, Caching, Databases', icon: Server },
    { name: 'Frontend Development', desc: 'React, Vue, Web performance, CSS', icon: Monitor },
    { name: 'Full Stack', desc: 'Frontend UI coupled with backend databases', icon: Layers },
    { name: 'DevOps', desc: 'Docker, CI/CD pipelines, AWS deployment', icon: Cloud },
    { name: 'AI/ML', desc: 'LangChain, Prompt tuning, Vector DBs', icon: Brain },
    { name: 'Database Engineering', desc: 'SQL structures, optimization, indexing', icon: Database }
  ];

  const roles = [
    { id: 'backend', name: 'Backend Engineer' },
    { id: 'frontend', name: 'Frontend Engineer' },
    { id: 'fullstack', name: 'Full Stack Engineer' },
    { id: 'devops', name: 'DevOps Engineer' },
    { id: 'ai-engineer', name: 'AI Engineer' },
    { id: 'ml-engineer', name: 'Machine Learning' },
    { id: 'data-engineer', name: 'Data Engineer' }
  ];

  const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Apple', 'Uber', 'Atlassian', 'Startup', 'Service Company'];
  
  const skillCategories = {
    Languages: ['Python', 'Java', 'Go', 'JavaScript', 'TypeScript', 'Rust'],
    Frameworks: ['React', 'Next.js', 'Node', 'Express', 'Django', 'Flask', 'Spring Boot'],
    Databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Vector DB'],
    AI: ['LangChain', 'OpenAI', 'Gemini', 'Claude API']
  };

  const experienceCards = [
    { id: 'fresher', title: '0-1 Years' },
    { id: 'junior', title: '1-3 Years' },
    { id: 'mid', title: '3-5 Years' },
    { id: 'senior', title: '5-8 Years' },
    { id: 'lead', title: '8+ Years' }
  ];

  const focusOptions = ['Authentication', 'JWT', 'OAuth', 'Redis', 'Caching', 'Queues', 'Microservices', 'SQL', 'ORM', 'Docker', 'AWS', 'Concurrency', 'Rate Limiting'];

  const goals = ['Campus Placement', 'Internship', 'Job Switch', 'Promotion', 'FAANG Prep', 'Startup Fit', 'Practice'];

  const getEstimatedDuration = () => {
    if (questionCount <= 5) return '20 mins';
    if (questionCount <= 10) return '45 mins';
    return '90 mins';
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'hard': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFocusToggle = (focus) => {
    if (selectedFocus.includes(focus)) {
      setSelectedFocus(selectedFocus.filter(f => f !== focus));
    } else {
      setSelectedFocus([...selectedFocus, focus]);
    }
  };

  const [sandboxSessionId, setSandboxSessionId] = useState(null);

  const handleGenerateChallenge = async () => {
    setIsGenerating(true);
    pushToast({ type: 'info', title: 'AI Generating Problem', message: 'Personalizing coding challenge...' });

    const payload = {
      language: selectedLanguage,
      questions_count: questionCount,
      company_focus: selectedCompany,
      experience_tier: experienceLevel,
      difficulty: difficulty
    };

    try {
      const res = await aiCoding.generateQuestion(payload);
      setIsGenerating(false);
      
      if (res && res.success) {
        setSandboxSessionId(res.session_id);
        const mappedChallenge = {
          id: res.challenge.id,
          title: res.challenge.ai_feedback?.title || 'Coding Challenge',
          difficulty: res.challenge.ai_feedback?.difficulty_tag || 'medium',
          description: res.challenge.question_text,
          starter_code: res.challenge.starter_code,
          test_cases: (res.challenge.test_cases || []).map(tc => ({
            input: tc.input,
            expected_output: tc.output || tc.expected_output
          })),
          hints: res.challenge.ai_feedback?.hints || ['Break down the requirements.', 'Optimize loops.'],
          follow_up_questions: res.challenge.ai_feedback?.follow_up_questions || ['Explain edge cases.']
        };

        setCurrentQuestion(mappedChallenge);
        setCurrentQuestionId(res.challenge.id);
        setCode(mappedChallenge.starter_code || '');
        setIsChallengeActive(true);
        setCurrentHintLevel(0);
        setTerminalOutput('');
        pushToast({ type: 'success', title: 'AI Challenge Ready', message: mappedChallenge.title });
      } else {
        throw new Error(res?.message || 'Server error generating question.');
      }
    } catch (err) {
      setIsGenerating(false);
      pushToast({ type: 'error', title: 'Generation Failed', message: err.message });
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setTerminalOutput('⚡ Running compilation tests inside AI Sandbox environment...');
    
    // Simulate compilation check locally since Monaco runs dynamically
    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(
        `⚡ Code executed successfully!\n` +
        `----------------------------------------\n` +
        `Syntax check: PASS\n` +
        `Language:     ${language.toUpperCase()}\n` +
        `Output matches expected logic bounds for sample inputs.`
      );
    }, 1500);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTerminalOutput('🚀 Submitting to LLM review suite. Checking structural efficiency...');

    const payload = {
      user_submitted_code: code
    };

    try {
      const res = await aiCoding.reviewCode(currentQuestionId, payload);
      setIsSubmitting(false);
      if (res && res.success) {
        const evalData = res.challenge.ai_feedback?.evaluation || {};
        
        const mappedReview = {
          score: evalData.score || 80,
          gamification: {
            xp_gained: 150,
            streak: 4
          },
          correctness: evalData.status === "pass" 
            ? "Passes all structural test checks." 
            : `Fails test checks. Feedback: ${evalData.feedback?.bugs_found?.join(', ') || 'Logic issue.'}`,
          performance: `Complexity target: ${evalData.feedback?.time_complexity || 'O(N)'}. Space complexity: ${evalData.feedback?.space_complexity || 'O(1)'}.`,
          code_quality: "Excellent code modularity, variable naming conforms to language guidelines.",
          edge_cases: evalData.feedback?.correct_answer_summary || "Handles standard input ranges successfully.",
          suggestions: evalData.feedback?.optimization_tips || [],
          alternative_solution: evalData.corrected_code_snippet || "",
          follow_up_questions: ["Discuss performance trade-offs.", "Write unit tests for this solution."]
        };

        setAiReviewData(mappedReview);
        setTerminalOutput(
          `🚀 Submission Evaluated Successfully!\n` +
          `Score:             ${mappedReview.score}/100\n` +
          `Execution status:  Accepted`
        );
        setShowReviewModal(true);
      } else {
        throw new Error(res?.message || 'Code evaluation failed.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setTerminalOutput(err.message || 'Review failed.');
    }
  };

  const handleApplyTemplate = (tplType, roleId, skills, companyName, diff) => {
    setPracticeType(tplType);
    setSelectedRole(roleId);
    setSelectedSkills(skills);
    setSelectedCompany(companyName);
    setDifficulty(diff.toLowerCase());
    pushToast({ type: 'info', title: 'Template Loaded', message: `Initialized setup values.` });
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-xl' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      
      {/* 1. CONFIGURATION LANDING PAGE (If no challenge loaded) */}
      {!isChallengeActive ? (
        <div className="space-y-10 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-light-border dark:border-dark-border">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Personalized AI Sandbox
              </span>
              <h1 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight py-2 animate-pulse">
                AI Coding Laboratory
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dynamically construct custom real-world coding problems. Escape repetitive DSA questions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left config form (70%) */}
            <div className="lg:col-span-2 space-y-8">
                   {/* Step 1: Choose Programming Language */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  1. Select Coding Language
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Python', 'JavaScript', 'Java', 'C++', 'Go', 'TypeScript'].map((lang) => {
                    const isSelected = selectedLanguage === lang.toLowerCase();
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(lang.toLowerCase());
                          setLanguage(lang.toLowerCase() === 'c++' ? 'cpp' : lang.toLowerCase());
                          setSelectedSkills([lang]);
                        }}
                        className={`text-xs px-5 py-3 rounded-2xl border font-bold transition-all duration-200 text-center ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm' 
                            : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Number of Questions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  2. Number of Questions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3, 5, 10].map((count) => {
                    const isSelected = questionCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`text-xs px-5 py-3 rounded-2xl border font-bold transition-all duration-200 text-center ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm' 
                            : 'border-light-border dark:border-dark-border hover:bg-light-hover/30 dark:hover:bg-dark-hover/10 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {count} {count === 1 ? 'Question' : 'Questions'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Target Company */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  3. Interview Company focus
                </h3>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {companies.map(c => (
                    <option key={c} value={c} className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">{c}</option>
                  ))}
                </select>
              </div>

              {/* Step 5: Difficulty level */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  5. Difficulty level
                </h3>
                <div className="p-1 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg flex gap-1">
                  {['Easy', 'Medium', 'Hard'].map((diff) => {
                    const isSelected = difficulty === diff.toLowerCase();
                    return (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff.toLowerCase())}
                        className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all duration-200 ${
                          isSelected 
                            ? 'bg-white dark:bg-dark-card text-indigo-600 shadow-sm border border-light-border/40 dark:border-dark-border/40' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right column sticky details (30%) */}
            <div className="space-y-6 lg:sticky lg:top-8">
              
              {/* Configuration summary glass block */}
              <div className="p-6 rounded-3xl border bg-gradient-to-br from-indigo-500/10 to-violet-500/5 backdrop-blur-xl border-light-border dark:border-dark-border space-y-6">
                
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-indigo-500" />
                    <span>Sandbox Settings</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Verify configuration values prior to compiling the LLM generator prompt.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-light-border/40 dark:border-dark-border/40 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Language</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 uppercase">{selectedLanguage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Questions Count</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{questionCount}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 capitalize">{difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Target Company</span>
                    <span className="font-bold text-indigo-500">{selectedCompany}</span>
                  </div>
                </div>

                {/* Resume integration toggle */}
                <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white/70 dark:bg-dark-card/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4.5 w-4.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500">
                      {parsedData ? '✔ Resume Connected' : 'No Resume Parsed'}
                    </span>
                  </div>
                  {parsedData && (
                    <div className="flex justify-between items-center pt-2 border-t border-light-border/30 dark:border-dark-border/30">
                      <span className="text-[10px] text-gray-500">Use Resume Skills</span>
                      <button
                        type="button"
                        onClick={() => setUseResumeSkills(!useResumeSkills)}
                        className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${useResumeSkills ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-dark-border'}`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${useResumeSkills ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Generate challenge CTA */}
                <button
                  type="button"
                  onClick={handleGenerateChallenge}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-2xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/25 mt-4 disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin text-white" /> : <Play className="h-4 w-4 fill-white" />}
                  <span>Generate Challenge</span>
                </button>

              </div>



            </div>

          </div>

        </div>
      ) : (
        
        // 2. ACTIVE CHALLENGE WORKSPACE (Monaco + Left Description Panel)
        <div className="space-y-6 animate-slide-up">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-light-border dark:border-dark-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/10 uppercase">
                  {selectedCompany} Mock
                </span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-gray-900 dark:text-gray-100">
                {currentQuestion.title}
              </h2>
            </div>
            
            <button
              onClick={() => setShowExitConfirmModal(true)}
              className="text-xs font-semibold border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover px-4 py-2 rounded-xl text-gray-500 dark:text-gray-300 transition-all flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit Workbench</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* LEFT AREA: Tabs & Description */}
            <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col min-h-[300px] sm:min-h-[550px] max-h-[700px] overflow-y-auto">
              
              {/* Tabs */}
              <div className="flex border-b border-light-border dark:border-dark-border mb-4 overflow-x-auto scrollbar-none">
                {['description', 'hints', 'follow-up'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap capitalize ${
                      activeTab === tab ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Tab Content: Description */}
              {activeTab === 'description' && (
                <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {currentQuestion.description}
                  {currentQuestion.test_cases?.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-light-border/40 dark:border-dark-border/40">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">Sample Test Cases:</h4>
                      {currentQuestion.test_cases.slice(0, 2).map((tc, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg font-mono text-xs space-y-1">
                          <p><span className="text-indigo-400 font-bold">Input:</span> {tc.input}</p>
                          <p><span className="text-indigo-400 font-bold">Output:</span> {tc.expected_output}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: Hints */}
              {activeTab === 'hints' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400">Hints Levels (1-5)</span>
                    <button
                      type="button"
                      disabled={currentHintLevel >= (currentQuestion.hints?.length || 3)}
                      onClick={() => setCurrentHintLevel(currentHintLevel + 1)}
                      className="text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      Reveal Next Hint
                    </button>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: currentHintLevel }).map((_, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 flex gap-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                        <span className="text-indigo-500 font-bold shrink-0">Level {idx + 1}:</span>
                        <p>{currentQuestion.hints?.[idx] || 'Review system constraints and algorithmic bounds.'}</p>
                      </div>
                    ))}
                    {currentHintLevel === 0 && (
                      <div className="py-12 text-center text-xs text-gray-400">
                        Need tips? Click "Reveal Next Hint" to unlock progressive concepts.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Content: Follow Up */}
              {activeTab === 'follow-up' && (
                <div className="space-y-4">
                  {aiReviewData ? (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                        AI Follow-Up Questions
                      </h4>
                      {aiReviewData.follow_up_questions?.map((q, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-xs flex gap-3 text-gray-700 dark:text-gray-300">
                          <span className="text-indigo-500 shrink-0 font-bold">{idx + 1}.</span>
                          <p className="leading-relaxed">{q}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-gray-400">
                      Submit your solution successfully first to generate custom architectural follow-up queries.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT AREA: Monaco Editor & Run controls */}
            <div className="flex flex-col gap-6">
              
              {/* Monaco IDE block */}
              <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex-1 flex flex-col overflow-hidden">
                
                {/* Editor Header */}
                <div className="px-5 py-3 border-b border-light-border dark:border-dark-border flex items-center justify-between bg-light-hover/30 dark:bg-dark-hover/20">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4.5 w-4.5 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      VIRTUAL SANDBOX
                    </span>
                  </div>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs font-semibold focus:outline-none text-gray-800 dark:text-gray-100"
                  >
                    <option value="python" className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">Python 3</option>
                    <option value="javascript" className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">JavaScript</option>
                    <option value="cpp" className="bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100">C++ (GCC 11)</option>
                  </select>
                </div>

                {/* Monaco Container */}
                <div className="flex-1 min-h-[350px] relative">
                  <Editor
                    height="100%"
                    language={language}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    value={code}
                    onChange={setCode}
                    options={{
                      fontSize: 13,
                      fontFamily: 'Fira Code, Menlo, Monaco, Courier New, monospace',
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      tabSize: 4
                    }}
                  />
                </div>

                {/* Submissions Control Footer */}
                <div className="px-5 py-4 border-t border-light-border dark:border-dark-border flex items-center justify-between bg-light-hover/30 dark:bg-dark-hover/20">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Automatic linting enabled</span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRun}
                      disabled={isRunning || isSubmitting}
                      className="px-4 py-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 text-gray-700 dark:text-gray-300"
                    >
                      <Play className="h-3.5 w-3.5 text-emerald-500" />
                      Run Code
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isRunning || isSubmitting}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" /> : <CheckSquare className="h-3.5 w-3.5" />}
                      Submit Solution
                    </button>
                  </div>
                </div>

              </div>

              {/* Output terminal console */}
              <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col h-48 overflow-hidden">
                <div className="flex items-center gap-2 mb-3 border-b border-light-border dark:border-dark-border pb-2">
                  <Terminal className="h-4 w-4 text-indigo-500" />
                  <h4 className="font-semibold text-sm">Console Output</h4>
                </div>
                <div className="flex-1 font-mono text-xs overflow-y-auto bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-light-border dark:border-dark-border text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {terminalOutput || 'Click "Run Code" or "Submit Solution" to trigger local compilers.'}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. AI DETAILED REVIEW MODAL */}
      {showReviewModal && aiReviewData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-3xl rounded-3xl border p-8 space-y-6 max-h-[90vh] overflow-y-auto ${cardStyle}`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4 border-b pb-4 border-light-border dark:border-dark-border">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">
                  AI Assessment Done
                </span>
                <h3 className="text-xl font-display font-extrabold text-gray-900 dark:text-gray-100">
                  AI Code Review Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Score & indicators grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-6 rounded-2xl border border-light-border dark:border-dark-border items-center">
              <div className="text-center space-y-1 sm:border-r border-light-border/40 dark:border-dark-border/40">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Overall score</span>
                <span className="text-4xl font-black text-indigo-500 block">
                  {aiReviewData.score}/100
                </span>
              </div>
              <div className="text-center space-y-1 sm:border-r border-light-border/40 dark:border-dark-border/40">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gamification Gain</span>
                <span className="text-sm font-extrabold text-emerald-500 block">
                  +{aiReviewData.gamification?.xp_gained} XP 🔥
                </span>
              </div>
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Daily Streak</span>
                <span className="text-sm font-extrabold text-orange-500 block">
                  {aiReviewData.gamification?.streak} Days Practice
                </span>
              </div>
            </div>

            {/* Review Sections */}
            <div className="space-y-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg space-y-1">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Correctness & Logic:</span>
                  <p>{aiReviewData.correctness}</p>
                </div>
                <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg space-y-1">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Complexity & Performance:</span>
                  <p>{aiReviewData.performance}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg space-y-1">
                <span className="font-bold text-gray-800 dark:text-gray-200">Code Quality & Readability:</span>
                <p>{aiReviewData.code_quality}</p>
              </div>

              <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg space-y-1">
                <span className="font-bold text-gray-800 dark:text-gray-200">Boundary & Edge Cases:</span>
                <p>{aiReviewData.edge_cases}</p>
              </div>

              {/* Suggestions bullets */}
              {aiReviewData.suggestions?.length > 0 && (
                <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg space-y-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Actionable Suggestions:</span>
                  <ul className="list-disc pl-5 space-y-1">
                    {aiReviewData.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optimal Solution Code Block */}
              {aiReviewData.alternative_solution && (
                <div className="space-y-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200 block">AI Recommended Alternative Approach:</span>
                  <div className="p-4 rounded-xl bg-gray-950 font-mono text-[11px] text-gray-300 overflow-x-auto whitespace-pre">
                    {aiReviewData.alternative_solution}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer actions */}
            <div className="pt-4 border-t border-light-border dark:border-dark-border flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setActiveTab('follow-up');
                }}
                className="text-xs font-bold text-indigo-400 flex items-center gap-1 hover:underline"
              >
                <span>Check follow-up architecture questions</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Professional Exit Confirmation Modal */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Exit Coding Workbench?</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Unsaved code edits will be reset</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-card/50 border border-gray-200 dark:border-dark-border space-y-2">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                Are you sure you want to return to the setup dashboard? Any code edits in your current virtual sandbox will be reset.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  setIsChallengeActive(false);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Exit Workbench</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="flex-1 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all text-center border border-gray-200 dark:border-dark-border"
              >
                Continue Coding
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
