import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { dashboard } from '../services/dashboard';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Award, 
  Clock, 
  Target, 
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';

export default function AnalyticsPage() {
  const { theme } = useAuthStore();
  const { history } = useInterviewStore();
  const [dashboardStats, setDashboardStats] = React.useState(null);

  React.useEffect(() => {
    dashboard.stats().then(setDashboardStats).catch(() => setDashboardStats(null));
  }, []);

  const completedMocks = history.length;
  const avgOverallScore = completedMocks > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / completedMocks) 
    : 0;

  const radarData = dashboardStats?.radar || [];
  const categoryScores = dashboardStats?.category_scores || [];

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-3xl font-display">Growth Insights</h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Dive deep into your aggregate technical competency vectors and communication statistics.
        </p>
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-500">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Practice Count</span>
            <h4 className="text-xl font-bold font-display mt-0.5">{completedMocks} Sessions</h4>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3.5 bg-green-500/10 rounded-xl text-green-500">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Overall Competency</span>
            <h4 className="text-xl font-bold font-display mt-0.5">{avgOverallScore}% Rating</h4>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3.5 bg-blue-500/10 rounded-xl text-blue-500">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Target Domain Match</span>
            <h4 className="text-xl font-bold font-display mt-0.5">82% Match</h4>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${cardStyle} flex items-center gap-4`}>
          <div className="p-3.5 bg-pink-500/10 rounded-xl text-pink-500">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Weekly Improvement</span>
            <h4 className="text-xl font-bold font-display mt-0.5">+12.5% Gain</h4>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <span>Readiness Over Weeks</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardStats?.weekly_growth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#242F41' : '#E2E8F0'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#64748B'} style={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke={theme === 'dark' ? '#9CA3AF' : '#64748B'} style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#161E2E' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#242F41' : '#E2E8F0',
                    color: theme === 'dark' ? '#E2E8F0' : '#1E293B',
                    borderRadius: 8
                  }}
                />
                <Legend style={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Technical" stroke="#6366F1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Communication" stroke="#EC4899" strokeWidth={2} />
                <Line type="monotone" dataKey="Confidence" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span>Competency Vector Radar</span>
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                <PolarGrid stroke={theme === 'dark' ? '#242F41' : '#E2E8F0'} />
                <PolarAngleAxis dataKey="subject" stroke={theme === 'dark' ? '#9CA3AF' : '#64748B'} style={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={theme === 'dark' ? '#242F41' : '#E2E8F0'} style={{ fontSize: 9 }} />
                <Radar name="Target Benchmarks" dataKey="B" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} />
                <Radar name="Your Competency" dataKey="A" stroke="#EC4899" fill="#EC4899" fillOpacity={0.25} />
                <Legend style={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Category Performance metrics */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <span>Category Performance Metrics</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryScores.map((c) => (
            <div key={c.category} className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">{c.category}</span>
                <span className={c.score >= 80 ? 'text-green-500' : 'text-yellow-500'}>{c.score}% Match</span>
              </div>
              <div className="h-2 w-full bg-gray-700/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${c.score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                  style={{ width: `${c.score}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
