import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, MapPin, Calendar, TrendingUp, MessageSquare, Share2, CheckCircle, Clock, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { getComplaint, upvoteComplaint } from '../../services/api';
import { Issue } from '../../types';
import { format } from 'date-fns';

export function IssueDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const issueId = searchParams.get('id');
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchIssue() {
      if (!issueId) return;
      try {
        setLoading(true);
        const data = await getComplaint(issueId);
        setIssue(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load issue details');
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [issueId]);

  const handleUpvote = async () => {
    if (!issue || hasUpvoted) return;
    try {
      await upvoteComplaint(issue.id);
      setIssue({ ...issue, upvotes: issue.upvotes + 1 });
      setHasUpvoted(true);
    } catch (err) {
      alert('Failed to upvote');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'submitted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-200 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Issue Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'The issue you are looking for does not exist or has been removed.'}</p>
          <button 
            onClick={() => navigate('/citizen')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/citizen')}
          className="flex items-center text-slate-600 hover:text-blue-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Issue Image */}
          <div className="relative w-full h-96 bg-slate-100 overflow-hidden">
            <img
              src={issue.images && issue.images.length > 0 ? issue.images[0] : 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=1200'}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
            {issue.sponsored && (
              <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                CSR Project: {issue.sponsored.sponsorName}
              </div>
            )}
            <div className={`absolute bottom-6 left-6 px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-lg backdrop-blur-md ${getPriorityColor(issue.priority)}`}>
               {issue.priority.toUpperCase()} PRIORITY
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {/* Title and Badges */}
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                <span className={`px-4 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                  {issue.status.replace('-', ' ')}
                </span>
                <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider">
                  {issue.category}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">{issue.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="text-slate-900 font-bold">{issue.location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reported</p>
                    <p className="text-slate-900 font-bold">{format(issue.reportedAt, 'MMMM do, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reporter</p>
                    <p className="text-slate-900 font-bold">{issue.reportedBy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Detailed Description</h2>
              <p className="text-slate-600 text-lg leading-relaxed">{issue.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                  hasUpvoted
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:-translate-y-1 hover:shadow-blue-500/30'
                }`}
              >
                <TrendingUp className="w-6 h-6" />
                {hasUpvoted ? 'Upvoted' : 'Upvote this Issue'}
                <span className={`ml-2 px-3 py-1 rounded-xl text-sm ${hasUpvoted ? 'bg-slate-200' : 'bg-white/20'}`}>
                  {issue.upvotes}
                </span>
              </button>
              <button className="p-4 bg-white border-2 border-slate-100 hover:border-slate-300 rounded-2xl transition-all shadow-sm">
                <Share2 className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Proof of Work Section for Resolved Issues */}
            {issue.status === 'resolved' && issue.proofOfWork && (
              <div className="mb-10 p-8 rounded-3xl bg-green-50 border border-green-100">
                <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  Resolution Proof
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wider">Before</p>
                    <img 
                      src={issue.proofOfWork.beforeImages[0] || issue.images[0]} 
                      className="w-full h-48 object-cover rounded-2xl border-4 border-white shadow-md"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wider">After</p>
                    <img 
                      src={issue.proofOfWork.afterImages[0]} 
                      className="w-full h-48 object-cover rounded-2xl border-4 border-white shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-700 mb-2 uppercase tracking-wider">Worker's Notes</p>
                  <p className="text-green-900 font-medium italic">"{issue.proofOfWork.notes}"</p>
                </div>
              </div>
            )}

            {/* In App Social / Engagement Placeholder */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-blue-500" />
                Community Discussion
              </h2>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center">
                <p className="text-slate-500 font-medium">Comments and discussion are being upgraded to real-time. Stay tuned!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
