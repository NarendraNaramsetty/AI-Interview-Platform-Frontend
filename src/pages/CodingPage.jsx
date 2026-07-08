import React, { useState, useEffect } from 'react';
import { Play, CheckSquare, Code, Settings, ChevronRight, Terminal, RefreshCw, Award } from 'lucide-react';

const MOCK_CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    difficultyColor: 'text-green-500 bg-green-500/10 border-green-500/20',
    category: 'Arrays & Hashing',
    desc: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    defaultCode: {
      javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); ++i) {\n        int complement = target - nums[i];\n        if (seen.count(complement)) {\n            return {seen[complement], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}`
    }
  },
  {
    id: 'ch-2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    difficultyColor: 'text-green-500 bg-green-500/10 border-green-500/20',
    category: 'Stacks',
    desc: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    examples: [
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    defaultCode: {
      javascript: `function isValid(s) {\n    const stack = [];\n    const closeToOpen = { ")": "(", "}": "{", "]": "[" };\n    for (let c of s) {\n        if (closeToOpen[c]) {\n            if (stack.length && stack[stack.length - 1] === closeToOpen[c]) {\n                stack.pop();\n            } else {\n                return false;\n            }\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    closeToOpen = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in closeToOpen:\n            if stack and stack[-1] == closeToOpen[c]:\n                stack.pop()\n            else:\n                return False\n        else:\n            stack.append(c)\n    return not stack`,
      cpp: `bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) return false;\n            if (c == \')\' && st.top() != \'(\') return false;\n            if (c == \'}\' && st.top() != \'{\') return false;\n            if (c == \']\' && st.top() != \'[\') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}`
    }
  },
  {
    id: 'ch-3',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    difficultyColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    category: 'Two Pointers',
    desc: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The max area of water the container can contain is 49.' }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    defaultCode: {
      javascript: `function maxArea(height) {\n    let left = 0, right = height.length - 1;\n    let maxVal = 0;\n    while (left < right) {\n        const area = Math.min(height[left], height[right]) * (right - left);\n        maxVal = Math.max(maxVal, area);\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    return maxVal;\n}`,
      python: `def maxArea(height: List[int]) -> int:\n    left, right = 0, len(height) - 1\n    max_val = 0\n    while left < right:\n        area = min(height[left], height[right]) * (right - left)\n        max_val = max(max_val, area)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_val`,
      cpp: `int maxArea(vector<int>& height) {\n    int left = 0, right = height.size() - 1;\n    int maxVal = 0;\n    while (left < right) {\n        int area = min(height[left], height[right]) * (right - left);\n        maxVal = max(maxVal, area);\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    return maxVal;\n}`
    }
  }
];

export default function CodingPage() {
  const [activeChallenge, setActiveChallenge] = useState(MOCK_CHALLENGES[0]);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description, submissions

  // Reset code when challenge or language changes
  useEffect(() => {
    setCode(activeChallenge.defaultCode[language] || '');
    setTerminalOutput('');
  }, [activeChallenge, language]);

  const handleRun = () => {
    setIsRunning(true);
    setTerminalOutput('⚡ Compiling and executing test cases on virtual sandbox...');
    
    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(
        `▶ Running tests for: ${activeChallenge.title}\n` +
        `✔ Test Case 1 Passed! Output matches expected.\n` +
        `✔ Test Case 2 Passed! Output matches expected.\n\n` +
        `🎉 Code executed successfully in 42ms. All basic test cases passed!`
      );
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTerminalOutput('🚀 Submitting to test suite. Validating performance thresholds...');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setTerminalOutput(
        `Submission Results:\n` +
        `STATUS: Accepted\n` +
        `CASES PASSED: 100/100\n` +
        `RUNTIME: 68ms (beats 92.4% of ${language} submissions)\n` +
        `MEMORY: 44.2 MB (beats 88.7% of ${language} submissions)\n\n` +
        `🏆 Perfect execution! You have earned +20 coding experience points.`
      );
    }, 2000);
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
            {MOCK_CHALLENGES.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => setActiveChallenge(challenge)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  activeChallenge.id === challenge.id
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

          {activeTab === 'description' ? (
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
          <div className="flex-1 flex font-mono text-sm leading-relaxed p-4 bg-gray-950 text-gray-200 min-h-[300px]">
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
              className="w-full h-full min-h-[350px] pl-4 bg-transparent outline-none border-none resize-none text-indigo-300 font-mono focus:ring-0"
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
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50"
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
