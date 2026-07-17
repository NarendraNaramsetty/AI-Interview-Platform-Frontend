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
  AlertCircle,
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

function ScoreRing({ score, colorClass, strokeColor, trackColor, label, icon: Icon, theme }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md ${
      theme === 'dark' 
        ? 'bg-dark-card/75 border-dark-border text-gray-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/30' 
        : 'bg-white border-light-border text-gray-800 shadow-md shadow-gray-100 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/20'
    }`}>
      {/* Background Glow */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-10 ${
        colorClass.includes('indigo') ? 'bg-indigo-500' :
        colorClass.includes('green') ? 'bg-emerald-500' :
        colorClass.includes('pink') ? 'bg-pink-500' : 'bg-blue-500'
      }`} />
      
      <div className="relative h-20 w-20 flex items-center justify-center mb-3">
        <svg className="absolute w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`${trackColor} stroke-current`}
            strokeWidth="5.5"
            fill="transparent"
          />
          {/* Fill Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`${strokeColor} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth="5.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Inner Text with Icon */}
        <div className="flex flex-col items-center justify-center z-10">
          <span className={`text-lg font-extrabold font-display leading-none ${colorClass}`}>{score}%</span>
          {Icon && <Icon className={`h-3 w-3 mt-1 opacity-75 ${colorClass}`} />}
        </div>
      </div>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold text-center mb-1.5">{label}</span>
      
      {/* Mini Rating Tag */}
      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
        score >= 80 ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' : 
        score >= 60 ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400' : 
        'bg-rose-500/10 text-rose-500 dark:text-rose-400'
      }`}>
        {score >= 80 ? 'Excellent' : score >= 60 ? 'Passing' : 'Needs Work'}
      </span>
    </div>
  );
}

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
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-lg shadow-black/10' 
    : 'bg-white border-light-border text-gray-800 shadow-md shadow-gray-100/50';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Interview Evaluation</h2>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Review your technical and communication performance metrics compiled by PrepAI.
          </p>
        </div>
        <button
          onClick={() => {
            resetInterview();
            navigate('/dashboard');
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:scale-[1.01]"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Metric Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreRing
          score={currentReport.overallScore}
          colorClass="text-indigo-500 dark:text-indigo-400"
          strokeColor="text-indigo-500 dark:text-indigo-400"
          trackColor="text-indigo-500/10 dark:text-indigo-500/5"
          label="Overall Readiness"
          icon={Trophy}
          theme={theme}
        />
        <ScoreRing
          score={currentReport.technicalScore}
          colorClass="text-emerald-500 dark:text-emerald-400"
          strokeColor="text-emerald-500 dark:text-emerald-400"
          trackColor="text-emerald-500/10 dark:text-emerald-500/5"
          label="Technical Score"
          icon={Award}
          theme={theme}
        />
        <ScoreRing
          score={currentReport.communicationScore}
          colorClass="text-pink-500 dark:text-pink-400"
          strokeColor="text-pink-500 dark:text-pink-400"
          trackColor="text-pink-500/10 dark:text-pink-500/5"
          label="Communication"
          icon={TrendingUp}
          theme={theme}
        />
        <ScoreRing
          score={currentReport.confidenceScore}
          colorClass="text-blue-500 dark:text-blue-400"
          strokeColor="text-blue-500 dark:text-blue-400"
          trackColor="text-blue-500/10 dark:text-blue-500/5"
          label="Confidence Rating"
          icon={Sparkles}
          theme={theme}
        />
      </div>

      {/* Aggregate Strengths and weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className={`p-6 rounded-2xl border border-l-4 border-l-emerald-500/80 transition-all hover:shadow-md ${cardStyle}`}>
          <h4 className="font-display font-bold text-sm mb-4 text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span>Key Strengths Highlighted</span>
          </h4>
          <ul className="space-y-3">
            {currentReport.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className={`p-6 rounded-2xl border border-l-4 border-l-rose-500/80 transition-all hover:shadow-md ${cardStyle}`}>
          <h4 className="font-display font-bold text-sm mb-4 text-rose-500 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            <span>Improvement Opportunities</span>
          </h4>
          <ul className="space-y-3">
            {currentReport.weaknesses.map((weak, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
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
