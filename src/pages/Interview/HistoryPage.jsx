import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useAuthStore } from '../../store/useAuthStore';
import { interview } from '../../services/interview';
import { feedback } from '../../services/feedback';
import { 
  History, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  FileText,
  Loader2
} from 'lucide-react';

export default function HistoryPage() {
  const { theme } = useAuthStore();
  const { history, reviewReport } = useInterviewStore();
  const navigate = useNavigate();
  const [loadingReportId, setLoadingReportId] = useState(null);

  const handleReviewReport = async (sessionItem) => {
    setLoadingReportId(sessionItem.id);
    const success = await reviewReport(
      sessionItem.id, 
      sessionItem.overallScore, 
      sessionItem.technicalScore, 
      sessionItem.communicationScore, 
      sessionItem.confidenceScore
    );
    setLoadingReportId(null);
    if (success) {
      navigate('/interview/results');
    }
  };

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-3xl">Practice History</h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Review your past mock sessions, performance indicators, and compiled feedback files.
        </p>
      </div>

      {/* History table */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-500/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Target Job Role</th>
                  <th className="pb-3 font-semibold">Date Completed</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Technical</th>
                  <th className="pb-3 font-semibold">Communication</th>
                  <th className="pb-3 font-semibold">Overall Rating</th>
                  <th className="pb-3 font-semibold text-right">Report Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10 text-sm">
                {history.map((item) => (
                  <tr key={item.id} className="group hover:bg-indigo-500/2 transition-colors">
                    <td className="py-4 font-semibold">
                      <div className="flex flex-col">
                        <span>{item.role}</span>
                        <span className="text-[10px] text-gray-500 font-normal">{item.level} · {item.difficulty} difficulty</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-gray-500">{item.date}</td>
                    <td className="py-4 text-xs text-gray-500">{item.duration}</td>
                    <td className="py-4">
                      <span className="text-xs font-semibold text-blue-400">{item.technicalScore}%</span>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-semibold text-pink-400">{item.communicationScore}%</span>
                    </td>
                    <td className="py-4">
                      <span className={`font-bold ${item.overallScore >= 80 ? 'text-green-500' : item.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {item.overallScore}%
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleReviewReport(item)}
                        disabled={loadingReportId !== null}
                        className="text-xs text-indigo-400 hover:text-indigo-305 font-semibold flex items-center gap-1.5 ml-auto disabled:opacity-50"
                      >
                        {loadingReportId === item.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>Review Report</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 space-y-4">
            <History className="h-10 w-10 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-500">
              No historical records found. Complete a practice mock interview session to save records.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
