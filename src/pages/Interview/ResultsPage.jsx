import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Trophy, 
  Award, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function ResultsPage() {
  const { theme } = useAuthStore();
  const { currentReport, answers, resetInterview } = useInterviewStore();
  const navigate = useNavigate();

  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Fallback to setup if no active report exists
  React.useEffect(() => {
    if (!currentReport) {
      navigate('/dashboard');
    }
  }, [currentReport, navigate]);

  if (!currentReport) return null;

  const toggleExpand = (idx) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl">Interview Evaluation</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Review your technical and communication performance metrics compiled by PrepAI.
          </p>
        </div>
        <button
          onClick={() => {
            resetInterview();
            navigate('/dashboard');
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Metric Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Overall score */}
        <div className={`p-6 rounded-2xl border text-center ${cardStyle} flex flex-col items-center justify-center`}>
          <div className="h-20 w-20 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 flex items-center justify-center font-bold font-display text-xl text-indigo-400 mb-3">
            {currentReport.overallScore}%
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Overall Readiness</span>
        </div>

        {/* Technical score */}
        <div className={`p-6 rounded-2xl border text-center ${cardStyle} flex flex-col items-center justify-center`}>
          <div className="h-20 w-20 rounded-full border-4 border-green-500/10 border-t-green-500 flex items-center justify-center font-bold font-display text-xl text-green-400 mb-3">
            {currentReport.technicalScore}%
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Technical Score</span>
        </div>

        {/* Communication score */}
        <div className={`p-6 rounded-2xl border text-center ${cardStyle} flex flex-col items-center justify-center`}>
          <div className="h-20 w-20 rounded-full border-4 border-pink-500/10 border-t-pink-500 flex items-center justify-center font-bold font-display text-xl text-pink-400 mb-3">
            {currentReport.communicationScore}%
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Communication</span>
        </div>

        {/* Confidence score */}
        <div className={`p-6 rounded-2xl border text-center ${cardStyle} flex flex-col items-center justify-center`}>
          <div className="h-20 w-20 rounded-full border-4 border-blue-500/10 border-t-blue-500 flex items-center justify-center font-bold font-display text-xl text-blue-400 mb-3">
            {currentReport.confidenceScore}%
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Confidence Rating</span>
        </div>

      </div>

      {/* Aggregate Strengths and weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h4 className="font-display font-bold text-base mb-4 text-green-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Key Strengths Highlighted</span>
          </h4>
          <ul className="space-y-3">
            {currentReport.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h4 className="font-display font-bold text-base mb-4 text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Improvement Opportunities</span>
          </h4>
          <ul className="space-y-3">
            {currentReport.weaknesses.map((weak, idx) => (
              <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question detailed feedback */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg">Detailed Question Breakdown</h3>

        {answers.map((answer, idx) => {
          const isOpen = expandedQuestion === idx;
          const { evaluation } = answer;
          return (
            <div 
              key={idx}
              className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                theme === 'dark' ? 'bg-dark-card/60 border-dark-border' : 'bg-white border-light-border'
              }`}
            >
              {/* Accordion Toggle Bar */}
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Question {idx + 1}</span>
                  <h4 className="text-sm font-semibold truncate max-w-lg text-gray-300">{answer.questionText}</h4>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`text-sm font-bold ${evaluation.overallScore >= 80 ? 'text-green-500' : evaluation.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                    Score: {evaluation.overallScore}%
                  </span>
                  {isOpen ? <ChevronUp className="h-4.5 w-4.5 text-gray-500" /> : <ChevronDown className="h-4.5 w-4.5 text-gray-500" />}
                </div>
              </button>

              {/* Accordion Content Panel */}
              {isOpen && (
                <div className="px-6 pb-6 pt-4 border-t border-gray-500/10 space-y-4 text-xs">
                  
                  {/* Candidate Answer */}
                  <div className="space-y-1.5">
                    <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Your Response:</span>
                    <p className={`p-3 rounded-lg border leading-relaxed ${
                      theme === 'dark' ? 'bg-dark-bg/60 border-dark-border text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}>
                      {answer.answerText}
                    </p>
                  </div>

                  {/* AI Feedback Evaluation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="font-semibold text-green-400 uppercase tracking-wider text-[10px]">AI Feedback Summary:</span>
                      <p className="text-gray-400 leading-relaxed">{evaluation.feedbackSummary}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">Actionable Advice:</span>
                      <p className="text-gray-400 leading-relaxed">{evaluation.constructiveAdvice}</p>
                    </div>
                  </div>

                  {/* Ideal sample response */}
                  <div className="space-y-1.5 pt-3 border-t border-gray-500/5">
                    <span className="font-semibold text-yellow-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Curated Ideal Response Template:</span>
                    </span>
                    <p className="text-gray-400 leading-relaxed">{evaluation.idealSample}</p>
                  </div>

                  {/* Keyword analysis checkmarks */}
                  <div className="space-y-2 pt-3 border-t border-gray-500/5">
                    <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Keyword Matching Grid:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluation.matchedKeywords.map((k) => (
                        <span key={k} className="text-[10px] font-semibold px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>{k}</span>
                        </span>
                      ))}
                      {evaluation.unmatchedKeywords.map((k) => (
                        <span key={k} className="text-[10px] font-semibold px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{k}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Topics mapping */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <span>Recommended Study Domains</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentReport.recommendedTopics.map((topic, i) => (
            <div key={i} className={`p-3.5 rounded-xl border ${
              theme === 'dark' ? 'bg-dark-bg/40 border-dark-border text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}>
              <h4 className="text-xs font-semibold">{topic}</h4>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
