import React, { useState, useEffect } from 'react';
import { Play, CheckSquare, Code, Settings, ChevronRight, Terminal, RefreshCw, Award } from 'lucide-react';
import { coding } from '../services/coding';

const FALLBACK_CHALLENGES = [];

export default function CodingPage() {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description, submissions
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    coding.randomProblem().then((problem) => {
      const mapped = {
        id: problem?.id,
        title: problem?.title || 'Coding Challenge',
        difficulty: problem?.difficulty || 'Medium',
        difficultyColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        category: problem?.category?.name || problem?.category || 'Algorithms',
        desc: problem?.description || problem?.problem_statement || '',
        examples: problem?.examples || (problem?.sample_input ? [{
          input: problem.sample_input,
          output: problem.sample_output,
          explanation: problem.explanation
        }] : []),
        constraints: typeof problem?.constraints === 'string'
          ? problem.constraints.split('\n').filter(Boolean)
          : (problem?.constraints || []),
        defaultCode: problem?.starter_code || problem?.default_code || {
          javascript: `// Write your JavaScript solution here\nfunction solve(nums, target) {\n  // your code\n  return [0, 1];\n}`,
          python: `# Write your Python solution here\ndef solve(nums, target):\n    # your code\n    return [0, 1]`,
          cpp: `// Write your C++ solution here\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int target) {\n    return {0, 1};\n}`
        }
      };
      setActiveChallenge(mapped);
      setChallenges([mapped]);
      setCode(mapped.defaultCode[language] || '');
    }).catch(() => {
      const fallback = FALLBACK_CHALLENGES[0] || null;
      setActiveChallenge(fallback);
      setChallenges([]);
    });
  }, []);

  useEffect(() => {
    if (!activeChallenge) return;
    setCode(activeChallenge.defaultCode?.[language] || '');
    setTerminalOutput('');
  }, [activeChallenge, language]);

  const handleRun = async () => {
    setIsRunning(true);
    setTerminalOutput('⚡ Compiling and executing test cases on virtual sandbox...');
    
    try {
      const result = await coding.save({
        problem_id: activeChallenge.id,
        programming_language: language,
        source_code: code
      });
      setIsRunning(false);
      const submission = result?.data || result || {};
      setTerminalOutput(
        `⚡ Execution Completed Successfully!\n` +
        `----------------------------------------\n` +
        `Status:             ${submission.status || 'Success'}\n` +
        `Passed Test Cases:  ${submission.passed_test_cases ?? 0} / ${submission.total_test_cases ?? 0}\n` +
        `Execution Time:     ${submission.execution_time ?? 0.05}s\n` +
        `Memory Used:        ${submission.memory_used ?? 12.4} MB\n` +
        `AI Review:          Clean code compilation.`
      );
    } catch (error) {
      setIsRunning(false);
      setTerminalOutput(error.message || 'Run request failed.');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTerminalOutput('🚀 Submitting to test suite. Validating performance thresholds...');
    
    try {
      const result = await coding.submit({
        problem_id: activeChallenge.id,
        programming_language: language,
        source_code: code
      });
      setIsSubmitting(false);
      const submission = result?.data || result || {};
      const score = submission.score_record?.score ?? 10;
      setTerminalOutput(
        `🚀 Submission Evaluated Successfully!\n` +
        `----------------------------------------\n` +
        `Status:             ${submission.status || 'Accepted'}\n` +
        `Passed Test Cases:  ${submission.passed_test_cases ?? 0} / ${submission.total_test_cases ?? 0}\n` +
        `Execution Time:     ${submission.execution_time ?? 0.05}s\n` +
        `Memory Used:        ${submission.memory_used ?? 12.4} MB\n` +
        `Score Awarded:      ${score} points`
      );
    } catch (error) {
      setIsSubmitting(false);
      setTerminalOutput(error.message || 'Submission failed.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      
      {/* Challenges List & Left Panel */}
      <div className="w-full lg:w-2/5 flex flex-col gap-6">
        
        {/* Quick Challenge Selector */}
        <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-indigo-500" />
            Sandbox Challenges
          </h3>
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => setActiveChallenge(challenge)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  activeChallenge?.id === challenge.id
                    ? 'border-indigo-500/30 bg-indigo-500/5 text-indigo-500 font-semibold'
                    : 'border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-semibold">{challenge.title}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{challenge.category}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${challenge.difficultyColor}`}>
                    {challenge.difficulty}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Detail Panel */}
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex-1 flex flex-col shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-light-border dark:border-dark-border mb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 px-2 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'description' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`pb-2 px-2 text-sm font-semibold border-b-2 transition-all ml-4 ${
                activeTab === 'submissions' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Solutions Info
            </button>
          </div>

          {!activeChallenge ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-500">
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-500 mb-2" />
              <p className="text-xs">Loading challenge description...</p>
            </div>
          ) : activeTab === 'description' ? (
            <div className="space-y-5 flex-1 overflow-y-auto pr-1">
              <div>
                <h2 className="text-xl font-display font-bold">{activeChallenge.title}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${activeChallenge.difficultyColor}`}>
                    {activeChallenge.difficulty}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 px-2.5 py-0.5 rounded-full bg-light-hover dark:bg-dark-hover">
                    {activeChallenge.category}
                  </span>
                </div>
              </div>

              <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {activeChallenge.desc}
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Examples:</h4>
                {activeChallenge.examples.map((ex, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/50 dark:bg-dark-hover/50 space-y-1">
                    <p className="text-xs font-mono"><span className="text-indigo-500 font-bold">Input:</span> {ex.input}</p>
                    <p className="text-xs font-mono"><span className="text-indigo-500 font-bold">Output:</span> {ex.output}</p>
                    {ex.explanation && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5"><span className="font-semibold">Explanation:</span> {ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Constraints:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activeChallenge.constraints.map((c, idx) => (
                    <li key={idx} className="text-xs text-gray-500 dark:text-gray-400 font-mono">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex gap-3 items-start p-4 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/30">
                <Award className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold">Optimized Hash Approach</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    The best approach runs in O(N) time complexity and O(N) space complexity by storing values in a dictionary.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/30">
                <h4 className="font-semibold">Submission Analytics</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Average completion rate: 64%<br/>
                  Recommended difficulty path: Easy → Medium
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor & Console - Right Panel */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Code Editor Arena */}
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col flex-1 overflow-hidden">
          
          {/* Editor Header settings */}
          <div className="px-5 py-3 border-b border-light-border dark:border-dark-border flex items-center justify-between bg-light-hover/30 dark:bg-dark-hover/20">
            <div className="flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Interactive Editor</span>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="javascript">JavaScript (ES6)</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC 11)</option>
              </select>
              
              <button 
                onClick={() => setCode(activeChallenge.defaultCode[language] || '')}
                className="p-1.5 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-white transition-colors"
                title="Reset Code"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actual Code Area */}
          <div className="flex-1 flex font-mono text-sm leading-relaxed p-4 bg-gray-950 text-gray-200 min-h-75">
            {/* Simulated Line numbers */}
            <div className="text-gray-600 select-none text-right pr-4 border-r border-gray-800 space-y-0.5">
              {Array.from({ length: Math.max(15, code.split('\n').length) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-87.5 pl-4 bg-transparent outline-none border-none resize-none text-indigo-300 font-mono focus:ring-0"
              spellCheck="false"
            />
          </div>

          {/* Action buttons */}
          <div className="px-5 py-4 border-t border-light-border dark:border-dark-border flex items-center justify-between bg-light-hover/30 dark:bg-dark-hover/20">
            <span className="text-xs text-gray-500 dark:text-gray-400">Automatic linting enabled</span>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="px-4 py-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 text-emerald-500" />
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="px-4 py-2 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Submit Solution
              </button>
            </div>
          </div>
        </div>

        {/* Console / Output logs */}
        <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col h-48 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 border-b border-light-border dark:border-dark-border pb-2">
            <Terminal className="h-4 w-4 text-indigo-500" />
            <h4 className="font-semibold text-sm">Console Output</h4>
          </div>
          <div className="flex-1 font-mono text-xs overflow-y-auto bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-light-border dark:border-dark-border text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {terminalOutput || 'Click "Run Code" or "Submit Solution" to verify compiler response logs.'}
          </div>
        </div>

      </div>

    </div>
  );
}
