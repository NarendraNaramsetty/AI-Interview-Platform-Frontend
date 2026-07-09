import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { dashboard } from '../services/dashboard';
import { 
  TrendingUp, 
  BarChart2, 
  BrainCircuit, 
  Target, 
  Activity, 
  ArrowUpRight,
  Clock,
  CheckCircle,
  Flame
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Link } from 'react-router-dom';

export default function PerformanceAnalyticsPage() {
  const { theme } = useAuthStore();
  const { history, loadHistory } = useInterviewStore();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    loadHistory();
    dashboard.stats().then(setStats).catch(() => setStats(null));
    dashboard.activity().then(setActivity).catch(() => setActivity([]));
  }, []);

  const totalInterviews = stats?.interviews?.total_interviews || history.length || 0;
  const completedRuns = stats?.interviews?.total_interviews || history.length || 0;
  const codingChallenges = stats?.coding?.solved_challenges || 0;
  
  const avgOverall = stats?.interviews?.average_score || (history.length > 0 ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / history.length) : 0);
  const avgTechnical = history.length > 0 ? Math.round(history.reduce((acc, h) => acc + h.technicalScore, 0) / history.length) : (avgOverall ? Math.round(avgOverall * 1.02) : 0);
  const avgCommunication = history.length > 0 ? Math.round(history.reduce((acc, h) => acc + h.communicationScore, 0) / history.length) : (avgOverall ? Math.round(avgOverall * 0.98) : 0);
  const avgConfidence = history.length > 0 ? Math.round(history.reduce((acc, h) => acc + h.confidenceScore, 0) / history.length) : (avgOverall ? Math.round(avgOverall * 1.01) : 0);
  const avgCoding = stats?.profile?.ranking_points || (avgOverall ? Math.round(avgOverall * 1.05) : 0);
  const avgHR = avgOverall ? Math.round(avgOverall * 0.95) : 0;
  
  const scoreMetrics = [
    { title: 'Overall Score', value: avgOverall, color: 'text-indigo-500 bg-indigo-500/10' },
    { title: 'Technical Score', value: avgTechnical, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Communication Score', value: avgCommunication, color: 'text-pink-500 bg-pink-500/10' },
    { title: 'Confidence Score', value: avgConfidence, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Coding Score', value: avgCoding, color: 'text-violet-500 bg-violet-500/10' },
    { title: 'HR Score', value: avgHR, color: 'text-orange-500 bg-orange-500/10' }
  ];

  // Dynamically build charts datasets based on real history items
  const weeklyData = history.length > 0 
    ? history.slice(0, 7).reverse().map((h, idx) => ({
        name: h.date ? h.date.split('-').slice(1).join('/') : `Session ${idx + 1}`,
        overall: h.overallScore,
        technical: h.technicalScore,
        coding: h.technicalScore + 2
      }))
    : [
        { name: 'Mon', overall: 70, technical: 65, coding: 60 },
        { name: 'Wed', overall: 78, technical: 72, coding: 74 },
        { name: 'Fri', overall: 85, technical: 88, coding: 90 }
      ];

  const monthlyData = history.length > 0
    ? history.slice(0, 12).reverse().map((h, idx) => ({
        name: h.date ? h.date.split('-')[1] : `Mock ${idx + 1}`,
        score: h.overallScore
      }))
    : [
        { name: 'May', score: 65 },
        { name: 'Jun', score: 72 },
        { name: 'Jul', score: 85 }
      ];

  const radarData = [
    { subject: 'Data Structures', A: avgTechnical, B: 100, fullMark: 100 },
    { subject: 'System Design', A: avgOverall, B: 100, fullMark: 100 },
    { subject: 'Problem Solving', A: avgCoding, B: 100, fullMark: 100 },
    { subject: 'Communication', A: avgCommunication, B: 100, fullMark: 100 },
    { subject: 'Leadership', A: avgConfidence, B: 100, fullMark: 100 }
  ];

  const strongSkills = [
    { skill: 'React Components Lifecycle', percentage: avgTechnical, level: 'Advanced' },
    { skill: 'Asynchronous Programming', percentage: avgOverall, level: 'Advanced' }
  ];

  const weakSkills = [
    { skill: 'System Design Scalability', percentage: Math.max(0, avgOverall - 10), level: 'Intermediate' },
    { skill: 'SQL Optimization & Indexing', percentage: Math.max(0, avgTechnical - 15), level: 'Intermediate' }
  ];

  const activityLogs = (Array.isArray(activity) ? activity : activity?.results || []).map((act, index) => ({
    id: act.id || index,
    text: act.description || act.title || 'Platform interaction log',
    date: act.timestamp ? String(act.timestamp).split('T')[0] : 'Recent',
    score: act.type ? act.type.toUpperCase() : 'ACTIVITY'
  }));

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
            <p className="text-2xl font-bold font-display mt-0.5">{totalInterviews}</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Completed Runs</p>
            <p className="text-2xl font-bold font-display mt-0.5">{completedRuns}</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Coding Challenges</p>
            <p className="text-2xl font-bold font-display mt-0.5">{codingChallenges}</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Average Duration</p>
            <p className="text-2xl font-bold font-display mt-0.5">
              {history.length > 0 ? Math.round(history.reduce((acc, h) => acc + parseInt(h.duration || 0), 0) / history.length) : 15} mins
            </p>
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
              <AreaChart data={weeklyData}>
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
              <BarChart data={monthlyData}>
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
              <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
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
                {strongSkills.map((item, idx) => (
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
                {weakSkills.map((item, idx) => (
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
            {activityLogs.map((act) => (
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
