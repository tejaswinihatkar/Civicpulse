import { useState } from 'react';
import { Heart, MapPin, Calendar, TrendingUp, Users, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  beneficiaries: number;
  tasksCompleted: number;
  tasksTotal: number;
  image: string;
}

export function NGOProjects() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'planned'>('all');

  const projects: Project[] = [
    {
      id: '1',
      title: 'Clean Parks Initiative',
      category: 'Sanitation',
      location: 'Central Park, Sector 8',
      budget: 500000,
      spent: 350000,
      startDate: '2026-01-15',
      endDate: '2026-06-30',
      status: 'active',
      beneficiaries: 15000,
      tasksCompleted: 12,
      tasksTotal: 20,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'
    },
    {
      id: '2',
      title: 'Street Light Modernization',
      category: 'Infrastructure',
      location: 'MG Road Area',
      budget: 750000,
      spent: 450000,
      startDate: '2026-02-01',
      endDate: '2026-08-31',
      status: 'active',
      beneficiaries: 25000,
      tasksCompleted: 18,
      tasksTotal: 35,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: '3',
      title: 'Road Repair Drive',
      category: 'Roads',
      location: 'Highway 24',
      budget: 1000000,
      spent: 1000000,
      startDate: '2025-11-01',
      endDate: '2026-02-28',
      status: 'completed',
      beneficiaries: 50000,
      tasksCompleted: 45,
      tasksTotal: 45,
      image: 'https://images.unsplash.com/photo-1625726411847-8cbb60cc71e6?w=400'
    },
    {
      id: '4',
      title: 'Community Water Project',
      category: 'Water Supply',
      location: 'Sector 10-15',
      budget: 800000,
      spent: 0,
      startDate: '2026-04-01',
      endDate: '2026-12-31',
      status: 'planned',
      beneficiaries: 30000,
      tasksCompleted: 0,
      tasksTotal: 25,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400'
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'planned': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const totalBeneficiaries = projects.reduce((sum, p) => sum + p.beneficiaries, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sponsored Projects</h1>
          <p className="text-gray-600">Track and manage your CSR initiatives</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{projects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₹{(totalBudget / 100000).toFixed(1)}L</div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₹{(totalSpent / 100000).toFixed(1)}L</div>
            <div className="text-sm text-gray-600">Funds Utilized</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{(totalBeneficiaries / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Lives Impacted</div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Completed
          </button>
          <button
            onClick={() => setFilter('planned')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'planned'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Planned
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{project.beneficiaries.toLocaleString()} beneficiaries</span>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Budget Utilization</span>
                    <span className="font-medium text-gray-900">
                      ₹{(project.spent / 100000).toFixed(1)}L / ₹{(project.budget / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(project.spent / project.budget) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Task Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tasks Progress</span>
                    <span className="font-medium text-gray-900">
                      {project.tasksCompleted} / {project.tasksTotal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(project.tasksCompleted / project.tasksTotal) * 100}%` }}
                    />
                  </div>
                </div>

                <button className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow font-medium">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
