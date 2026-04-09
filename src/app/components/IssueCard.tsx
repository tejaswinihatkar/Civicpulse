import { Issue } from '../types';
import { MapPin, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
  showActions?: boolean;
}

export function IssueCard({ issue, onClick, showActions = false }: IssueCardProps) {
  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'acknowledged':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 ring-red-500/20';
      case 'high':
        return 'bg-orange-500 ring-orange-500/20';
      case 'medium':
        return 'bg-amber-500 ring-amber-500/20';
      case 'low':
        return 'bg-green-500 ring-green-500/20';
      default:
        return 'bg-slate-500 ring-slate-500/20';
    }
  };

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'submitted':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {issue.images && issue.images.length > 0 && (
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          <img
            src={issue.images[0]}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${getPriorityColor(issue.priority)} ring-4 ring-white shadow-lg`}></div>
          {issue.sponsored && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              CSR Sponsored
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-slate-900 flex-1 leading-snug">{issue.title}</h3>
          <span className={`flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${getStatusColor(issue.status)}`}>
            {getStatusIcon(issue.status)}
            <span className="capitalize">{issue.status.replace('-', ' ')}</span>
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">{issue.description}</p>

        <div className="space-y-2.5">
          <div className="flex items-center text-xs text-slate-500">
            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
            <span className="truncate">{issue.location.address}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-slate-500">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              <span>{formatDistanceToNow(issue.reportedAt, { addSuffix: true })}</span>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                // We will handle upvote in the parent component via the IssueDetails link usually,
                // but let's make it look like a button
              }}
              className="flex items-center space-x-1.5 bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all group/upvote"
            >
              <TrendingUp className="w-4 h-4 group-hover/upvote:scale-125 transition-transform" />
              <span>{issue.upvotes}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg capitalize">
              {issue.category}
            </span>
            {issue.department && (
              <span className="text-xs font-medium text-slate-500">{issue.department}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}