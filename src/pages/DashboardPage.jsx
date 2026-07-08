import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useResumeStore } from '../store/useResumeStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { MOCK_RECOMMENDED_TOPICS, MOCK_SKILL_GROWTH } from '../constants/mockData';
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
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const { user, theme } = useAuthStore();
  const { parsedData } = useResumeStore();
  const { history } = useInterviewStore();

  // Compute overall average stats from history
  const completedMocks = history.length;
  const avgOverallScore = completedMocks > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / completedMocks) 
    : 0;
  
  const avgTechnical = completedMocks > 0
    ? Math.round(history.reduce((acc, h) => acc + h.technicalScore, 0) / completedMocks)
    : 0;

  const avgCommunication = completedMocks > 0
    ? Math.round(history.reduce((acc, h) => acc + h.communicationScore, 0) / completedMocks)
    : 0;

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl">
            Hello, {user?.name || 'Developer'}!
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            You have practice mock loops ready. Target your weak domains below to prep effectively.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/resume-upload"
            className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
              theme === 'dark' 
                ? 'border-dark-border hover:bg-dark-hover text-gray-300' 
                : 'border-light-border hover:bg-light-hover text-gray-700'
            }`}
          >
            <FileText className="h-4.5 w-4.5 text-indigo-500" />
            <span>Upload Resume</span>
          </Link>
          <Link
            to="/interview/setup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 shadow-md shadow-indigo-500/10"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>New Practice Session</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Mocks Practiced</p>
            <h4 className="text-2xl font-bold font-display mt-0.5">{completedMocks}</h4>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3.5 rounded-xl bg-green-500/10 text-green-500">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Avg Readiness</p>
            <h4 className="text-2xl font-bold font-display mt-0.5">{avgOverallScore}%</h4>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Avg Technical</p>
            <h4 className="text-2xl font-bold font-display mt-0.5">{avgTechnical}%</h4>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border flex items-center gap-4 ${cardStyle}`}>
          <div className="p-3.5 rounded-xl bg-pink-500/10 text-pink-500">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Resume ATS Score</p>
            <h4 className="text-2xl font-bold font-display mt-0.5">
              {parsedData ? `${parsedData.atsScore}%` : 'N/A'}
            </h4>
          </div>
        </div>
      </div>

      {/* Main Grid: Graph + Resume status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress chart */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 ${cardStyle}`}>
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <span>Practice Readiness Trajectory</span>
          </h3>
          <div className="h-64 w-full">
            {completedMocks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_SKILL_GROWTH}>
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
                  <Line type="monotone" dataKey="Technical" stroke="#6366F1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Communication" stroke="#EC4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="Confidence" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-500">
                Complete at least one interview session to unlock charts visualization.
              </div>
            )}
          </div>
        </div>

        {/* Resume status card */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${cardStyle}`}>
          <div>
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <span>Active Resume Sync</span>
            </h3>
            {parsedData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">ATS Rating</span>
                  <span className="text-sm font-semibold text-green-500">{parsedData.atsScore}% Optimal</span>
                </div>
                {/* Visual ATS progress bar */}
                <div className="h-2 w-full bg-gray-700/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${parsedData.atsScore}%` }} />
                </div>
                
                <div>
                  <span className="text-xs text-gray-500">Detected Key Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {parsedData.parsedSkills.slice(0, 5).map(s => (
                      <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                        {s}
                      </span>
                    ))}
                    {parsedData.parsedSkills.length > 5 && (
                      <span className="text-[10px] text-gray-500">+{parsedData.parsedSkills.length - 5} more</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-500/10">
                  <span className="text-xs text-gray-500">Weak Areas Found:</span>
                  <ul className="text-xs space-y-1 mt-1 text-gray-400 list-disc list-inside">
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
                  className="inline-flex text-xs font-semibold text-indigo-400 hover:text-indigo-300 gap-1 items-center"
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
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-4 flex items-center gap-1 self-end"
            >
              <span>Full Resume Audit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Weak/Strong areas & recommended topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Strong / Weak checklist */}
        <div className={`p-6 rounded-2xl border md:col-span-1 lg:col-span-1 ${cardStyle}`}>
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-1.5">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Practice Focus Checklist</span>
          </h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-green-400">Strengths (Maintain):</span>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Modular component styling and styling tools.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Asynchronous execution pipelines.</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-500/10">
              <span className="text-xs font-semibold text-red-400">Weaknesses (Improve):</span>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Performance optimization hooks (useMemo, useCallback).</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>State selectors for high performance.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended topics */}
        <div className={`p-6 rounded-2xl border md:col-span-1 lg:col-span-2 ${cardStyle}`}>
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>AI Practice Recommendations</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_RECOMMENDED_TOPICS.map((item) => (
              <div key={item.topic} className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-dark-bg/40 border-dark-border' : 'bg-gray-50 border-gray-100'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-semibold ${item.urgency === 'High' ? 'text-red-500' : 'text-gray-400'}`}>
                      {item.urgency} Urgency
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold mt-2.5">{item.topic}</h4>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-500/5">
                  <span className="text-[10px] text-gray-500">Current Competency</span>
                  <span className="text-xs font-semibold text-gray-400">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Interviews History Table */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Recent Mocks History</h3>
          <Link to="/history" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {completedMocks > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-500/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Overall Rating</th>
                  <th className="pb-3 font-semibold text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10 text-sm">
                {history.slice(0, 3).map((item) => (
                  <tr key={item.id} className="group">
                    <td className="py-3 font-semibold">
                      {item.role} <span className="text-xs font-normal text-gray-500">({item.level})</span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs font-semibold">{item.difficulty}</span>
                    </td>
                    <td className="py-3 text-xs text-gray-500">{item.date}</td>
                    <td className="py-3">
                      <span className={`font-bold ${item.overallScore >= 80 ? 'text-green-500' : item.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {item.overallScore}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold">
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
            You haven't completed any sessions yet. Build your first interview sandbox parameters to start!
          </div>
        )}
      </div>
    </div>
  );
}
