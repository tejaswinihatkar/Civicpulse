import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp, CheckCircle, Clock, Users, Shield, Loader2 } from 'lucide-react';
import { getDashboardStats } from '../../services/api';

export function AuthorityDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Map backend field names to chart-compatible structures
  const totalComplaints = stats.totalComplaints || 0;
  const resolvedCount = stats.resolved || 0;
  const inProgressCount = stats.inProgress || 0;
  const pendingCount = stats.pending || 0;
  const criticalCount = stats.critical || 0;
  const slaBreaches = stats.slaBreaches || 0;

  const statusData = [
    { name: 'Resolved', value: resolvedCount, color: '#10b981' },
    { name: 'In Progress', value: inProgressCount, color: '#8b5cf6' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' }
  ];

  const categoryData = Object.entries(stats.byCategory || {}).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
    count
  }));

  const weeklyTrendData = (stats.weeklyTrend || []).map((item: any) => ({
    day: item.date || item.day,
    reported: item.count || item.reported || 0,
    resolved: item.resolved || 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-blue-50/20 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Authority Dashboard</h1>
              <p className="text-slate-600">Monitor and manage civic issues across the city — powered by live DB</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalComplaints}</div>
            <div className="text-sm font-medium text-slate-600">Total Issues</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{resolvedCount}</div>
            <div className="text-sm font-medium text-slate-600">Resolved</div>
            <div className="text-xs font-semibold text-green-600 mt-1.5">
              {totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0}% resolution rate
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{inProgressCount}</div>
            <div className="text-sm font-medium text-slate-600">In Progress</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{criticalCount}</div>
            <div className="text-sm font-medium text-slate-600">Critical Priority</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{slaBreaches}</div>
            <div className="text-sm font-medium text-slate-600">SLA Violations</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Weekly Trend</h2>
            {weeklyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line key="line-reported" type="monotone" dataKey="reported" stroke="#3b82f6" strokeWidth={3} name="Reported" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400 font-medium">
                No trend data available yet. Reports will appear once complaints are filed.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Issues by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar key="bar-count" dataKey="count" fill="#3b82f6" name="Total Issues" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400 font-medium">
                No category data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution & Top Workers */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Top Performing Workers</h2>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="space-y-3">
              {(stats.topWorkers || []).map((worker: any, index: number) => (
                <div key={worker.id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={worker.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random`}
                        alt={worker.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                      />
                      {index === 0 && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          1
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{worker.name}</div>
                      <div className="text-sm text-slate-600">{worker.department}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">{worker.completedTasks || 0}</div>
                    <div className="text-sm text-slate-600">Tasks completed</div>
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      {worker.slaCompliance || 0}% SLA compliance
                    </div>
                  </div>
                </div>
              ))}
              {(!stats.topWorkers || stats.topWorkers.length === 0) && (
                <div className="text-center py-6 text-slate-500">No worker data available. Workers need to be registered first.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}