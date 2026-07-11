import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faBriefcase, faCrown, faChartLine,
  faServer, faExclamationTriangle, faCoins
} from '@fortawesome/free-solid-svg-icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import styles from './Dashboard.module.css';
import ApiService from '../../service/Apiservice.jsx';
import DashboardLoader from '../common/DashboardLoader.jsx';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

const StatCard = ({ icon, value, label, subtitle, onClick }) => (
  <div className={styles.statCard} onClick={onClick}>
    <div className={styles.statIcon}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <div className={styles.statInfo}>
      <div className={styles.statNumber}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className="text-[10px] text-gray-400 mt-1">{subtitle}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    ApiService.getDashboardData()
      .then((res) => {
        setData(res.data || res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <DashboardLoader />;
  }

  const { cards, charts, recent_activities } = data;

  const cardData = [
    { icon: faUsers, value: cards.total_users, label: 'Total Users', subtitle: `Today Active: ${cards.today_active}`, onClick: () => navigate('/admin/users') },
    { icon: faCrown, value: cards.premium_users, label: 'Premium Users', subtitle: `Free Tier: ${cards.free_users}`, onClick: () => navigate('/admin/users?tier=Pro') },
    { icon: faBriefcase, value: cards.interviews_conducted, label: 'Interviews Run', subtitle: `Resume Analyses: ${cards.ai_resume_analyses}`, onClick: () => navigate('/admin/interviews') },
    { icon: faCoins, value: `$${cards.monthly_revenue}`, label: 'Monthly Revenue', subtitle: `Today Revenue: $${cards.today_revenue}`, onClick: () => navigate('/admin/payments') },
    { icon: faChartLine, value: cards.api_usage, label: 'API Hits', subtitle: 'Gemini & OpenAI API usage', onClick: () => navigate('/admin/system') },
    { icon: faServer, value: cards.server_health, label: 'Server Status', subtitle: `Disk Usage: ${cards.storage_usage}`, onClick: () => navigate('/admin/system') },
    { icon: faExclamationTriangle, value: cards.pending_tickets, label: 'Support Inquiries', subtitle: 'Pending tickets & bugs', onClick: () => navigate('/admin/support') }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display">System Overview Cockpit</h2>
        <p className="text-xs text-gray-400 mt-1">Real-time performance analytics, revenue tracking, and account activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Growth Area Chart */}
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Weekly User Registration</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.user_registration}>
                <defs>
                  <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#242F41"/>
                <XAxis dataKey="label" stroke="#64748b" fontSize={10}/>
                <YAxis stroke="#64748b" fontSize={10}/>
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#6366F1" fillOpacity={1} fill="url(#colorUser)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Interview Categories</h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.interview_categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.interview_categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {charts.interview_categories.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="truncate">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Revenue & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Monthly Revenue Stream ($)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthly_revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242F41"/>
                <XAxis dataKey="label" stroke="#64748b" fontSize={10}/>
                <YAxis stroke="#64748b" fontSize={10}/>
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Mock Interview Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.daily_interviews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242F41"/>
                <XAxis dataKey="label" stroke="#64748b" fontSize={10}/>
                <YAxis stroke="#64748b" fontSize={10}/>
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#F59E0B" fill="#F59E0B/10" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Users */}
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">New Registrations</h3>
          <div className="space-y-3">
            {recent_activities.latest_users.map((u, i) => (
              <div key={i} className="flex justify-between items-center text-xs pb-2 border-b border-light-border dark:border-dark-border last:border-0 last:pb-0">
                <div>
                  <div className="font-bold">{u.name}</div>
                  <div className="text-gray-400 text-[10px]">{u.email}</div>
                </div>
                <div className="text-gray-400">{u.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Payments */}
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Recent Transactions</h3>
          <div className="space-y-3">
            {recent_activities.latest_payments.map((p, i) => (
              <div key={i} className="flex justify-between items-center text-xs pb-2 border-b border-light-border dark:border-dark-border last:border-0 last:pb-0">
                <div>
                  <div className="font-bold">{p.email}</div>
                  <div className="text-indigo-500 font-semibold mt-0.5">${p.amount}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase">{p.status}</span>
                  <div className="text-gray-400 text-[9px] mt-1">{p.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Interviews */}
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Recent Mock Sessions</h3>
          <div className="space-y-3">
            {recent_activities.latest_interviews.map((int, i) => (
              <div key={i} className="flex justify-between items-center text-xs pb-2 border-b border-light-border dark:border-dark-border last:border-0 last:pb-0">
                <div>
                  <div className="font-bold truncate max-w-[160px]">{int.title}</div>
                  <div className="text-gray-400 text-[10px]">{int.email}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-500">{int.score} pts</div>
                  <div className="text-gray-400 text-[9px] mt-0.5">{int.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
