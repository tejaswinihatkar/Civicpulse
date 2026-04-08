import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  AlertCircle, CheckCircle, Clock, Users, Shield, 
  Loader2, ArrowRight, MapPin, ClipboardList, Filter,
  Bell, CheckSquare, Search, Activity
} from 'lucide-react';
import { getDashboardStats, getComplaints } from '../../services/api';
import { Issue } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export function AuthorityDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, issuesData] = await Promise.all([
          getDashboardStats(),
          getComplaints({ status: 'submitted' }) // Focus on new issues needing action
        ]);
        setStats(statsData);
        setRecentIssues(issuesData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-float">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1">
                Admin <span className="text-gradient">Command Center</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Operational Overview • Real-time Data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <Link to="/authority/complaints" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                <CheckSquare className="w-5 h-5" />
                <span>Quick Actions</span>
             </Link>
          </div>
        </div>

        {/* Actionable Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Unassigned Issues</div>
            <div className="text-4xl font-black text-slate-900 mb-2">{stats.pending || 0}</div>
            <Link to="/authority/complaints?status=submitted" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              Assign Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Critical Alerts</div>
            <div className="text-4xl font-black text-red-600 mb-2">{stats.critical || 0}</div>
            <p className="text-xs font-semibold text-slate-500">Require immediate intervention</p>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Clock className="w-12 h-12 text-orange-600" />
            </div>
            <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">SLA Breaches</div>
            <div className="text-4xl font-black text-orange-600 mb-2">{stats.slaBreaches || 0}</div>
            <p className="text-xs font-semibold text-slate-500 text-orange-600/80">Pending resolution</p>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Today's Solved</div>
            <div className="text-4xl font-black text-green-600 mb-2">{stats.resolvedToday || 0}</div>
            <p className="text-xs font-semibold text-slate-500">Keep up the momentum!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Unassigned Issues */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Latest Submissions
              </h2>
              <Link to="/authority/complaints" className="text-sm font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                      {issue.images && issue.images[0] ? (
                        <img src={issue.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📋</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{issue.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md uppercase">{issue.category}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          {issue.location.address.split(',')[0]}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={`/authority/complaints?id=${issue.id}`}
                    className="px-4 py-2.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap text-center"
                  >
                    Assign Task
                  </Link>
                </div>
              ))}
              {recentIssues.length === 0 && (
                <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Zero Pending Submissions</h3>
                  <p className="text-slate-500">All citizens' voices have been heard and assigned.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              <Activity className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-xl font-bold mb-2">City Health Score</h3>
              <div className="text-5xl font-black mb-6">A+</div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Response Speed</span>
                  <span className="font-bold">Fast</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 w-4/5 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Resources Active
              </h3>
              <div className="space-y-5">
                {(stats.topWorkers || []).slice(0, 3).map((worker: any) => (
                  <div key={worker.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random`} className="w-10 h-10 rounded-xl" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{worker.name}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{worker.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-bold text-green-600">{worker.slaCompliance}% SLA</div>
                    </div>
                  </div>
                ))}
                <Link to="/authority/workers" className="block text-center text-sm font-bold text-blue-600 mt-4 hover:underline">
                  Manage Field Workforce
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}