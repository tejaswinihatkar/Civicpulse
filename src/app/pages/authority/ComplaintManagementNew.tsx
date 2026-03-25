import { useState, useEffect } from 'react';
import { Search, UserPlus, CheckCircle, AlertCircle, MapPin, Calendar, X, Eye, Loader2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getComplaints, getWorkers, acknowledgeComplaint, assignComplaint } from '../../services/api';
import { Issue } from '../../types';
import { format } from 'date-fns';

export function ComplaintManagementNew() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [complaintsData, workersData] = await Promise.all([
        getComplaints(),
        getWorkers()
      ]);
      setIssues(complaintsData);
      setWorkers(workersData);
    } catch (error) {
      console.error('Failed to load management data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (filterPriority !== 'all' && issue.priority !== filterPriority) return false;
    return true;
  });

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeComplaint(id);
      loadData();
    } catch (error) {
      alert('Failed to acknowledge');
    }
  };

  const handleAssignWorker = async (workerId: string) => {
    if (!selectedIssue) return;
    try {
      await assignComplaint(selectedIssue.id, workerId);
      setShowAssignModal(false);
      setSelectedIssue(null);
      loadData();
    } catch (error) {
      alert('Failed to assign worker');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-purple-100 text-purple-700';
      case 'acknowledged': return 'bg-blue-100 text-blue-700';
      case 'submitted': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading && issues.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Complaint Control Center</h1>
            <p className="text-slate-600 font-medium">Review, triage, and dispatch field teams across the city.</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
             <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">Real-time</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-6 mb-8 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, category, or ID..."
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Issue & Reporter</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Priority</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Engagement</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{issue.title}</div>
                        <div className="text-sm text-slate-500 font-medium">
                          {issue.category} • {issue.reportedBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-slate-900 font-bold">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {issue.location.address}
                      </div>
                      <div className="text-xs text-slate-500 font-medium ml-6">{issue.department || 'Awaiting Routing'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-blue-600 font-black">
                        <motion.div whileHover={{ scale: 1.2 }}><TrendingUp className="w-4 h-4" /></motion.div>
                        {issue.upvotes}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedIssue(issue); setShowDetailsModal(true); }}
                          className="p-3 text-slate-600 hover:bg-white rounded-xl hover:shadow-md transition-all border border-transparent hover:border-slate-200"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {issue.status === 'submitted' && (
                          <button
                            onClick={() => handleAcknowledge(issue.id)}
                            className="p-3 text-green-600 hover:bg-green-50 rounded-xl hover:shadow-md transition-all border border-transparent hover:border-green-200"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {!issue.assignedTo && (
                          <button
                            onClick={() => { setSelectedIssue(issue); setShowAssignModal(true); }}
                            className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl hover:shadow-md transition-all border border-transparent hover:border-purple-200"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedIssue && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              >
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Issue Dossier</h2>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">ID: CIV-{selectedIssue.id}</p>
                    </div>
                    <button onClick={() => setShowDetailsModal(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                      <X className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto space-y-8">
                    {selectedIssue.images && selectedIssue.images.length > 0 && (
                      <div className="rounded-2xl overflow-hidden h-72 border border-slate-200">
                        <img src={selectedIssue.images[0]} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-6">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-4">{selectedIssue.title}</h3>
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium">
                            {selectedIssue.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-blue-400 uppercase">Status</span>
                              <span className="font-bold text-blue-700 capitalize">{selectedIssue.status}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-blue-400 uppercase">Priority</span>
                              <span className="font-bold text-blue-700 capitalize">{selectedIssue.priority}</span>
                           </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <MapPin className="text-blue-600" />
                            <span className="font-bold text-slate-700">{selectedIssue.location.address}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="text-purple-600" />
                            <span className="font-bold text-slate-700">{format(selectedIssue.reportedAt, 'PPP')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                      {selectedIssue.status === 'submitted' && (
                        <button
                          onClick={() => handleAcknowledge(selectedIssue.id)}
                          className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                        >
                          Acknowledge Receipt
                        </button>
                      )}
                      {!selectedIssue.assignedTo && (
                        <button
                          onClick={() => { setShowDetailsModal(false); setShowAssignModal(true); }}
                          className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                        >
                          Dispatch Worker
                        </button>
                      )}
                  </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Assign Modal */}
        <AnimatePresence>
          {showAssignModal && selectedIssue && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
              >
                 <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50 /50">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Field Agent</h2>
                      <p className="text-slate-500 font-bold text-xs tracking-widest mt-1">FOR: {selectedIssue.title.toUpperCase()}</p>
                    </div>
                    <button onClick={() => setShowAssignModal(false)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-4">
                    {workers.map((worker) => (
                      <button
                        key={worker.id}
                        onClick={() => handleAssignWorker(worker.id)}
                        className="w-full flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 hover:scale-[1.02] transition-all group"
                      >
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                               <img src={worker.avatar || `https://ui-avatars.com/api/?name=${worker.name}&background=random`} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                               <div className="font-black text-slate-900 group-hover:text-blue-700">{worker.name}</div>
                               <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{worker.department}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-lg font-black text-slate-900">{worker.activeTasksCount}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">load</div>
                         </div>
                      </button>
                    ))}
                    {workers.length === 0 && (
                      <div className="text-center py-10">
                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No active workers found in this department.</p>
                      </div>
                    )}
                  </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
