import React, { useState } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// Simple lightweight client-side markdown formatter
function renderMarkdown(text) {
  if (!text) return "";

  // Split code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    // Code block check
    if (part.startsWith('```') && part.endsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : '';
      const code = match ? match[2].trim() : part.slice(3, -3).trim();

      return (
        <div key={index} className="my-3 rounded-lg overflow-hidden border border-gray-700 bg-gray-900 text-gray-100 font-mono text-xs shadow-sm">
          {language && (
            <div className="px-4 py-1.5 bg-gray-800 border-b border-gray-700 flex justify-between items-center text-[10px] uppercase font-semibold text-gray-400">
              <span>{language}</span>
            </div>
          )}
          <pre className="p-4 overflow-x-auto"><code>{code}</code></pre>
        </div>
      );
    }

    // Standard text formatting (inline code, list items, bolding)
    let formattedText = part;

    // Inline code: `code`
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-xs text-pink-500">$1</code>');

    // Bold text: **text**
    formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');

    // Bullet points: lines starting with "- " or "* "
    const lines = formattedText.split('\n');
    const renderedLines = lines.map((line, lIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return `<li class="list-disc ml-5 mt-1">${trimmed.slice(2)}</li>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3 class="text-base font-bold mt-3 mb-1 text-indigo-500">${trimmed.slice(4)}</h3>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2 class="text-lg font-extrabold mt-4 mb-2 text-indigo-500">${trimmed.slice(3)}</h2>`;
      }
      return trimmed ? `<p class="mt-1.5">${trimmed}</p>` : '<div class="h-2"></div>';
    });

    return (
      <div 
        key={index} 
        dangerouslySetInnerHTML={{ __html: renderedLines.join('') }} 
        className="space-y-1"
      />
    );
  });
}

export default function MessageBubble({ message, onRate }) {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [ratedState, setRatedState] = useState(null); // 'like' or 'dislike'

  const isAi = message.sender === 'BOT';
  const hasFeedback = message.feedback !== undefined && message.feedback !== null;
  const ratingValue = hasFeedback ? message.feedback.rating : (message.rating || null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (score) => {
    if (ratedState || ratingValue) return; // Prevent double rating
    setRatedState(score === 5 ? 'like' : 'dislike');
    if (onRate) {
      onRate(message.id, score);
    }
  };

  return (
    <div className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}>
      
      {/* Avatar column */}
      <div className={`h-8.5 w-8.5 rounded-full flex items-center justify-center shrink-0 font-bold text-xs select-none shadow-sm ${
        isAi 
          ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white' 
          : 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white'
      }`}>
        {isAi ? (
          <Sparkles className="h-4.5 w-4.5" />
        ) : (
          user?.first_name ? user.first_name.charAt(0).toUpperCase() : <User className="h-4 w-4" />
        )}
      </div>

      {/* Bubble + actions column */}
      <div className="space-y-1.5">
        <div className={`px-4.5 py-3.5 rounded-2xl border text-sm leading-relaxed shadow-xs ${
          isAi
            ? 'bg-white dark:bg-dark-hover border-light-border dark:border-dark-border text-gray-800 dark:text-gray-200 rounded-tl-none'
            : 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none'
        }`}>
          {renderMarkdown(message.message)}
          
          {/* Response source indicator for AI answers */}
          {isAi && message.response_source && (
            <div className="mt-3.5 pt-1.5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              <span>Source: {message.response_source}</span>
              {message.confidence_score !== null && message.confidence_score > 0 && (
                <span>Confidence: {Math.round(message.confidence_score * 100)}%</span>
              )}
            </div>
          )}
        </div>

        {/* Action icons row (only for bot responses) */}
        {isAi && (
          <div className="flex items-center gap-3 px-1 text-gray-400 dark:text-gray-500">
            <button
              onClick={handleCopy}
              className="p-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors tooltip"
              title="Copy response"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            {/* Like Feedback */}
            <button
              onClick={() => handleFeedback(5)}
              disabled={!!ratingValue || !!ratedState}
              className={`p-1 hover:text-emerald-500 transition-colors ${
                ratingValue === 5 || ratedState === 'like' ? 'text-emerald-500 scale-110' : ''
              }`}
              title="Helpful"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>

            {/* Dislike Feedback */}
            <button
              onClick={() => handleFeedback(1)}
              disabled={!!ratingValue || !!ratedState}
              className={`p-1 hover:text-rose-500 transition-colors ${
                ratingValue === 1 || ratedState === 'dislike' ? 'text-rose-500 scale-110' : ''
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
