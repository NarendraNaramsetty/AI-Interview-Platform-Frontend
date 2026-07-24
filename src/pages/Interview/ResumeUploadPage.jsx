import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAuthStore } from '../../store/useAuthStore';
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
  TrendingDown,
  RotateCcw,
  AlertTriangle,
  Check,
  FileCheck,
  X,
  Briefcase
} from 'lucide-react';

export default function ResumeUploadPage() {
  const { theme } = useAuthStore();
  const { 
    matchData,
    isMatching,
    matchError,
    analyzeMatch,
    clearMatch,
    hydrateResume
  } = useResumeStore();

  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [profileResumeName, setProfileResumeName] = useState(null);
  const [hasProfileResume, setHasProfileResume] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const fileInputRef = useRef(null);

  // Hydrate profile resume on mount
  useEffect(() => {
    hydrateResume().then((res) => {
      if (res) {
        setHasProfileResume(true);
        setProfileResumeName(res.original_filename || 'Default Resume Document');
        setUseProfileResume(true);
      } else {
        setHasProfileResume(false);
        setUseProfileResume(false);
      }
    });
  }, [hydrateResume]);

  // Loading steps animation
  useEffect(() => {
    let timer;
    if (isMatching) {
      setLoadingStep(0);
      timer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [isMatching]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
        setUploadedFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    if (!useProfileResume && !uploadedFile) return;

    // Send null for file if they are using the profile resume
    await analyzeMatch(useProfileResume ? null : uploadedFile, jobDescription);
  };

  const handleReset = () => {
    clearMatch();
    setJobDescription('');
    setUploadedFile(null);
    if (hasProfileResume) {
      setUseProfileResume(true);
    }
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-xl' 
    : 'bg-white border-light-border text-gray-800 shadow-md';

  const subCardStyle = theme === 'dark'
    ? 'bg-dark-bg/40 border-dark-border/60'
    : 'bg-gray-50 border-gray-100';

  // Extract keys safely
  const score = matchData?.match_score ?? matchData?.matchScore ?? 0;
  const candidateSkills = matchData?.detected_candidate_skills ?? matchData?.detectedCandidateSkills ?? [];
  const requiredSkills = matchData?.required_job_skills ?? matchData?.requiredJobSkills ?? [];
  const matchingSkills = matchData?.matching_skills ?? matchData?.matchingSkills ?? [];
  const missingSkills = matchData?.missing_skills ?? matchData?.missingSkills ?? [];
  const strengths = matchData?.strengths ?? [];
  const gapAnalysis = matchData?.gap_analysis ?? matchData?.gapAnalysis ?? [];
  const recommendations = matchData?.actionable_recommendations ?? matchData?.actionableRecommendations ?? matchData?.recommendations ?? [];

  // Determine score color classes
  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    if (val >= 70) return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10';
    return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title Header */}
      <div>
        <h2 className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight py-2 text-3xl">
          Resume & JD Matcher
        </h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Extract candidate skills, map JD requirements, pinpoint critical skill gaps, and get professional suggestions.
        </p>
      </div>

      {/* Main Form container if no data is shown and not loading */}
      {!matchData && !isMatching && (
        <div className={`p-8 rounded-2xl border ${cardStyle} space-y-8`}>
          {matchError && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="text-sm font-semibold">{matchError}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Panel: Resume Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-bold tracking-wide uppercase text-gray-400">
                1. Add Your Resume
              </label>

              {/* Show Option if default profile resume exists */}
              {hasProfileResume && (
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setUseProfileResume(true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      useProfileResume 
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md' 
                        : (theme === 'dark' ? 'border-dark-border text-gray-400 hover:bg-dark-hover' : 'border-gray-200 text-gray-500 hover:bg-gray-50')
                    }`}
                  >
                    Use Profile Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseProfileResume(false);
                      if (uploadedFile) setUploadedFile(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      !useProfileResume 
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md' 
                        : (theme === 'dark' ? 'border-dark-border text-gray-400 hover:bg-dark-hover' : 'border-gray-200 text-gray-500 hover:bg-gray-50')
                    }`}
                  >
                    Upload New File
                  </button>
                </div>
              )}

              {/* Toggle panels based on selection */}
              {useProfileResume && hasProfileResume ? (
                <div className={`p-6 rounded-xl border border-dashed flex flex-col items-center justify-center text-center space-y-3 ${
                  theme === 'dark' ? 'border-indigo-500/30 bg-indigo-950/10' : 'border-indigo-200 bg-indigo-50/20'
                }`}>
                  <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-500">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-300 truncate max-w-xs">{profileResumeName}</p>
                    <p className="text-xs text-gray-500 mt-1">Default Profile Resume Loaded</p>
                  </div>
                </div>
              ) : (
                /* Drag & Drop File Upload Box */
                <div>
                  {uploadedFile ? (
                    <div className={`p-6 rounded-xl border flex items-center justify-between gap-4 ${subCardStyle}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate pr-2">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setUploadedFile(null)}
                        className={`p-1.5 rounded-lg border hover:text-red-500 shrink-0 transition-colors ${
                          theme === 'dark' ? 'border-dark-border hover:bg-dark-hover' : 'border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                        dragActive 
                          ? 'border-indigo-500 bg-indigo-500/5' 
                          : (theme === 'dark' ? 'border-dark-border hover:border-gray-500/40 bg-dark-bg/25' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50')
                      }`}
                      onClick={onButtonClick}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-500">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-indigo-400">Click to upload</p>
                          <p className="text-xs text-gray-500 mt-0.5">or drag and drop PDF, DOCX (Max 10MB)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel: Job Description Input */}
            <div className="space-y-4">
              <label className="block text-sm font-bold tracking-wide uppercase text-gray-400 flex items-center justify-between">
                <span>2. Target Job Description</span>
                <span className="text-xs normal-case text-gray-500 font-normal">
                  {jobDescription.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </label>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description or role requirements here (responsibilities, technical tech stack, qualifications)..."
                className={`w-full h-40 px-4 py-3 rounded-xl border outline-none text-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 resize-none ${
                  theme === 'dark' 
                    ? 'bg-dark-bg border-dark-border text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}
              />
            </div>
          </div>

          {/* CTA Action button */}
          <div className="pt-4 border-t border-gray-500/10 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!jobDescription.trim() || (!useProfileResume && !uploadedFile)}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span>Compare & Analyze Match</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Steps View */}
      {isMatching && (
        <div className={`p-10 rounded-2xl border text-center ${cardStyle} space-y-8`}>
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
            <Briefcase className="h-8 w-8 text-indigo-400 animate-pulse" />
          </div>
          
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg">AI Matching Assessment in Progress</h3>
            <p className="text-xs text-gray-500">Evaluating compatibility matrices and extracting resume alignments.</p>
          </div>

          {/* Progress Timeline */}
          <div className="max-w-md mx-auto space-y-4 text-left border border-gray-500/10 p-5 rounded-xl bg-dark-bg/10">
            <div className="flex items-center gap-3 text-xs">
              <span className={`h-2 w-2 rounded-full shrink-0 ${loadingStep >= 0 ? 'bg-green-500 animate-ping' : 'bg-gray-600'}`} />
              <span className={loadingStep >= 0 ? 'text-gray-300 font-bold' : 'text-gray-600'}>
                Step 1: Parsing and cataloging resume skills
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={`h-2 w-2 rounded-full shrink-0 ${loadingStep >= 1 ? 'bg-green-500 animate-ping' : 'bg-gray-600'}`} />
              <span className={loadingStep >= 1 ? 'text-gray-300 font-bold' : 'text-gray-600'}>
                Step 2: Matching job description requirements
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={`h-2 w-2 rounded-full shrink-0 ${loadingStep >= 2 ? 'bg-green-500 animate-ping' : 'bg-gray-600'}`} />
              <span className={loadingStep >= 2 ? 'text-gray-300 font-bold' : 'text-gray-600'}>
                Step 3: Simulating recruitment screeners
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={`h-2 w-2 rounded-full shrink-0 ${loadingStep >= 3 ? 'bg-green-500 animate-ping' : 'bg-gray-600'}`} />
              <span className={loadingStep >= 3 ? 'text-gray-300 font-bold' : 'text-gray-600'}>
                Step 4: Compiling actionable gap recommendations
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {matchData && !isMatching && (
        <div className="space-y-6">
          
          {/* Header Match Score Summary Card */}
          <div className={`p-6 rounded-2xl border ${cardStyle} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-full border flex items-center justify-center font-extrabold font-display text-xl shrink-0 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xl">Match Compatibility Score</h3>
                <p className="text-xs text-gray-500 mt-0.5">Calculated based on skill alignment, core requirements, and background keywords.</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                theme === 'dark' 
                  ? 'border-dark-border hover:bg-dark-hover text-gray-300' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Run New Analysis</span>
            </button>
          </div>

          {/* Skills Comparison Matrix Grid */}
          <div className={`p-6 rounded-2xl border ${cardStyle} space-y-6`}>
            <h4 className="font-display font-bold text-base flex items-center gap-2 text-indigo-400">
              <Target className="h-5 w-5" />
              <span>Skills Alignment Matrix</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Skills */}
              <div className={`p-4 rounded-xl border ${subCardStyle} space-y-3`}>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Detected Resume Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {candidateSkills.length > 0 ? candidateSkills.map((sk) => (
                    <span key={sk} className="text-[10px] font-semibold px-2 py-1 rounded bg-indigo-500/5 text-indigo-400 border border-indigo-500/10">
                      {sk}
                    </span>
                  )) : <span className="text-xs text-gray-500 italic">No skills extracted</span>}
                </div>
              </div>

              {/* Required Job Skills */}
              <div className={`p-4 rounded-xl border ${subCardStyle} space-y-3`}>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Required Role Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {requiredSkills.length > 0 ? requiredSkills.map((sk) => (
                    <span key={sk} className="text-[10px] font-semibold px-2 py-1 rounded bg-purple-500/5 text-purple-400 border border-purple-500/10">
                      {sk}
                    </span>
                  )) : <span className="text-xs text-gray-500 italic">No skills extracted</span>}
                </div>
              </div>
            </div>

            {/* Overlap Map */}
            <div className="pt-4 border-t border-gray-500/10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matching overlapping skills */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Matching Tech Stack ({matchingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchingSkills.length > 0 ? matchingSkills.map((sk) => (
                    <span key={sk} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 flex items-center gap-1">
                      <Check className="h-3 w-3 shrink-0" />
                      <span>{sk}</span>
                    </span>
                  )) : <span className="text-xs text-gray-500 italic">No direct matches found. Tailor your skills section to match requirements.</span>}
                </div>
              </div>

              {/* Missing critical skills */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>Missing Requirements ({missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.length > 0 ? missingSkills.map((sk) => (
                    <span key={sk} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/10 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{sk}</span>
                    </span>
                  )) : <span className="text-xs text-emerald-400 italic">You match all extracted core skills!</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Gap Analysis Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className={`p-6 rounded-2xl border ${cardStyle} space-y-4`}>
              <h4 className="font-display font-bold text-base text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Detected Strengths</span>
              </h4>
              <ul className="space-y-3">
                {strengths.length > 0 ? strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                )) : (
                  <li className="text-xs text-gray-500 italic">No significant fit elements highlighted. Review job duties for matching details.</li>
                )}
              </ul>
            </div>

            {/* Gap Analysis */}
            <div className={`p-6 rounded-2xl border ${cardStyle} space-y-4`}>
              <h4 className="font-display font-bold text-base text-amber-500 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Compatibility Gap Analysis</span>
              </h4>
              <ul className="space-y-3">
                {gapAnalysis.length > 0 ? gapAnalysis.map((gap, idx) => (
                  <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{gap}</span>
                  </li>
                )) : (
                  <li className="text-xs text-emerald-400 italic">No major skill gaps identified. Proceed to practice rounds!</li>
                )}
              </ul>
            </div>

          </div>

          {/* Actionable recommendations & keywords */}
          <div className={`p-6 rounded-2xl border ${cardStyle} space-y-4`}>
            <h4 className="font-display font-bold text-base flex items-center gap-2 text-pink-500">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span>Bridge the Gap: Actionable Upgrades</span>
            </h4>
            <ul className="space-y-3">
              {recommendations.length > 0 ? recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-gray-400 leading-relaxed flex items-start gap-2.5 border-b border-gray-500/5 pb-2 last:border-0 last:pb-0">
                  <span className="font-bold text-pink-500 text-sm">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              )) : (
                <li className="text-xs text-gray-500 italic">No matching suggestions. Your resume corresponds excellently with this job description.</li>
              )}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
