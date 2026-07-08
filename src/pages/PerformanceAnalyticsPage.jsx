import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Award, Clock, Target, Zap, Activity, BrainCircuit, Play, CheckCircle, Flame, ArrowUpRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_WEEKLY_DATA = [
  { name: 'Week 1', overall: 65, technical: 70, communication: 60, confidence: 64, coding: 68, hr: 62 },
  { name: 'Week 2', overall: 72, technical: 75, communication: 70, confidence: 72, coding: 74, hr: 70 },
  { name: 'Week 3', overall: 78, technical: 82, communication: 75, confidence: 78, coding: 80, hr: 74 },
  { name: 'Week 4', overall: 85, technical: 88, communication: 82, confidence: 85, coding: 90, hr: 80 }
];

const MOCK_MONTHLY_DATA = [
  { name: 'Jan', count: 4, score: 64 },
  { name: 'Feb', count: 6, score: 68 },
  { name: 'Mar', count: 8, score: 72 },
  { name: 'Apr', count: 7, score: 75 },
  { name: 'May', count: 9, score: 79 },
  { name: 'Jun', count: 12, score: 85 }
];

const MOCK_TOPIC_DATA = [
  { subject: 'Data Structures', A: 85, fullMark: 100 },
  { subject: 'System Design', A: 68, fullMark: 100 },
  { subject: 'React Syntax', A: 92, fullMark: 100 },
  { subject: 'Concurrency', A: 60, fullMark: 100 },
  { subject: 'Speech Delivery', A: 84, fullMark: 100 },
  { subject: 'HR/Behavioral', A: 78, fullMark: 100 }
];

const MOCK_RECENT_ACTIVITIES = [
  { id: 'act-1', text: 'Completed Google Mock Technical simulation.', date: 'Today at 10:24 AM', score: '88%' },
  { id: 'act-2', text: 'Completed "Valid Parentheses" coding challenge.', date: 'Yesterday at 3:15 PM', score: 'Accepted' },
  { id: 'act-3', text: 'Updated ATS Profile and Synced Resume.', date: 'July 5, 2026', score: 'ATS: 82%' },
  { id: 'act-4', text: 'Started roadmap module "Single Page Frameworks".', date: 'July 4, 2026', score: '64% Complete' }
];

const MOCK_STRONG_SKILLS = [
  { skill: 'React State Lifecycle', percentage: 94, level: 'Expert' },
  { skill: 'Verbal Delivery Pacing', percentage: 88, level: 'Advanced' },
  { skill: 'Array Destructuring Algorithms', percentage: 85, level: 'Advanced' }
];

const MOCK_WEAK_SKILLS = [
  { skill: 'Database Scale Partitioning', percentage: 55, level: 'Needs Review' },
  { skill: 'Redux Middleware Thunks', percentage: 62, level: 'Needs Review' },
  { skill: 'Concurrency Lock Resolution', percentage: 48, level: 'Critical' }
];

export default function PerformanceAnalyticsPage() {
  const { theme } = useAuthStore();
  
  const scoreMetrics = [
    { title: 'Overall Score', value: 85, color: 'text-indigo-500 bg-indigo-500/10' },
    { title: 'Technical Score', value: 88, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Communication Score', value: 82, color: 'text-pink-500 bg-pink-500/10' },
    { title: 'Confidence Score', value: 85, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Coding Score', value: 90, color: 'text-violet-500 bg-violet-500/10' },
    { title: 'HR Score', value: 80, color: 'text-orange-500 bg-orange-500/10' }
  ];

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  const chartStroke = theme === 'dark' ? '#242F41' : '#E2E8F0';
  const labelColor = theme === 'dark' ? '#9CA3AF' : '#64748B';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-3xl">Performance Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review core score metrics, examine historical timelines, and pinpoint skill improvements.
        </p>
      </div>

      {/* 1. Score Grid (Top widgets) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {scoreMetrics.map((sm, idx) => (
          <div key={idx} className={`p-4.5 rounded-2xl border ${cardStyle} flex flex-col justify-between items-center text-center`}>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{sm.title}</span>
            <div className={`h-16 w-16 rounded-full flex items-center justify-center font-display font-black text-lg border-2 mt-3.5 border-transparent ${sm.color}`}>
              {sm.value}%
            </div>
          </div>
        ))}
      </div>

      {/* 2. Core Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Total Interviews</p>
            <p className="text-2xl font-bold font-display mt-0.5">14</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Completed Runs</p>
            <p className="text-2xl font-bold font-display mt-0.5">12</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Coding Challenges</p>
            <p className="text-2xl font-bold font-display mt-0.5">24</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Average Duration</p>
            <p className="text-2xl font-bold font-display mt-0.5">22 mins</p>
          </div>
        </div>

      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Progress Area Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-base mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <span>Weekly Progress Audits</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_WEEKLY_DATA}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                <XAxis dataKey="name" stroke={labelColor} style={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke={labelColor} style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#161E2E' : '#FFFFFF', borderColor: chartStroke }} />
                <Legend style={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="overall" name="Overall Avg" stroke="#6366F1" fillOpacity={1} fill="url(#colorOverall)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="technical" name="Technical" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="coding" name="Coding" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Bar Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-base mb-6 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-500" />
            <span>Monthly Performance Trend</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                <XAxis dataKey="name" stroke={labelColor} style={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke={labelColor} style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#161E2E' : '#FFFFFF', borderColor: chartStroke }} />
                <Legend style={{ fontSize: 11 }} />
                <Bar dataKey="score" name="Average Score" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic-wise Polar Radar Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-base mb-6 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-500" />
            <span>Competency Vector Domains</span>
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={MOCK_TOPIC_DATA}>
                <PolarGrid stroke={chartStroke} />
                <PolarAngleAxis dataKey="subject" stroke={labelColor} style={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={chartStroke} style={{ fontSize: 9 }} />
                <Radar name="Competency Score" dataKey="A" stroke="#EC4899" fill="#EC4899" fillOpacity={0.2} />
                <Legend style={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strong vs Weak Skills split */}
        <div className={`p-6 rounded-2xl border ${cardStyle} flex flex-col justify-between`}>
          <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            <span>Skills Audit Matrix</span>
          </h3>
          
          <div className="space-y-6 flex-1 justify-center flex flex-col">
            {/* Strong Skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-emerald-500 tracking-wider">Strongest Competencies</h4>
              <div className="space-y-2">
                {MOCK_STRONG_SKILLS.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700 dark:text-gray-300">{item.skill}</span>
                      <span className="text-emerald-500">{item.percentage}% ({item.level})</span>
                    </div>
                    <div className="h-1.5 w-full bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Skills */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase text-rose-500 tracking-wider">Development Focus Areas</h4>
              <div className="space-y-2">
                {MOCK_WEAK_SKILLS.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700 dark:text-gray-300">{item.skill}</span>
                      <span className="text-rose-500">{item.percentage}% ({item.level})</span>
                    </div>
                    <div className="h-1.5 w-full bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Splits: Recent activity & Recommended Learnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Log */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${cardStyle} space-y-4`}>
          <h3 className="font-display font-bold text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            <span>Recent Activity Logs</span>
          </h3>

          <div className="space-y-3 text-xs md:text-sm">
            {MOCK_RECENT_ACTIVITIES.map((act) => (
              <div key={act.id} className="flex justify-between items-center p-3.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/20 dark:bg-dark-hover/10">
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{act.text}</p>
                  <p className="text-[10px] text-gray-400">{act.date}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-500 font-mono text-[10px] font-bold">
                  {act.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Learning Path shortcut */}
        <div className={`p-6 rounded-2xl border ${cardStyle} flex flex-col justify-between space-y-5`}>
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base">Development Roadmap Recommendations</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Based on weaknesses in concurrent algorithms and partitioned indexing, we recommend practicing these topics next:
            </p>
            
            <div className="space-y-2 text-xs">
              <div className="flex gap-2.5 items-center p-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/30">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="font-semibold">SQL Index Scans vs B-Tree Nodes</span>
              </div>
              <div className="flex gap-2.5 items-center p-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/30">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="font-semibold">Express Concurrency Mutex Locks</span>
              </div>
            </div>
          </div>

          <Link
            to="/roadmap"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <span>Launch Roadmap Track</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
