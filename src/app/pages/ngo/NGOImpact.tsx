import { TrendingUp, Users, Heart, DollarSign, MapPin, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';

export function NGOImpact() {
  const stats = [
    { label: 'Total Investment', value: '₹30.5L', change: '+15%', icon: DollarSign, color: 'green' },
    { label: 'Lives Impacted', value: '1,20,000', change: '+32%', icon: Users, color: 'blue' },
    { label: 'Projects Completed', value: '12', change: '+3', icon: Heart, color: 'pink' },
    { label: 'Active Initiatives', value: '8', change: 'ongoing', icon: TrendingUp, color: 'purple' }
  ];

  const monthlyInvestment = [
    { month: 'Oct', amount: 8.5 },
    { month: 'Nov', amount: 10.2 },
    { month: 'Dec', amount: 7.8 },
    { month: 'Jan', amount: 12.5 },
    { month: 'Feb', amount: 11.3 },
    { month: 'Mar', amount: 13.7 }
  ];

  const categoryDistribution = [
    { name: 'Sanitation', value: 35, color: '#8b5cf6' },
    { name: 'Infrastructure', value: 28, color: '#3b82f6' },
    { name: 'Water Supply', value: 22, color: '#10b981' },
    { name: 'Roads', value: 15, color: '#f59e0b' }
  ];

  const impactMetrics = [
    { area: 'Parks Cleaned', value: 45, target: 50 },
    { area: 'Lights Installed', value: 320, target: 400 },
    { area: 'Roads Repaired', value: 28, target: 35 },
    { area: 'Water Points', value: 15, target: 20 }
  ];

  const geographicImpact = [
    { zone: 'Zone A', projects: 5, beneficiaries: 35000, investment: 12.5 },
    { zone: 'Zone B', projects: 4, beneficiaries: 28000, investment: 9.8 },
    { zone: 'Zone C', projects: 3, beneficiaries: 22000, investment: 8.2 },
    { zone: 'Zone D', projects: 2, beneficiaries: 15000, investment: 5.5 }
  ];

  const achievements = [
    { title: 'Community Champion', description: 'Impacted 100K+ lives', icon: '🏆' },
    { title: 'Green Initiative', description: 'Cleaned 40+ parks', icon: '🌳' },
    { title: 'Infrastructure Builder', description: 'Built/repaired 500+ assets', icon: '🏗️' },
    { title: 'Citizen Partner', description: '5 years of CSR excellence', icon: '🤝' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Impact Dashboard</h1>
          <p className="text-gray-600">Measure and track the impact of your CSR initiatives</p>
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
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Investment Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Investment Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyInvestment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}L`} />
                <Line type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Investment by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Impact Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{metric.area}</span>
                  <span className="text-gray-600">{metric.value} / {metric.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-600 to-purple-600 h-3 rounded-full"
                    style={{ width: `${(metric.value / metric.target) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {Math.round((metric.value / metric.target) * 100)}% Complete
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Geographic Impact</h2>
          <div className="space-y-4">
            {geographicImpact.map((zone, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {zone.zone[zone.zone.length - 1]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{zone.zone}</h3>
                      <p className="text-sm text-gray-600">{zone.projects} active projects</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{zone.investment}L</p>
                    <p className="text-sm text-gray-600">Investment</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{zone.beneficiaries.toLocaleString()} beneficiaries</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{zone.projects} locations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            CSR Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200"
              >
                <div className="text-5xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
