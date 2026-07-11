import React, { useState, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { useAuthStore } from '../store/useAuthStore';
import { resume } from '../services/resume';
import { 
  Upload, 
  FileText, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Target,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function ResumeUploadPage() {
  const { theme } = useAuthStore();
  const { 
    file, 
    parsedData, 
    isParsing, 
    parsingProgress, 
    parsingStatus, 
    error, 
    uploadResume, 
    clearResume 
  } = useResumeStore();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  React.useEffect(() => {
    resume.analysis().then(setResumeAnalysis).catch(() => setResumeAnalysis(null));
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadResume(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await uploadResume(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header title */}
      <div>
        <h2 className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight py-2 animate-pulse text-3xl">
          ATS Resume Auditor
        </h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Upload your resume to get an instant keyword density audit, matching ratings, and recommendations.
        </p>
      </div>

      {/* Main Container */}
      {!parsedData && !isParsing && (
        <div className={`p-8 rounded-2xl border ${cardStyle}`}>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="text-sm font-semibold">{error}</div>
            </div>
          )}

          {/* Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-500/5' 
                : (theme === 'dark' ? 'border-dark-border hover:border-gray-500/40 bg-dark-bg/25' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50')
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500">
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <button 
                  onClick={onButtonClick}
                  className="text-sm font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Click to upload
                </button>
                <span className="text-sm text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">
                Supports PDF, DOCX files (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Animation */}
      {isParsing && (
        <div className={`p-10 rounded-2xl border text-center ${cardStyle} space-y-6`}>
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg">Analyzing Resume...</h3>
            <p className="text-sm text-indigo-400 font-semibold animate-pulse">{parsingStatus}</p>
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="h-2 w-full bg-gray-700/20 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${parsingProgress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-semibold">
              <span>Progress</span>
              <span>{parsingProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {parsedData && !isParsing && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className={`p-6 rounded-2xl border ${cardStyle} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-bold font-display text-xl">
                {parsedData.atsScore}%
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xl">ATS Score Audit</h3>
                <p className="text-xs text-gray-500 mt-0.5">Compatible with modern tracking criteria.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearResume}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  theme === 'dark' 
                    ? 'border-dark-border hover:bg-dark-hover text-gray-300' 
                    : 'border-light-border hover:bg-light-hover text-gray-700'
                }`}
              >
                <Trash2 className="h-4 w-4 text-red-400" />
                <span>Delete Audit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className={`p-6 rounded-2xl border ${cardStyle}`}>
              <h4 className="font-display font-bold text-base mb-4 text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Detected Strengths</span>
              </h4>
              <ul className="space-y-3">
                {(parsedData.strengths || resumeAnalysis?.strengths || []).map((str, idx) => (
                  <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className={`p-6 rounded-2xl border ${cardStyle}`}>
              <h4 className="font-display font-bold text-base mb-4 text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Gaps & Issues</span>
              </h4>
              <ul className="space-y-3">
                {(parsedData.weaknesses || resumeAnalysis?.weaknesses || []).map((weak, idx) => (
                  <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable recommendations & keywords */}
          <div className={`p-6 rounded-2xl border ${cardStyle} space-y-6`}>
            <div>
              <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span>Actionable Upgrade Steps</span>
              </h4>
              <ul className="space-y-3">
                {(parsedData.actionableTips || resumeAnalysis?.recommended_actions || []).map((tip, idx) => (
                  <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2">
                    <span className="font-semibold text-indigo-400">{idx + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-500/10">
              <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-500" />
                <span>Parsed Technical Skills</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(parsedData.parsedSkills || resumeAnalysis?.parsed_skills || []).map((skill) => (
                  <span 
                    key={skill}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
