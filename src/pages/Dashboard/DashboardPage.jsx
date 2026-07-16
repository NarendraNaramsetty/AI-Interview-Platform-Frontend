import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useResumeStore } from '../../store/useResumeStore';
import { useInterviewStore } from '../../store/useInterviewStore';
import { dashboard } from '../../services/dashboard';
import { useToastStore } from '../../store/useToastStore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Trophy, 
  FileText, 
  TrendingUp, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  ArrowUpRight,
  ListTodo
} from 'lucide-react';

export default function DashboardPage() {
  const { user, theme } = useAuthStore();
  const { parsedData, hydrateResume } = useResumeStore();
  const { history, loadHistory } = useInterviewStore();
  const { pushToast } = useToastStore();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardActivity, setDashboardActivity] = useState([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoadingDashboard(true);
    Promise.all([
      dashboard.stats(),
      dashboard.activity(),
      hydrateResume(),
      loadHistory()
    ])
      .then(([stats, activity]) => {
        if (!mounted) return;
        setDashboardStats(stats || null);
        setDashboardActivity(Array.isArray(activity) ? activity : activity?.items || activity?.results || []);
      })
      .catch((error) => {
        if (!mounted) return;
        pushToast({ type: 'error', title: 'Dashboard load failed', message: error.message });
      })
      .finally(() => {
        if (mounted) setIsLoadingDashboard(false);
      });
    return () => { mounted = false; };
  }, [pushToast, hydrateResume, loadHistory]);

  const completedMocks = history.length;
  const avgOverallScore = completedMocks > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / completedMocks) 
    : 0;
  
  const avgTechnical = completedMocks > 0
    ? Math.round(history.reduce((acc, h) => acc + h.technicalScore, 0) / completedMocks)
    : 0;

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-gray-100 text-gray-800 shadow-sm';

  const subtextStyle = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-150 dark:border-gray-800">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight">
            Welcome, {user?.name || 'Developer'}
          </h2>
          <p className={`text-xs ${subtextStyle}`}>
            Monitor your progress, review ATS keyword compatibility, and manage technical readiness.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/resume-upload"
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              theme === 'dark' 
                ? 'border-dark-border hover:bg-dark-hover text-gray-300' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 text-green-500" />
            <span>Upload Resume</span>
          </Link>
          <Link
            to="/interview/setup"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Session</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className={`p-5 rounded-xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Mocks Completed</p>
            <h4 className="text-xl font-bold font-display mt-0.5">{completedMocks}</h4>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Average Readiness</p>
            <h4 className="text-xl font-bold font-display mt-0.5">{avgOverallScore}%</h4>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Average Technical</p>
            <h4 className="text-xl font-bold font-display mt-0.5">{avgTechnical}%</h4>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">ATS Compatibility</p>
            <h4 className="text-xl font-bold font-display mt-0.5">
              {parsedData ? `${parsedData.atsScore}%` : 'N/A'}
            </h4>
          </div>
        </div>
      </div>

      {/* Conditional Layout based on mock history */}
      {completedMocks === 0 ? (
        /* Empty/New User Dashboard Layout - Onboarding Path */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Onboarding Steps Card */}
          <div className={`p-6 rounded-xl border lg:col-span-2 space-y-6 ${cardStyle}`}>
            <div>
              <h3 className="font-display font-bold text-lg flex items-center gap-2 text-green-600 dark:text-green-500">
                <BookOpen className="h-5 w-5" />
                <span>Get Started with PrepAI</span>
              </h3>
              <p className={`text-xs mt-1 ${subtextStyle}`}>
                Complete these three key steps to baseline your interview readiness and generate custom insights.
              </p>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-sm">
                <div className="h-7 w-7 rounded-full bg-green-500/10 text-green-500 font-bold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <span>Synchronize Your Resume</span>
                    <Link to="/resume-upload" className="text-green-500 hover:text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </h4>
                  <p className={`text-xs leading-relaxed ${subtextStyle}`}>
                    Upload your profile resume to automatically configure skills, pinpoint keywords, and audit ATS compatibility thresholds.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-sm">
                <div className="h-7 w-7 rounded-full bg-green-500/10 text-green-500 font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <span>Launch a Mock Round</span>
                    <Link to="/interview/setup" className="text-green-500 hover:text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </h4>
                  <p className={`text-xs leading-relaxed ${subtextStyle}`}>
                    Practice technical and behavioral mocks in sandbox speaking mode. Get direct, speech-to-text pronunciation insights.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-sm">
                <div className="h-7 w-7 rounded-full bg-green-500/10 text-green-500 font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Track Skill Metrics</h4>
                  <p className={`text-xs leading-relaxed ${subtextStyle}`}>
                    Unlock progress trackers, readiness charts, targeted checklist recommendations, and comprehensive mock history logs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel: Active Resume Status */}
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${cardStyle}`}>
              <h3 className="font-display font-bold text-md mb-4 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-green-500" />
                <span>Resume Audit Status</span>
              </h3>
              {parsedData ? (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ATS Rating</span>
                    <span className="font-bold text-green-500">{parsedData.atsScore}% Score</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${parsedData.atsScore}%` }} />
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-850">
                    <span className="font-semibold block text-[10px] text-gray-405 uppercase">Extracted Core Competencies</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parsedData.parsedSkills.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 text-[9px] rounded bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link to="/resume-upload" className="text-green-500 font-semibold hover:underline block text-right pt-1">
                    Audit Resume details &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <p className={`text-xs ${subtextStyle}`}>
                    You haven't connected a resume profile. Upload a file now to benchmark ATS compatibility.
                  </p>
                  <Link
                    to="/resume-upload"
                    className="inline-flex text-xs font-semibold text-green-500 hover:text-green-600 gap-1 items-center"
                  >
                    <span>Sync Resume Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Static Tips Panel */}
            <div className={`p-6 rounded-xl border ${cardStyle}`}>
              <h3 className="font-display font-bold text-md mb-2.5 flex items-center gap-2">
                <ListTodo className="h-4.5 w-4.5 text-green-500" />
                <span>Interview Quick Prep</span>
              </h3>
              <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-400 list-inside list-disc leading-relaxed">
                <li>Choose a quiet room before starting voice mocks.</li>
                <li>Write clear, structured comments when solving sandboxed code.</li>
                <li>Aim for 70%+ score to reach professional interview benchmarks.</li>
              </ul>
            </div>
          </div>

        </div>
      ) : (
        /* Active User Layout - Full Charting and Metrics Tracking */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className={`p-6 rounded-xl border lg:col-span-2 ${cardStyle}`}>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Practice Readiness Trajectory</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardStats?.skill_growth || dashboardStats?.growth || []}>
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
                    <Line type="monotone" dataKey="Technical" stroke="#22C55E" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Communication" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Confidence" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resume Audit Card */}
            <div className={`p-6 rounded-xl border flex flex-col justify-between ${cardStyle}`}>
              <div>
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  <span>Active Resume Sync</span>
                </h3>
                {parsedData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">ATS Rating</span>
                      <span className="text-sm font-semibold text-green-500">{parsedData.atsScore}% Optimal</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${parsedData.atsScore}%` }} />
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500">Detected Key Skills</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {parsedData.parsedSkills.slice(0, 5).map(s => (
                          <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                      <span className="text-xs text-gray-500">Weak Areas Found:</span>
                      <ul className="text-xs space-y-1 mt-1 text-gray-500 dark:text-gray-400 list-disc list-inside">
                        {parsedData.weaknesses.slice(0, 2).map((w, i) => (
                          <li key={i} className="truncate">{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center py-6">
                    <p className="text-xs text-gray-500">
                      No resume loaded. Upload your resume to calculate keyword compatibility.
                    </p>
                    <Link
                      to="/resume-upload"
                      className="inline-flex text-xs font-semibold text-green-500 hover:text-green-600 gap-1 items-center"
                    >
                      <span>Sync Resume Now</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
              {parsedData && (
                <Link 
                  to="/resume-upload" 
                  className="text-xs font-semibold text-green-500 hover:text-green-600 mt-4 flex items-center gap-1 self-end"
                >
                  <span>Full Resume Audit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Checklist and recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Checklist */}
            <div className={`p-6 rounded-xl border ${cardStyle}`}>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-1.5">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Practice Focus Checklist</span>
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-green-500">Strengths (Maintain):</span>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      <span>Modular component styling and styling tools.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      <span>Asynchronous execution pipelines.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-semibold text-red-500">Weaknesses (Improve):</span>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                      <span>Performance optimization hooks (useMemo, useCallback).</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                      <span>State selectors for high performance.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className={`p-6 rounded-xl border lg:col-span-2 ${cardStyle}`}>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span>AI Practice Recommendations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(dashboardStats?.recommended_topics || dashboardStats?.recommendations || []).map((item) => (
                  <div key={item.topic} className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-dark-bg/40 border-dark-border' : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/15 text-green-600 dark:text-green-400">
                          {item.category}
                        </span>
                        <span className={`text-[10px] font-semibold ${item.urgency === 'High' ? 'text-red-500' : 'text-gray-400'}`}>
                          {item.urgency} Urgency
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold mt-2.5">{item.topic}</h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-200 dark:border-gray-800">
                      <span className="text-[10px] text-gray-500">Current Competency</span>
                      <span className="text-xs font-semibold text-gray-550 dark:text-gray-400">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent Mocks History Table */}
      <div className={`p-6 rounded-xl border ${cardStyle}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Recent Mocks History</h3>
          <Link to="/history" className="text-xs font-semibold text-green-500 hover:text-green-600 flex items-center gap-0.5">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {completedMocks > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Overall Rating</th>
                  <th className="pb-3 font-semibold text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                {history.slice(0, 3).map((item) => (
                  <tr key={item.id} className="group">
                    <td className="py-3 font-semibold">
                      {item.role} <span className="text-xs font-normal text-gray-500">({item.level})</span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs font-semibold">{item.difficulty}</span>
                    </td>
                    <td className="py-3 text-xs text-gray-400">{item.date}</td>
                    <td className="py-3">
                      <span className={`font-bold ${item.overallScore >= 80 ? 'text-green-500' : item.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {item.overallScore}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-xs text-green-500 hover:text-green-600 font-semibold">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-500">
            You haven't completed any mock sessions yet. Setup your first speaking or code mock to begin!
          </div>
        )}
      </div>
    </div>
  );
}
