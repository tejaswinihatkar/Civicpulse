import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { TrendingUp, Filter, Plus, List, Loader2, ClipboardList } from 'lucide-react';
import { IssueCard } from '../../components/IssueCard';
import { getMyComplaints, getStoredUser } from '../../services/api';
import { Issue, IssueStatus, IssueCategory } from '../../types';

export function MyIssues() {
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<IssueCategory | 'all'>('all');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true);
        const fetchedIssues = await getMyComplaints();
        
        // Frontend filtering since getMyComplaints might not support query params on backend
        let filtered = fetchedIssues;
        if (filterStatus !== 'all') {
          filtered = filtered.filter(i => i.status.toLowerCase() === filterStatus.toLowerCase().replace('_', '-'));
        }
        if (filterCategory !== 'all') {
          filtered = filtered.filter(i => i.category.toLowerCase() === filterCategory.toLowerCase());
        }
        
        setIssues(filtered);
      } catch (error) {
        console.error('Failed to load my issues', error);
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, [filterStatus, filterCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Reported Issues</h1>
              <p className="text-blue-100 text-sm sm:text-base">Track and manage the issues you've submitted to the authorities</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4">
                <div className="text-2xl font-bold">{issues.length}</div>
                <div className="text-xs text-blue-100 uppercase tracking-wider font-semibold">Total Submissions</div>
             </div>
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4">
                <div className="text-2xl font-bold">{issues.filter(i => i.status === 'resolved').length}</div>
                <div className="text-xs text-blue-100 uppercase tracking-wider font-semibold">Resolved</div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Actions & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 font-semibold w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>Report New Issue</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
                className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
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
              className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
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

        {/* Issues List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Fetching your issues...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <Link key={issue.id} to={`/citizen/issue-details?id=${issue.id}`}>
                <IssueCard issue={issue} />
              </Link>
            ))}
            {issues.length === 0 && (
              <div className="col-span-full py-16 px-4 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm group hover:border-blue-300 transition-colors">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <List className="w-8 h-8 text-slate-300 group-hover:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No issues found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  {filterStatus !== 'all' || filterCategory !== 'all' 
                    ? "We couldn't find any issues matching your active filters." 
                    : "You haven't reported any issues yet. Be the change you want to see in your neighborhood!"}
                </p>
                {filterStatus === 'all' && filterCategory === 'all' && (
                  <Link
                    to="/citizen/report"
                    className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                  >
                    Report your first issue <Plus className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
