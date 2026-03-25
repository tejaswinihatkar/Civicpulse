import { useState, useEffect } from 'react';
import { User, MapPin, CheckCircle, Clock, TrendingUp, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getWorkers } from '../../services/api';

export function WorkersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const data = await getWorkers();
        setWorkers(data || []);
      } catch (error) {
        console.error('Failed to load workers', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(worker => {
    if (!searchTerm) return true;
    return worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           worker.department?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalTasks = workers.reduce((sum: number, w: any) => sum + (w.completedTasksCount || 0) + (w.activeTasksCount || 0), 0);
  const avgTasksPerWorker = workers.length > 0 ? Math.round(totalTasks / workers.length) : 0;
  const availableWorkers = workers.filter((w: any) => (w.activeTasksCount || 0) < 5).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Workers Management</h1>
          <p className="text-slate-600">Monitor and manage field workers and task distribution — live from database</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{workers.length}</div>
            <div className="text-sm text-slate-600">Total Workers</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{availableWorkers}</div>
            <div className="text-sm text-slate-600">Available Now</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{totalTasks}</div>
            <div className="text-sm text-slate-600">Total Tasks Assigned</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{avgTasksPerWorker}</div>
            <div className="text-sm text-slate-600">Avg Tasks/Worker</div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWorkers.map((worker: any, index: number) => {
            const totalAssigned = (worker.completedTasksCount || 0) + (worker.activeTasksCount || 0);
            const completionRate = totalAssigned > 0 ? Math.round(((worker.completedTasksCount || 0) / totalAssigned) * 100) : 0;
            const isAvailable = (worker.activeTasksCount || 0) < 5;

            return (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={worker.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random`}
                        alt={worker.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      <div className={`absolute bottom-0 right-0 w-4 h-4 ${isAvailable ? 'bg-green-500' : 'bg-yellow-500'} border-2 border-white rounded-full`}></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{worker.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {worker.department || 'Unassigned'}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {isAvailable ? 'available' : 'busy'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{worker.activeTasksCount || 0}</div>
                    <div className="text-xs text-slate-600">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{worker.completedTasksCount || 0}</div>
                    <div className="text-xs text-slate-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{worker.slaComplianceRate || 0}%</div>
                    <div className="text-xs text-slate-600">SLA</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Completion Rate</span>
                    <span className="font-medium text-slate-900">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-medium text-slate-900">{worker.rating || 'N/A'}</span>
                    <span className="text-slate-600 text-sm">Rating</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No workers found</h3>
            <p className="text-slate-600">Try adjusting your search or register workers in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
