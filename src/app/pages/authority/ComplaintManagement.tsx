import { useState } from 'react';
import { Search, Filter, UserPlus, CheckCircle, AlertCircle, Clock, X, MapPin, Calendar, TrendingUp, User, Building2, Timer, Award, DollarSign, Image as ImageIcon } from 'lucide-react';
import { mockIssues, mockWorkers } from '../../data/mockData';
import { IssueCard } from '../../components/IssueCard';
import { Issue, IssueStatus, IssuePriority } from '../../types';
import { formatDistanceToNow, format } from 'date-fns';

export function ComplaintManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<IssuePriority | 'all'>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredIssues = mockIssues.filter((issue) => {
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (filterPriority !== 'all' && issue.priority !== filterPriority) return false;
    return true;
  });

  const handleAssignWorker = (workerId: string) => {
    // Simulate assignment
    alert(`Issue assigned to ${mockWorkers.find(w => w.id === workerId)?.name}`);
    setShowAssignModal(false);
    setSelectedIssue(null);
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complaint Management</h1>
          <p className="text-gray-600">Review, prioritize, and assign civic issues to field workers</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search issues..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as IssuePriority | 'all')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* AI Routing Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">AI</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">AI-Powered Auto-Routing Active</h3>
              <p className="text-sm text-gray-600 mb-3">
                Issues are automatically classified and routed to the appropriate department based on AI analysis
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  ✓ {filteredIssues.filter(i => i.department).length} Auto-classified
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  ✓ Priority scoring enabled
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  ✓ Duplicate detection active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="relative">
              <IssueCard issue={issue} onClick={() => handleIssueClick(issue)} />
              <div className="mt-4 flex space-x-2">
                {!issue.assignedTo && (
                  <button
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowAssignModal(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Assign Worker</span>
                  </button>
                )}
                {issue.status === 'submitted' && (
                  <button className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    <span className="text-sm font-medium">Acknowledge</span>
                  </button>
                )}
                {issue.assignedTo && issue.status !== 'resolved' && (
                  <div className="flex-1 bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg">
                    <div className="text-xs text-purple-600 mb-1">Assigned to</div>
                    <div className="text-sm font-medium text-gray-900">
                      {mockWorkers.find(w => w.id === issue.assignedTo)?.name || 'Worker'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Assign Worker Modal */}
        {showAssignModal && selectedIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Assign Worker</h2>
                <p className="text-gray-600 mt-1">{selectedIssue.title}</p>
              </div>

              <div className="p-6">
                {/* AI Suggestion */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Recommended Assignment</p>
                      <p className="text-sm text-gray-600">
                        Based on proximity, workload, and SLA compliance, we suggest assigning to:
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockWorkers
                    .filter(w => w.department === selectedIssue.department)
                    .map((worker, index) => (
                      <button
                        key={worker.id}
                        onClick={() => handleAssignWorker(worker.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                          index === 0
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-gray-900">{worker.name}</h3>
                              {index === 0 && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                  AI Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{worker.department}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                              <span>Active: {worker.activeTasksCount}</span>
                              <span>Completed: {worker.completedTasksCount}</span>
                              <span className="text-green-600">
                                SLA: {worker.slaComplianceRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedIssue(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue Detail Modal */}
        {showDetailModal && selectedIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedIssue.title}</h2>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(selectedIssue.status)}`}>
                        {selectedIssue.status.replace('-', ' ')}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full capitalize ${getPriorityColor(selectedIssue.priority)}`}>
                        {selectedIssue.priority} Priority
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {selectedIssue.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedIssue(null);
                    }}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Images */}
                {selectedIssue.images && selectedIssue.images.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Issue Images ({selectedIssue.images.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedIssue.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Issue ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedIssue.description}</p>
                </div>

                {/* Key Information Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Location</p>
                        <p className="text-sm text-gray-600">{selectedIssue.location.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedIssue.location.lat.toFixed(4)}, {selectedIssue.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  {selectedIssue.department && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Building2 className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Department</p>
                          <p className="text-sm text-gray-600">{selectedIssue.department}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reported By */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Reported By</p>
                        <p className="text-sm text-gray-600">Citizen ID: {selectedIssue.reportedBy}</p>
                      </div>
                    </div>
                  </div>

                  {/* Upvotes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Community Support</p>
                        <p className="text-sm text-gray-600">{selectedIssue.upvotes} upvotes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Issue Reported</p>
                        <p className="text-xs text-gray-500">
                          {format(selectedIssue.reportedAt, 'PPpp')} ({formatDistanceToNow(selectedIssue.reportedAt, { addSuffix: true })})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-500">
                          {format(selectedIssue.updatedAt, 'PPpp')} ({formatDistanceToNow(selectedIssue.updatedAt, { addSuffix: true })})
                        </p>
                      </div>
                    </div>
                    {selectedIssue.slaDeadline && (
                      <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">SLA Deadline</p>
                          <p className="text-xs text-gray-500">
                            {format(selectedIssue.slaDeadline, 'PPpp')} ({formatDistanceToNow(selectedIssue.slaDeadline, { addSuffix: true })})
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedIssue.resolvedAt && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Issue Resolved</p>
                          <p className="text-xs text-gray-500">
                            {format(selectedIssue.resolvedAt, 'PPpp')} ({formatDistanceToNow(selectedIssue.resolvedAt, { addSuffix: true })})
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assigned Worker */}
                {selectedIssue.assignedTo && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Assigned Worker</h3>
                    {(() => {
                      const worker = mockWorkers.find(w => w.id === selectedIssue.assignedTo);
                      return worker ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={worker.avatar}
                              alt={worker.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{worker.name}</p>
                              <p className="text-sm text-gray-600">{worker.department}</p>
                              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                <span>Active Tasks: {worker.activeTasksCount}</span>
                                <span>Completed: {worker.completedTasksCount}</span>
                                <span className="text-green-600">SLA: {worker.slaComplianceRate}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Worker information not available</p>
                      );
                    })()}
                  </div>
                )}

                {/* Proof of Work */}
                {selectedIssue.proofOfWork && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Proof of Work</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Before</p>
                          <div className="grid gap-2">
                            {selectedIssue.proofOfWork.beforeImages.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Before ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">After</p>
                          <div className="grid gap-2">
                            {selectedIssue.proofOfWork.afterImages.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`After ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Completion Notes</p>
                        <p className="text-sm text-gray-700">{selectedIssue.proofOfWork.notes}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Completed: {format(selectedIssue.proofOfWork.completedAt, 'PPpp')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sponsorship */}
                {selectedIssue.sponsored && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">CSR Sponsorship</h3>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedIssue.sponsored.sponsorName}</p>
                          <p className="text-xs text-gray-600">Sponsor ID: {selectedIssue.sponsored.sponsorId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-700">${selectedIssue.sponsored.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Sponsored Amount</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-200 flex justify-between sticky bottom-0 bg-white">
                <div className="flex space-x-3">
                  {!selectedIssue.assignedTo && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowAssignModal(true);
                      }}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Assign Worker</span>
                    </button>
                  )}
                  {selectedIssue.status === 'submitted' && (
                    <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedIssue(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}