import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MapPin, TrendingUp, Filter, Plus, Map as MapIcon, List, Award, Target, Loader2 } from 'lucide-react';
import { IssueCard } from '../../components/IssueCard';
import { getComplaints, getStoredUser } from '../../services/api';
import { Issue, IssueStatus, IssueCategory } from '../../types';

export function CitizenDashboard() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<IssueCategory | 'all'>('all');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true);
        const fetchedIssues = await getComplaints({
          status: filterStatus === 'all' ? undefined : filterStatus,
          category: filterCategory === 'all' ? undefined : filterCategory,
        });
        setIssues(fetchedIssues);
      } catch (error) {
        console.error('Failed to load issues', error);
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, [filterStatus, filterCategory]);

  const nearbyIssues = issues.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Citizen'}!</h1>
              <p className="text-blue-100 text-sm sm:text-base">Help make your city better by reporting and tracking civic issues</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-bold mb-1">{user?.points || 0}</div>
              <div className="text-xs sm:text-sm text-blue-100">Your Points</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-bold mb-1">12</div>
              <div className="text-xs sm:text-sm text-blue-100">Issues Reported</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-bold mb-1">8</div>
              <div className="text-xs sm:text-sm text-blue-100">Resolved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-bold mb-1">#24</div>
              <div className="text-xs sm:text-sm text-blue-100">Leaderboard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Report New Issue</span>
          </Link>
        </div>

        {/* Nearby Issues */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Issues Near You</h2>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View All →
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {nearbyIssues.map((issue) => (
                <Link key={issue.id} to={`/citizen/issue-details?id=${issue.id}`}>
                  <IssueCard issue={issue} />
                </Link>
              ))}
              {nearbyIssues.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                  No nearby issues found.
                </div>
              )}
            </div>
          )}
        </section>

        {/* All Issues */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Trending Issues</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
                  className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as IssueCategory | 'all')}
                className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="all">All Categories</option>
                <option value="road">Road</option>
                <option value="garbage">Garbage</option>
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="drainage">Drainage</option>
                <option value="streetlight">Streetlight</option>
                <option value="park">Park</option>
                <option value="traffic">Traffic</option>
              </select>
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-20">
               <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
              {issues.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                  No issues found matching the criteria.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}