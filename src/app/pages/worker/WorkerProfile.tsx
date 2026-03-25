import { User, Mail, Phone, MapPin, Briefcase, Calendar, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function WorkerProfile() {
  const profile = {
    name: 'Suresh Singh',
    employeeId: 'WK-2024-128',
    designation: 'Field Worker',
    department: 'Sanitation & Infrastructure',
    email: 'suresh.singh@civic.gov',
    phone: '+91 98765 43210',
    zone: 'Zone A - Sector 10-15',
    joinDate: '2024-03-15',
    rating: 4.8,
    completionRate: 94
  };

  const stats = [
    { label: 'Total Tasks', value: '156', icon: Briefcase, color: 'blue' },
    { label: 'Completed', value: '147', icon: CheckCircle, color: 'green' },
    { label: 'In Progress', value: '7', icon: TrendingUp, color: 'yellow' },
    { label: 'Years of Service', value: '2', icon: Calendar, color: 'purple' }
  ];

  const skills = [
    'Electrical Repairs',
    'Road Maintenance',
    'Plumbing',
    'Sanitation',
    'Tree Trimming',
    'Infrastructure'
  ];

  const certifications = [
    { name: 'Safety Training', issueDate: '2024-04-20', expiryDate: '2026-04-20' },
    { name: 'Electrical Works License', issueDate: '2023-06-15', expiryDate: '2027-06-15' },
    { name: 'First Aid Training', issueDate: '2024-01-10', expiryDate: '2025-01-10' }
  ];

  const recentWork = [
    { task: 'Street Light Repair', location: 'MG Road', date: '2026-03-12', rating: 5 },
    { task: 'Pothole Filling', location: 'Highway 24', date: '2026-03-11', rating: 4.5 },
    { task: 'Garbage Collection', location: 'Central Park', date: '2026-03-10', rating: 5 },
    { task: 'Drainage Cleaning', location: 'Park Street', date: '2026-03-09', rating: 4.8 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-5xl border-4 border-white/30">
                <User className="w-16 h-16" />
              </div>
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-green-100 mb-1">{profile.designation}</p>
              <p className="text-green-200 mb-4">{profile.department}</p>
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
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">⭐</div>
              <div className="text-2xl font-bold">{profile.rating}</div>
              <div className="text-sm text-green-100">Rating</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-green-200 mb-1">Employee ID</div>
              <div className="font-semibold">{profile.employeeId}</div>
            </div>
            <div>
              <div className="text-sm text-green-200 mb-1">Joined</div>
              <div className="font-semibold">{new Date(profile.joinDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-green-200 mb-1">Completion Rate</div>
              <div className="font-semibold">{profile.completionRate}%</div>
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
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Certifications
            </h2>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{cert.name}</h3>
                  <div className="text-sm text-gray-600">
                    <p>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                    <p>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Work</h2>
          <div className="space-y-4">
            {recentWork.map((work, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{work.task}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {work.location}
                    </span>
                    <span>{new Date(work.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-semibold text-gray-900">{work.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
