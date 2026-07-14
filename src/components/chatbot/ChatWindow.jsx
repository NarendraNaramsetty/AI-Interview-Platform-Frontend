import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuthStore } from '../../store/useAuthStore';
import { useSessions } from '../../hooks/useSessions';
import MessageBubble from './MessageBubble';

export default function ChatWindow() {
  const { user } = useAuthStore();
  const { messages, isTyping, error, sendMessage, submitRating, session } = useChat();
  const { currentSession, selectSession } = useSessions();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef(null);

  // Suggestions for empty state
  const suggestions = [
    "Explain closure in JavaScript with code example.",
    "What are the ACID properties in database transactions?",
    "How should I answer behavioral questions using STAR method?",
    "Describe the software engineer recruitment loop at Google."
  ];

  // Auto-scroll logic on new messages or typing state changes
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    sendMessage(text);
    setInputText("");
  };

  const handleRate = (messageId, score) => {
    submitRating(messageId, score);
  };

  return (
    <div className={`flex-1 flex-col rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-xs h-[calc(100vh-14rem)] min-h-125 ${currentSession ? 'flex' : 'hidden md:flex'}`}>
      
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-light-border dark:border-dark-border bg-light-hover/20 dark:bg-dark-hover/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {currentSession && (
            <button
              onClick={() => selectSession(null)}
              className="mr-1 p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-500 md:hidden transition-colors"
              title="Back to conversations"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
          )}
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-sm tracking-tight truncate">PrepAI Coach</h4>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {currentSession ? `Active: ${currentSession.session_title || currentSession.title}` : "Ready to assist"}
            </p>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30 dark:bg-zinc-950/20">
        {messages.length === 0 && !isTyping ? (
          /* Empty/Welcome Screen */
          <div className="h-full flex flex-col justify-center items-center text-center p-8 max-w-lg mx-auto">
            {/* Animated 3D Floating Orb */}
            <div className="relative mb-6 animate-float select-none">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl orb-glow border border-white/20">
                <Sparkles className="h-8 w-8 animate-pulse text-white" />
              </div>
            </div>

            <h3 className="font-display font-extrabold text-xl tracking-tight mb-1">
              PrepAI Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xs">
              Ask anything about programming, database design, or interview strategies.
            </p>

            <div className="w-full text-left">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3.5 px-1">Suggested Starting Inquiries</p>
              <div className="space-y-2.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-indigo-300 dark:hover:border-indigo-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-xs text-gray-600 dark:text-gray-300 font-medium transition-all flex items-center justify-between group shadow-xs hover:-translate-y-0.5"
                  >
                    <span>{s}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-indigo-500 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation bubbles list */
          <div className="space-y-5">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onRate={handleRate}
              />
            ))}
          </div>
        )}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start animate-fade-in">
            <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="px-4.5 py-3.5 rounded-2xl border bg-white dark:bg-dark-hover border-light-border dark:border-dark-border rounded-tl-none flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Error recovery Banner */}
      {error && (
        <div className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/20 border-t border-rose-100 dark:border-rose-950/40 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 shrink-0">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">{error}</span>
          <button 
            onClick={() => handleSend(messages[messages.length - 2]?.message || inputText)}
            className="font-bold underline shrink-0 hover:text-rose-700 ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input Form Panel */}
      <div className="p-4 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-card shrink-0">
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
            disabled={isTyping}
            placeholder="Type your question here (e.g. 'Django ORM optimization' or choose a suggest chip)..."
            className="w-full pl-4.5 pr-14 py-3.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2.5 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition-colors text-white rounded-lg shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
