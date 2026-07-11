import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { chatbot } from '../services/chatbot';

export default function ChatbotPage() {
  const { user, theme } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'Developer'}! 👋 I am your interactive AI Career Coach. How can I help you level up your interview game today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    chatbot.currentSession().then((res) => {
      const sessionData = res?.data || res;
      setSessionId(sessionData?.id || sessionData?.uuid || null);
    }).catch(() => setSessionId(null));

    chatbot.prompts().then((data) => {
      const promptRows = Array.isArray(data) ? data : data?.results || data?.data || [];
      const chipText = promptRows
          .map((item) => item?.name || item?.description || item?.system_prompt || '')
          .filter(Boolean)
          .slice(0, 4);
      setSuggestions(chipText);
    }).catch(() => setSuggestions([]));
  }, []);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        const startRes = await chatbot.startSession({ conversation_type: 'General' });
        const startData = startRes?.data || startRes;
        activeSessionId = startData?.id || startData?.uuid;
        setSessionId(activeSessionId);
      }

      const reply = await chatbot.sendMessage({ session_id: activeSessionId, message: text });
      setIsTyping(false);
      const responseData = reply?.data || reply;
      const responseText = responseData?.message || responseData?.text || responseData?.response_text || responseData?.response || 'No response returned.';
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'ai', text: error.message || 'Chat request failed.' }]);
    }
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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header title */}
      <div>
        <h2 className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight py-2 animate-pulse text-3xl">
          AI Career Advisor Chat
        </h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Unlock real-time career advice. Ask technical definitions, behavioral layouts, or system design templates.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-14rem)] min-h-125">
        
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
                      : 'bg-linear-to-tr from-indigo-500 to-violet-500 text-white'
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
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/30 hover:bg-light-hover dark:hover:bg-dark-hover text-xs text-gray-600 dark:text-gray-300 font-medium transition-colors text-left flex items-center gap-1.5 group"
                  >
                    <span>{s}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
                {!suggestions.length && (
                  <p className="text-xs text-gray-400">No prompt templates are available yet.</p>
                )}
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

    </div>
  );
}
