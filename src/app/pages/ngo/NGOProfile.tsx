import { Building2, Mail, Phone, MapPin, Globe, Heart, Calendar, Award, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';

export function NGOProfile() {
  const profile = {
    name: 'Clean City Foundation',
    type: 'Corporate Social Responsibility',
    registrationNo: 'CSR-2020-4567',
    email: 'contact@cleancityfoundation.org',
    phone: '+91 11 4567 8900',
    address: 'Corporate Tower, Business District, New Delhi',
    website: 'www.cleancityfoundation.org',
    established: '2020-01-15',
    focusAreas: ['Sanitation', 'Infrastructure', 'Water Supply', 'Environment']
  };

  const stats = [
    { label: 'Total Projects', value: '20', icon: Heart, color: 'pink' },
    { label: 'Total Investment', value: '₹50.2L', icon: TrendingUp, color: 'green' },
    { label: 'Lives Impacted', value: '1.5L', icon: Users, color: 'blue' },
    { label: 'Years Active', value: '6', icon: Calendar, color: 'purple' }
  ];

  const teamMembers = [
    { name: 'Rajesh Kumar', role: 'CSR Head', email: 'rajesh@cleancity.org' },
    { name: 'Priya Sharma', role: 'Project Manager', email: 'priya@cleancity.org' },
    { name: 'Amit Verma', role: 'Impact Analyst', email: 'amit@cleancity.org' }
  ];

  const partnerships = [
    { organization: 'Municipal Corporation', since: '2020', projects: 15 },
    { organization: 'State Government', since: '2021', projects: 8 },
    { organization: 'Local NGOs', since: '2020', projects: 12 }
  ];

  const recognitions = [
    { title: 'Best CSR Initiative', year: '2025', awardedBy: 'National CSR Summit' },
    { title: 'Excellence in Social Impact', year: '2024', awardedBy: 'India CSR Awards' },
    { title: 'Sustainability Champion', year: '2023', awardedBy: 'Green India Foundation' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-5xl border-4 border-white/30">
                <Building2 className="w-16 h-16" />
              </div>
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-pink-500 border-4 border-white rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-pink-100 mb-1">{profile.type}</p>
              <p className="text-pink-200 mb-4">Reg. No: {profile.registrationNo}</p>
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
                  <Globe className="w-4 h-4" />
                  <span>{profile.website}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5" />
              <span>{profile.address}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.focusAreas.map((area, index) => (
                <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur rounded-lg text-sm">
                  {area}
                </span>
              ))}
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
          {/* Team Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Team Members</h2>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Partnerships */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Key Partnerships</h2>
            <div className="space-y-4">
              {partnerships.map((partner, index) => (
                <div key={index} className="p-4 border-l-4 border-pink-500 bg-pink-50 rounded-r-xl">
                  <h3 className="font-semibold text-gray-900 mb-1">{partner.organization}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Since {partner.since}</span>
                    <span>•</span>
                    <span>{partner.projects} joint projects</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recognitions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Awards & Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recognitions.map((recognition, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 text-center"
              >
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-semibold text-gray-900 mb-2">{recognition.title}</h3>
                <p className="text-sm text-gray-600">{recognition.year}</p>
                <p className="text-xs text-gray-500 mt-1">{recognition.awardedBy}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-pink-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            To create sustainable and impactful change in urban communities through strategic CSR initiatives 
            that address critical civic issues, improve quality of life, and foster citizen engagement.
          </p>
          <p className="text-gray-600">
            We believe in transparent, data-driven social impact that creates lasting value for communities 
            while building strong partnerships with government and civil society organizations.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
