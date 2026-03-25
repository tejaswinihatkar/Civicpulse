import { TrendingUp, Award, CheckCircle, Clock, Star, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';

export function WorkerPerformance() {
  const stats = [
    { label: 'Tasks Completed', value: '156', change: '+12%', icon: CheckCircle, color: 'green' },
    { label: 'Avg Response Time', value: '2.4h', change: '-15%', icon: Clock, color: 'blue' },
    { label: 'Rating', value: '4.8', change: '+0.2', icon: Star, color: 'yellow' },
    { label: 'Completion Rate', value: '94%', change: '+5%', icon: Target, color: 'purple' }
  ];

  const monthlyData = [
    { month: 'Jan', completed: 45, assigned: 48 },
    { month: 'Feb', completed: 52, assigned: 55 },
    { month: 'Mar', completed: 59, assigned: 62 }
  ];

  const categoryData = [
    { name: 'Infrastructure', value: 45, color: '#3b82f6' },
    { name: 'Sanitation', value: 38, color: '#8b5cf6' },
    { name: 'Water Supply', value: 32, color: '#10b981' },
    { name: 'Roads', value: 41, color: '#f59e0b' }
  ];

  const weeklyPerformance = [
    { day: 'Mon', tasks: 8 },
    { day: 'Tue', tasks: 12 },
    { day: 'Wed', tasks: 10 },
    { day: 'Thu', tasks: 14 },
    { day: 'Fri', tasks: 11 },
    { day: 'Sat', tasks: 6 },
    { day: 'Sun', tasks: 4 }
  ];

  const achievements = [
    { title: 'Quick Responder', description: 'Completed 10 tasks within 2 hours', icon: '⚡', earned: true },
    { title: 'Perfect Week', description: '100% completion rate for 7 days', icon: '💯', earned: true },
    { title: 'Task Master', description: 'Completed 100+ tasks', icon: '🏆', earned: true },
    { title: 'Citizen Favorite', description: 'Received 50+ positive ratings', icon: '⭐', earned: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Metrics</h1>
          <p className="text-gray-600">Track your work performance and achievements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar key="bar-assigned" dataKey="assigned" fill="#e5e7eb" name="Assigned" />
                <Bar key="bar-completed" dataKey="completed" fill="#3b82f6" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weekly Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tasks by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Achievements
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                      : 'bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}