import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, CheckCircle, Navigation, Camera, MessageCircle, Briefcase, X, Loader2, Upload, ImageIcon } from 'lucide-react';
import { getWorkerTasks, startWork, resolveComplaint, getStoredUser } from '../../services/api';
import { Issue } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export function WorkerDashboard() {
  const user = getStoredUser();
  const [tasks, setTasks] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [workNotes, setWorkNotes] = useState('');
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAfterImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getWorkerTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const activeTasks = tasks.filter(task => task.status === 'in-progress' || task.status === 'acknowledged');
  const completedToday = tasks.filter(task => 
    task.status === 'resolved' && 
    task.resolvedAt && 
    new Date(task.resolvedAt).toDateString() === new Date().toDateString()
  );

  const handleStartWork = async (id: string) => {
    try {
      await startWork(id);
      loadTasks();
    } catch (error) {
      alert('Failed to start work');
    }
  };

  const handleResolve = async () => {
    if (!selectedTask || !afterImagePreview) return;
    try {
      await resolveComplaint(selectedTask.id, {
        workNotes,
        beforeImages: selectedTask.images, // Pass existing images as before
        afterImages: [afterImagePreview] // Real image representation
      });
      setShowProofModal(false);
      setSelectedTask(null);
      setWorkNotes('');
      setAfterImagePreview(null);
      loadTasks();
    } catch (error) {
      alert('Failed to resolve task');
    }
  };

  const getSLAColor = (issue: Issue) => {
    if (!issue.slaDeadline) return 'text-slate-600';
    const hoursLeft = (new Date(issue.slaDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hoursLeft < 2) return 'text-red-600';
    if (hoursLeft < 6) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-blue-50/20 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-lg shadow-green-500/25">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Welcome, {user?.name}!</h1>
              <p className="text-slate-600">{user?.department} - Field Worker</p>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.02]">
            <div className="text-3xl font-bold mb-1">{user?.activeTasksCount || activeTasks.length}</div>
            <div className="text-sm text-blue-100">Active Tasks</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-green-500/25 transition-transform hover:scale-[1.02]">
            <div className="text-3xl font-bold mb-1">{user?.completedTasksCount || completedToday.length}</div>
            <div className="text-sm text-green-100">Total Completed</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-[1.02]">
            <div className="text-3xl font-bold mb-1">{user?.slaComplianceRate || 95}%</div>
            <div className="text-sm text-purple-100">SLA Compliance</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02]">
            <div className="text-3xl font-bold mb-1">{user?.rating || 4.8}</div>
            <div className="text-sm text-orange-100">Performance Rating</div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Active Tasks</h2>
            <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">{activeTasks.length} tasks</span>
          </div>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {activeTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                          {task.priority === 'critical' && (
                            <span className="text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg">
                              Critical
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 mb-4 leading-relaxed">{task.description}</p>

                        <div className="space-y-2.5">
                          <div className="flex items-center text-sm text-slate-600">
                            <MapPin className="w-4 h-4 mr-2.5 text-slate-400" />
                            <span>{task.location.address}</span>
                          </div>

                          {task.slaDeadline && (
                            <div className={`flex items-center text-sm ${getSLAColor(task)}`}>
                              <Clock className="w-4 h-4 mr-2.5" />
                              <span className="font-semibold">
                                Due {formatDistanceToNow(task.slaDeadline, { addSuffix: true })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {task.images && task.images.length > 0 && (
                        <img
                          src={task.images[0]}
                          alt={task.title}
                          className="w-24 h-24 object-cover rounded-xl ml-4 border border-slate-200"
                        />
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => window.open(`https://maps.google.com/?q=${task.location.lat},${task.location.lng}`, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all font-semibold"
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm">Navigate</span>
                      </button>

                      {task.status === 'acknowledged' && (
                        <button 
                          onClick={() => handleStartWork(task.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 hover:shadow-lg transition-all font-semibold"
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Start Work</span>
                        </button>
                      )}

                      {task.status === 'in-progress' && (
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowProofModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 hover:shadow-lg transition-all font-semibold"
                        >
                          <Camera className="w-4 h-4" />
                          <span className="text-sm">Upload Proof</span>
                        </button>
                      )}

                      <button className="px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* SLA Timer */}
                  {task.slaDeadline && (
                    <div className="bg-gradient-to-r from-slate-50 to-white px-5 sm:px-6 py-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium">SLA Progress</span>
                        <span className={`font-semibold ${getSLAColor(task)}`}>
                          {Math.max(0, Math.round((new Date(task.slaDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60)))}h remaining
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {activeTasks.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                  No active tasks assigned to you.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Completed Tasks Today */}
        {completedToday.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">Completed Today</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {completedToday.map((task) => (
                <div key={task.id} className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900 flex-1">{task.title}</h3>
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{task.location.address}</p>
                  {task.resolvedAt && (
                    <p className="text-xs font-semibold text-green-600">
                      Completed {formatDistanceToNow(task.resolvedAt, { addSuffix: true })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Proof Modal */}
        {showProofModal && selectedTask && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Upload Proof of Work</h2>
                  <p className="text-slate-600 mt-1">{selectedTask.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProofModal(false);
                    setSelectedTask(null);
                    setAfterImagePreview(null);
                  }}
                  className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Before Photos
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Initial photo attached from report</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    After Photos
                  </label>
                  
                  {afterImagePreview ? (
                    <div className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
                      <img src={afterImagePreview} alt="Work Proof" className="w-full h-48 object-cover" />
                      <button 
                        onClick={() => setAfterImagePreview(null)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer text-slate-500 hover:text-blue-600 group">
                        <Camera className="w-8 h-8 mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-semibold">Open Camera</span>
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageCapture} />
                      </label>
                      
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer text-slate-500 hover:text-purple-600 group">
                        <ImageIcon className="w-8 h-8 mb-2 text-slate-400 group-hover:text-purple-500 transition-colors" />
                        <span className="text-sm font-semibold">Upload Device</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageCapture} />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Work Notes
                  </label>
                  <textarea
                    rows={3}
                    value={workNotes}
                    onChange={(e) => setWorkNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Describe the work completed..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowProofModal(false);
                    setSelectedTask(null);
                    setAfterImagePreview(null);
                  }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleResolve}
                  disabled={!workNotes.trim() || !afterImagePreview}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}