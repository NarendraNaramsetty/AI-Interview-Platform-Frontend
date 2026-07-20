import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  Sparkles,
  ArrowRight,
  Brain,
  Code2,
  FileText,
  BarChart3,
  Mic,
  Terminal,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// Demo Scenes Data
const DEMO_STEPS = [
  {
    id: 0,
    title: '1. Resume Upload & Smart Setup',
    subtitle: 'Upload your CV to let AI tailor interview questions specifically to your experience',
    icon: FileText,
    duration: 18, // seconds
    tag: 'Step 1: Setup',
    renderScene: (isPlaying) => (
      <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-4 left-4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />

        {/* Top Header */}
        <div className="flex items-center justify-between z-10 border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Step 1: Resume Analysis</div>
              <div className="text-base font-bold">Tailored Interview Context</div>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
            AI Resume Scanner
          </span>
        </div>

        {/* Mock Graphic */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-4 z-10">
          {/* File Upload Box */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-200">Senior_FullStack_Resume.pdf</div>
            <div className="text-xs text-slate-400 mt-1">Uploaded & Analyzed</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Parsed
            </div>
          </div>

          {/* Extracted Skills Box */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col justify-center">
            <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Extracted Skill Profile</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['React.js', 'Node.js', 'Python', 'System Design', 'PostgreSQL', 'Docker'].map((skill, i) => (
                <span key={i} className="text-xs bg-slate-700/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                  {skill}
                </span>
              ))}
            </div>
            <div className="p-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-lg text-xs text-indigo-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Generated 15 customized technical & scenario questions targetting your stack.</span>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between text-xs text-slate-400 z-10 pt-2 border-t border-slate-800">
          <span>Target Role: Senior Full-Stack Engineer</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            Ready to Begin <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    )
  },
  {
    id: 1,
    title: '2. Real-Time AI Voice Mock Interview',
    subtitle: 'Practice answering questions with your microphone, featuring realistic voice AI and instant feedback',
    icon: Mic,
    duration: 22,
    tag: 'Step 2: Voice Interview',
    renderScene: (isPlaying) => (
      <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-xl relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 z-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Mock Interview</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>02:45 / 15:00</span>
          </div>
        </div>

        {/* AI Question Box */}
        <div className="my-auto z-10 space-y-4">
          <div className="p-4 bg-slate-900/90 border border-indigo-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <Brain className="w-4 h-4 text-emerald-400" /> AI Interviewer (Alex)
            </div>
            <p className="text-sm font-medium text-slate-100">
              "How would you optimize performance in a React web app experiencing re-renders in a large data list?"
            </p>
          </div>

          {/* User Answer / Voice Wave */}
          <div className="p-4 bg-indigo-950/40 border border-emerald-500/40 rounded-xl relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Mic className="w-4 h-4 animate-bounce" /> Your Voice Answer (Live)
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Speech-to-Text Active
              </span>
            </div>
            <p className="text-xs text-slate-300 italic mb-3">
              "I would utilize React.memo for item components, use Virtualization via react-window, and wrap heavy handlers in useCallback..."
            </p>

            {/* Simulated Animated Waveform */}
            <div className="flex items-center justify-center gap-1 h-8">
              {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 70, 30, 85, 60, 40].map((h, idx) => (
                <motion.div
                  key={idx}
                  className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full"
                  animate={isPlaying ? { height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] } : { height: `${h * 0.5}%` }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    delay: idx * 0.05
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2 z-10">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Zap className="w-3.5 h-3.5" /> Voice Evaluation Active
          </span>
          <span className="text-slate-400">Sub-second latency AI feedback</span>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: '3. Interactive Code Editor & Test Cases',
    subtitle: 'Solve live coding challenges in JavaScript, Python, C++, or Java with instant execution and AI hints',
    icon: Code2,
    duration: 20,
    tag: 'Step 3: Code Sandbox',
    renderScene: (isPlaying) => (
      <div className="w-full h-full flex flex-col justify-between p-5 bg-[#0f172a] text-slate-200 rounded-xl relative overflow-hidden font-mono">
        {/* Editor Top Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-500/20 text-indigo-400 rounded">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-300">TwoSum.js</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">JavaScript (Node v18)</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-500 transition-colors flex items-center gap-1">
              <Play className="w-3 h-3 fill-current" /> Run Code
            </button>
          </div>
        </div>

        {/* Code View split */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Code panel */}
          <div className="md:col-span-2 p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 overflow-hidden">
            <div className="text-slate-500">// Problem: Return indices of the two numbers such that they add up to target</div>
            <div><span className="text-purple-400">function</span> <span className="text-blue-400">twoSum</span>(nums, target) &#123;</div>
            <div className="pl-4"><span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> <span className="text-yellow-400">Map</span>();</div>
            <div className="pl-4"><span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-orange-400">0</span>; i &lt; nums.length; i++) &#123;</div>
            <div className="pl-8"><span className="text-purple-400">const</span> diff = target - nums[i];</div>
            <div className="pl-8"><span className="text-purple-400">if</span> (map.<span className="text-blue-400">has</span>(diff)) <span className="text-purple-400">return</span> [map.<span className="text-blue-400">get</span>(diff), i];</div>
            <div className="pl-8">map.<span className="text-blue-400">set</span>(nums[i], i);</div>
            <div className="pl-4">&#125;</div>
            <div>&#125;</div>
          </div>

          {/* Execution & Output panel */}
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Test Cases Passed
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-1.5 bg-slate-950 rounded border border-emerald-500/30 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓ Test 1:</span> nums=[2,7,11,15], target=9
                </div>
                <div className="p-1.5 bg-slate-950 rounded border border-emerald-500/30 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓ Test 2:</span> nums=[3,2,4], target=6
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div>Time Complexity: <span className="text-emerald-400 font-bold">O(N) Optimal</span></div>
              <div>Space Complexity: <span className="text-emerald-400 font-bold">O(N)</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>AI Assistant: Code Review Complete</span>
          <span className="text-emerald-400 font-semibold">100% Test Coverage</span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: '4. Comprehensive Analytics & Learning Plan',
    subtitle: 'Receive detailed metrics on technical accuracy, code performance, communication style, and custom roadmap',
    icon: BarChart3,
    duration: 20,
    tag: 'Step 4: Analytics',
    renderScene: (isPlaying) => (
      <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-semibold uppercase">Interview Scorecard</div>
              <div className="text-base font-bold">Performance Summary Report</div>
            </div>
          </div>
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-sm font-bold rounded-lg border border-emerald-500/40">
            Overall Score: 92%
          </div>
        </div>

        {/* Analytics Cards Grid */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-3 gap-3 z-10">
          {/* Tech Accuracy */}
          <div className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 flex flex-col items-center text-center">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">95%</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Technical Accuracy</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div className="bg-emerald-400 h-1.5 rounded-full w-[95%]" />
            </div>
          </div>

          {/* Code Efficiency */}
          <div className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 flex flex-col items-center text-center">
            <div className="text-2xl font-extrabold text-teal-400 font-mono">88%</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Code Quality</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div className="bg-teal-400 h-1.5 rounded-full w-[88%]" />
            </div>
          </div>

          {/* Communication */}
          <div className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 flex flex-col items-center text-center">
            <div className="text-2xl font-extrabold text-indigo-400 font-mono">91%</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Communication</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-400 h-1.5 rounded-full w-[91%]" />
            </div>
          </div>
        </div>

        {/* Personalized Roadmap Box */}
        <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl z-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>AI recommendation: Focus on System Design Caching Strategies & GraphQL.</span>
          </div>
          <span className="text-emerald-400 font-semibold shrink-0">Roadmap Ready</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 z-10">
          <span>Detailed PDF Report & History Saved</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            Ready for real interviews <ShieldCheck className="w-4 h-4" />
          </span>
        </div>
      </div>
    )
  }
];

export default function DemoVideoModal({ isOpen, onClose }) {
  const { theme } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);

  const currentScene = DEMO_STEPS[activeStep];

  // Timer loop for auto progression
  useEffect(() => {
    let interval = null;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentScene.duration) {
            // Move to next step or loop back
            setActiveStep((stepPrev) => (stepPrev + 1) % DEMO_STEPS.length);
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeStep, currentScene.duration]);

  // Reset timer on step change
  const handleSelectStep = (index) => {
    setActiveStep(index);
    setCurrentTime(0);
  };

  // Keyboard shortcut handler (ESC key to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const progressPercentage = (currentTime / currentScene.duration) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-800 ${
            theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-900 text-white'
          }`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  PrepAI Interactive Product Tour & Demo
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    Video Walkthrough
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  See how PrepAI turns resume parsing into realistic voice & coding mock interviews
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
              title="Close Demo"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="p-4 sm:p-6 bg-slate-950 space-y-4">
            {/* Main Video Display Player Frame */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black group">
              {/* Active Animated Scene */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {currentScene.renderScene(isPlaying)}
                </motion.div>
              </AnimatePresence>

              {/* Overlay Video Player Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col gap-2 z-20 opacity-95 group-hover:opacity-100 transition-opacity">
                {/* Scrubbing Progress Bar */}
                <div 
                  className="w-full bg-slate-800 h-1.5 rounded-full cursor-pointer overflow-hidden relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = clickX / rect.width;
                    setCurrentTime(newPct * currentScene.duration);
                  }}
                >
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Control Buttons Bar */}
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-transform active:scale-95 flex items-center justify-center"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={() => handleSelectStep(activeStep)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                      title="Replay Chapter"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">{Math.floor(currentTime)}s</span>
                      <span>/</span>
                      <span>{currentScene.duration}s</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {currentScene.tag}
                    </span>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                    </button>

                    <button
                      onClick={() => {
                        if (!isFullscreen) {
                          modalRef.current?.requestFullscreen?.();
                          setIsFullscreen(true);
                        } else {
                          document.exitFullscreen?.();
                          setIsFullscreen(false);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                      title="Toggle Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Chapter Selection Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {DEMO_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleSelectStep(idx)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isActive
                        ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {step.title.split('.')[1] || step.title}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {step.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer Call To Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-900 border-t border-slate-800">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              <span className="font-semibold text-slate-200">Ready to boost your interview success rate?</span>
              <p className="text-slate-500">Free tier includes full AI mock interviews with voice feedback.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <Link
                to="/register"
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex items-center gap-1.5"
              >
                <span>Start Free Practice</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
