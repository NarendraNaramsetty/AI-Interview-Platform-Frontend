import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Award, Activity, Play, Sparkles, Star } from 'lucide-react';

const MOCK_USER_GROWTH = [
  { date: 'Jul 1', activeUsers: 4200, premiumUsers: 1100 },
  { date: 'Jul 2', activeUsers: 4500, premiumUsers: 1150 },
  { date: 'Jul 3', activeUsers: 4800, premiumUsers: 1210 },
  { date: 'Jul 4', activeUsers: 5100, premiumUsers: 1280 },
  { date: 'Jul 5', activeUsers: 5400, premiumUsers: 1350 },
  { date: 'Jul 6', activeUsers: 5900, premiumUsers: 1420 },
  { date: 'Jul 7', activeUsers: 6400, premiumUsers: 1510 }
];

const MOCK_REVENUE_TREND = [
  { month: 'Jan', mrr: 12000 },
  { month: 'Feb', mrr: 14500 },
  { month: 'Mar', mrr: 16800 },
  { month: 'Apr', mrr: 19200 },
  { month: 'May', mrr: 21800 },
  { month: 'Jun', mrr: 24420 }
];

const MOCK_INTERVIEW_DIST = [
  { name: 'Frontend', value: 45000 },
  { name: 'Backend', value: 38000 },
  { name: 'Full Stack', value: 25000 },
  { name: 'PM / HR', value: 12490 }
];

const MOCK_CODING_ACTIVITY = [
  { name: 'Mon', attempts: 1200, success: 840 },
  { name: 'Tue', attempts: 1400, success: 980 },
  { name: 'Wed', attempts: 1800, success: 1350 },
  { name: 'Thu', attempts: 1600, success: 1120 },
  { name: 'Fri', attempts: 1500, success: 1050 },
  { name: 'Sat', attempts: 900, success: 680 },
  { name: 'Sun', attempts: 800, success: 560 }
];

const COLORS = ['#6366F1', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function AdminAnalyticsPage() {
  const { theme } = useAuthStore();

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200 shadow-sm' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  const chartStroke = theme === 'dark' ? '#242F41' : '#E2E8F0';
  const labelColor = theme === 'dark' ? '#9CA3AF' : '#64748B';

  const overviewWidgets = [
    { title: 'Daily Active Users', value: '6,400', sub: '+12.5% vs yesterday', icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
    { title: 'Monthly Active Users', value: '38,200', sub: '+18.4% vs last month', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Monthly Revenue (MRR)', value: '$24,420', sub: '20% average annual growth', icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Premium Subscribers', value: '1,510', sub: '23.5% conversion rate', icon: Award, color: 'text-violet-500 bg-violet-500/10' },
    { title: 'Total Interviews Run', value: '120,490', sub: 'Average 1.4k daily runs', icon: Play, color: 'text-pink-500 bg-pink-500/10' },
    { title: 'Coding Sandbox Runs', value: '34,810', sub: '74% compilation success rate', icon: Activity, color: 'text-orange-500 bg-orange-500/10' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-3xl">Admin System Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor growth vectors, examine conversion funnels, and track server latency parameters.
        </p>
      </div>

      {/* Overview grid widgets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {overviewWidgets.map((w, idx) => {
          const Icon = w.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl border ${cardStyle} flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase font-bold text-gray-400 leading-tight">{w.title}</span>
                <div className={`p-1.5 rounded-lg shrink-0 ${w.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xl font-bold font-display">{w.value}</p>
                <p className="text-[9px] text-gray-400 mt-1">{w.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Growth Area Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-base mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <span>User Cohort Growth</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_USER_GROWTH}>
                <defs>
                  <linearGradient id="activeUsersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                <XAxis dataKey="date" stroke={labelColor} style={{ fontSize: 11 }} />
                <YAxis stroke={labelColor} style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#161E2E' : '#FFFFFF', borderColor: chartStroke }} />
                <Legend style={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#6366F1" fillOpacity={1} fill="url(#activeUsersGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="premiumUsers" name="Premium Users" stroke="#EC4899" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue MRR Bar Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-base mb-6 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-indigo-500" />
            <span>Monthly Revenue Growth (MRR)</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REVENUE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                <XAxis dataKey="month" stroke={labelColor} style={{ fontSize: 11 }} />
                <YAxis stroke={labelColor} style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#161E2E' : '#FFFFFF', borderColor: chartStroke }} />
                <Legend style={{ fontSize: 11 }} />
                <Bar dataKey="mrr" name="MRR Total ($)" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interview category Pie Donut Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-base mb-6 flex items-center gap-2">
            <Play className="h-5 w-5 text-indigo-500" />
            <span>Simulation Runs By Track</span>
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_INTERVIEW_DIST}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_INTERVIEW_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend style={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coding Activity Multi Chart */}
        <div className={`p-6 rounded-2xl border ${cardStyle}`}>
          <h3 className="font-display font-bold text-base mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500 animate-pulse" />
            <span>Daily Sandbox Code Compiles</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CODING_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                <XAxis dataKey="name" stroke={labelColor} style={{ fontSize: 11 }} />
                <YAxis stroke={labelColor} style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#161E2E' : '#FFFFFF', borderColor: chartStroke }} />
                <Legend style={{ fontSize: 11 }} />
                <Bar dataKey="attempts" name="Total Compiles" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="success" name="Successful Runs" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Popular lists splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Popular roles list */}
        <div className={`p-6 rounded-2xl border ${cardStyle} space-y-4`}>
          <h3 className="font-display font-bold text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span>Popular Jobs Simulated</span>
          </h3>
          
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Frontend Engineer (React/Vite)', count: '45,000 runs' },
              { rank: 2, name: 'Backend Architect (Node/Express)', count: '38,000 runs' },
              { rank: 3, name: 'Full Stack Engineer', count: '25,000 runs' },
              { rank: 4, name: 'Product Manager (Agile)', count: '12,490 runs' }
            ].map((role) => (
              <div key={role.rank} className="flex justify-between items-center p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 text-xs">
                <div className="flex gap-3 items-center">
                  <span className="font-bold font-display text-indigo-500 text-sm">#{role.rank}</span>
                  <span className="font-semibold">{role.name}</span>
                </div>
                <span className="text-gray-400 font-semibold">{role.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular companies list */}
        <div className={`p-6 rounded-2xl border ${cardStyle} space-y-4`}>
          <h3 className="font-display font-bold text-base flex items-center gap-2">
            <Star className="h-5 w-5 text-indigo-500" />
            <span>Popular Recruiter Targets</span>
          </h3>
          
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Google (Alphabet)', count: '32,400 mock loops' },
              { rank: 2, name: 'Meta Platforms (Facebook)', count: '28,110 mock loops' },
              { rank: 3, name: 'Amazon (Web Services)', count: '24,500 mock loops' },
              { rank: 4, name: 'Stripe Payment Systems', count: '18,290 mock loops' }
            ].map((company) => (
              <div key={company.rank} className="flex justify-between items-center p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 text-xs">
                <div className="flex gap-3 items-center">
                  <span className="font-bold font-display text-indigo-500 text-sm">#{company.rank}</span>
                  <span className="font-semibold">{company.name}</span>
                </div>
                <span className="text-gray-400 font-semibold">{company.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
