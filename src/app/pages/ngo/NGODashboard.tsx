import { useState, useEffect } from 'react';
import { Heart, TrendingUp, Award, DollarSign, Eye, CheckCircle, X, Sparkles, Loader2 } from 'lucide-react';
import { getComplaints, getStoredUser } from '../../services/api';
import { IssueCard } from '../../components/IssueCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Issue } from '../../types';

export function NGODashboard() {
  const user = getStoredUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getComplaints();
        setIssues(data);
      } catch (error) {
        console.error('Failed to load issues', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sponsorableIssues = issues.filter(
    issue => !issue.sponsored && (issue.priority === 'high' || issue.priority === 'critical')
  );

  const sponsoredIssues = issues.filter(issue => issue.sponsored);

  const impactData = [
    { month: 'Jan', projects: 2, impact: 7.5 },
    { month: 'Feb', projects: 3, impact: 8.2 },
    { month: 'Mar', projects: 4, impact: 8.7 },
    { month: 'Apr', projects: 3, impact: 8.4 }
  ];

  const handleSponsor = () => {
    alert('Project sponsored successfully! (Integration pending backend sponsor endpoint)');
    setShowSponsorModal(false);
    setSelectedIssue(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/20 to-purple-50/20 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
              {(user?.name || 'N')[0]}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{user?.name || 'NGO Partner'}</h1>
              <p className="text-slate-600">CSR Partnership Dashboard — Live Data</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-purple-500/25">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{sponsoredIssues.length}</div>
            <div className="text-sm text-purple-100">Sponsored Projects</div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/25">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{sponsorableIssues.length}</div>
            <div className="text-sm text-blue-100">Available to Sponsor</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-green-500/25">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{issues.length}</div>
            <div className="text-sm text-green-100">Total City Issues</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-orange-500/25">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{issues.reduce((sum, i) => sum + i.upvotes, 0)}</div>
            <div className="text-sm text-orange-100">Total Engagement</div>
          </div>
        </div>

        {/* Impact Analytics */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 mb-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Impact Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar key="bar-projects" yAxisId="left" dataKey="projects" fill="#8b5cf6" name="Projects" radius={[8, 8, 0, 0]} />
              <Bar key="bar-impact" yAxisId="right" dataKey="impact" fill="#10b981" name="Impact Score" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Available Projects to Sponsor */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Available Projects</h2>
            <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">{sponsorableIssues.length} high-priority projects</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {sponsorableIssues.slice(0, 6).map((issue) => (
              <div key={issue.id}>
                <IssueCard issue={issue} />
                <button
                  onClick={() => {
                    setSelectedIssue(issue);
                    setShowSponsorModal(true);
                  }}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-semibold"
                >
                  <Heart className="w-4 h-4" />
                  <span>Sponsor This Project</span>
                </button>
              </div>
            ))}
          </div>
          {sponsorableIssues.length === 0 && (
            <div className="text-center py-12 text-slate-500">No high-priority issues available for sponsorship right now.</div>
          )}
        </div>

        {/* Sponsored Projects */}
        {sponsoredIssues.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Your Sponsored Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {sponsoredIssues.map((issue) => (
                <div key={issue.id} className="bg-white rounded-2xl border-2 border-purple-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    {issue.images && issue.images.length > 0 && (
                      <img src={issue.images[0]} alt={issue.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Your Sponsorship
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-2">{issue.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{issue.location.address}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-600 font-medium">Amount</span>
                      <span className="font-bold text-purple-600">₹{issue.sponsored?.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Status</span>
                      <span className={`px-2.5 py-1 rounded-lg font-semibold ${
                        issue.status === 'resolved' ? 'bg-green-50 text-green-700 border border-green-200'
                        : issue.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {issue.status === 'resolved' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    {issue.status === 'resolved' && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Impact verified and documented</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsor Modal */}
        {showSponsorModal && selectedIssue && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Sponsor Project</h2>
                <button
                  onClick={() => { setShowSponsorModal(false); setSelectedIssue(null); }}
                  className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{selectedIssue.title}</h3>
                  <p className="text-slate-600 mb-3 leading-relaxed">{selectedIssue.description}</p>
                  <p className="text-sm text-slate-600"><strong>Location:</strong> {selectedIssue.location.address}</p>
                  <p className="text-sm text-slate-600"><strong>Category:</strong> {selectedIssue.category}</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Sponsorship Amount</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-900">₹</span>
                    <input
                      type="number"
                      defaultValue="50000"
                      className="flex-1 text-2xl font-bold px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-slate-600 mt-3">Suggested amount based on project scope</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Your Benefits</h4>
                  <div className="space-y-3">
                    {['Brand visibility on project site and app', 'Real-time progress tracking with photos', 
                      'Digital certificate of impact', 'Detailed impact report for CSR compliance'].map((benefit, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-700">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => { setShowSponsorModal(false); setSelectedIssue(null); }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSponsor}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 font-semibold transition-all"
                >
                  Confirm Sponsorship
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}