import { User, Mail, Phone, MapPin, Award, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export function CitizenProfile() {
  const profile = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Sector 14, New Delhi',
    joinDate: '2025-06-15',
    points: 1250,
    level: 'Gold Citizen',
    badge: '🏆'
  };

  const stats = [
    { label: 'Issues Reported', value: '24', icon: TrendingUp, color: 'blue' },
    { label: 'Issues Resolved', value: '18', icon: CheckCircle, color: 'green' },
    { label: 'Total Upvotes', value: '342', icon: Award, color: 'purple' },
    { label: 'Member Since', value: '9 months', icon: Calendar, color: 'orange' }
  ];

  const recentActivity = [
    { action: 'Reported', issue: 'Street Light Issue', date: '2026-03-12', status: 'In Progress' },
    { action: 'Upvoted', issue: 'Garbage Collection', date: '2026-03-11', status: 'Resolved' },
    { action: 'Commented on', issue: 'Park Maintenance', date: '2026-03-10', status: 'Pending' }
  ];

  const badges = [
    { name: 'Early Reporter', icon: '🌟', earned: true },
    { name: 'Community Helper', icon: '🤝', earned: true },
    { name: 'Top Contributor', icon: '🏆', earned: true },
    { name: 'Problem Solver', icon: '💡', earned: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl border-4 border-white/30">
              {profile.badge}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-blue-100 mb-4">{profile.level}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{profile.points}</div>
              <div className="text-sm text-blue-100">Civic Points</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Achievements & Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  badge.earned
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-medium text-gray-900">{badge.name}</div>
                {badge.earned && (
                  <div className="text-xs text-green-600 mt-1">Earned</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">{activity.action}</span>{' '}
                    <span className="text-blue-600">{activity.issue}</span>
                  </p>
                  <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.status === 'Resolved'
                      ? 'bg-green-100 text-green-700'
                      : activity.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
