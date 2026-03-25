import { User, Mail, Phone, MapPin, Shield, Award, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function AuthorityProfile() {
  const profile = {
    name: 'Dr. Rajesh Gupta',
    designation: 'Municipal Commissioner',
    department: 'Civic Administration',
    email: 'rajesh.gupta@civic.gov.in',
    phone: '+91 11 2345 6789',
    office: 'Municipal Corporation Building, Connaught Place',
    joinDate: '2020-04-15',
    employeeId: 'MC-2020-456',
    zone: 'Central District'
  };

  const stats = [
    { label: 'Total Issues Handled', value: '2,345', icon: TrendingUp, color: 'blue' },
    { label: 'Resolved', value: '2,103', icon: CheckCircle, color: 'green' },
    { label: 'Workers Managed', value: '48', icon: User, color: 'purple' },
    { label: 'Years of Service', value: '6', icon: Calendar, color: 'orange' }
  ];

  const achievements = [
    { title: 'Excellence in Public Service', year: '2025', icon: '🏆' },
    { title: 'Digital Transformation Leader', year: '2024', icon: '💻' },
    { title: 'Citizen Satisfaction Award', year: '2023', icon: '⭐' },
    { title: 'Best Administrator', year: '2022', icon: '👔' }
  ];

  const recentActivity = [
    { action: 'Assigned task', worker: 'Ramesh Kumar', date: '2026-03-13', time: '10:30 AM' },
    { action: 'Resolved complaint', issue: '#12345', date: '2026-03-12', time: '03:45 PM' },
    { action: 'Approved budget', project: 'Road Repair Project', date: '2026-03-11', time: '11:20 AM' },
    { action: 'Reviewed performance', worker: 'Suresh Singh', date: '2026-03-10', time: '02:15 PM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-5xl border-4 border-white/30">
                <User className="w-16 h-16" />
              </div>
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-purple-100 mb-1">{profile.designation}</p>
              <p className="text-purple-200 mb-4">{profile.department}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.zone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-purple-200 mb-1">Employee ID</div>
              <div className="font-semibold">{profile.employeeId}</div>
            </div>
            <div>
              <div className="text-sm text-purple-200 mb-1">Joined</div>
              <div className="font-semibold">{new Date(profile.joinDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-purple-200 mb-1">Office</div>
              <div className="font-semibold text-sm">HQ Building</div>
            </div>
            <div>
              <div className="text-sm text-purple-200 mb-1">Status</div>
              <div className="font-semibold">Active</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Achievements & Awards
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl"
                >
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.year}</p>
                  </div>
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
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.action}</span>{' '}
                      {activity.worker && <span className="text-blue-600">{activity.worker}</span>}
                      {activity.issue && <span className="text-blue-600">{activity.issue}</span>}
                      {activity.project && <span className="text-blue-600">{activity.project}</span>}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString()} at {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Office Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Office Address</h3>
                <p className="text-gray-600 text-sm">{profile.office}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Working Hours</h3>
                <p className="text-gray-600 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
