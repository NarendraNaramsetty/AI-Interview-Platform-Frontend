import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const SUGGESTIONS = [
  'Help me optimize my resume for ATS scans.',
  'How do I answer "What is your greatest weakness"?',
  'Explain the differences between state and props in React.',
  'What are some tips to calm down during mock technical sessions?'
];

const PRESETS = {
  resume: "For a top-tier ATS Resume score, make sure you:\n1. Quantify achievements (e.g., 'Improved load speeds by 40%').\n2. Include standard keyword densities like 'TypeScript', 'Jest', or 'CI/CD'.\n3. Use clear, single-column formatting. Check out our Resume Sync scanner page!",
  weakness: "When interviewers ask for weaknesses, use the 'Actionable Growth' format:\n1. State a real technical or soft skill gap (e.g., public speaking or a specific framework).\n2. Explain what active steps you are taking to fix it (e.g., taking certifications, speaking up in standups).\n3. Keep it brief and constructive.",
  react: "React props are immutable parameters passed down from a parent component. State is mutable local data managed within the component itself. Changing state or props triggers React's reconciliation engine (Virtual DOM) to re-render the view.",
  calm: "To handle technical anxiety:\n1. Speak slowly to give yourself time to think.\n2. Ask clarifying questions before coding.\n3. Think out loud! Interviewers care more about your analytical trajectory than having immediate perfect code.",
  default: "I'm your AI Prep coach. I can help guide your mock preparation, review common technical questions, analyze keywords, or offer design advice. Try asking about 'React', 'resume optimization tips', or 'how to handle technical questions'!"
};

export default function ChatbotPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'Developer'}! 👋 I am your interactive AI Career Coach. How can I help you level up your interview game today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getResponseText = (text) => {
    const clean = text.toLowerCase();
    if (clean.includes('resume') || clean.includes('ats')) return PRESETS.resume;
    if (clean.includes('weakness') || clean.includes('strength')) return PRESETS.weakness;
    if (clean.includes('react') || clean.includes('state') || clean.includes('prop')) return PRESETS.react;
    if (clean.includes('calm') || clean.includes('anxiety') || clean.includes('stress')) return PRESETS.calm;
    return PRESETS.default;
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const reply = getResponseText(text);
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1200);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: `Chat cleared. Ask me anything to jumpstart your career prep!`
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)] min-h-[500px]">
      
      {/* Sidebar - Coach info & Actions */}
      <div className="w-full md:w-1/4 flex flex-col justify-between p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="font-display font-bold text-lg">AI Coach</h3>
          </div>
          
          <div className="p-4 rounded-xl bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Unlock real-time feedback. Ask technical definitions, behavioral layouts, or system design templates.
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 font-semibold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Conversation
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-sm">
        
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">PrepAI Career Advisor</h4>
              <p className="text-[10px] text-emerald-500 font-semibold">Active Session • Ready to assist</p>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => {
            const isAi = msg.sender === 'ai';
            return (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}>
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                  isAi 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white'
                }`}>
                  {isAi ? <Sparkles className="h-4.5 w-4.5" /> : (user?.name ? user.name.charAt(0) : <User className="h-4 w-4" />)}
                </div>
                
                {/* Text Bubble */}
                <div className={`p-4 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap ${
                  isAi
                    ? 'bg-light-hover/50 dark:bg-dark-hover/50 border-light-border dark:border-dark-border text-gray-800 dark:text-gray-200 rounded-tl-none'
                    : 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="p-4 rounded-2xl border bg-light-hover/50 dark:bg-dark-hover/50 border-light-border dark:border-dark-border rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="px-5 pb-2 pt-4 border-t border-light-border dark:border-dark-border">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Suggested Inquiries</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/30 hover:bg-light-hover dark:hover:bg-dark-hover text-xs text-gray-600 dark:text-gray-300 font-medium transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span>{s}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat input box */}
        <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-hover/20 dark:bg-dark-hover/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your coach anything (e.g. 'React state', 'resume'...) or select a chip above"
              className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors text-white rounded-lg"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
