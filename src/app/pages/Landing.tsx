import { Link } from 'react-router';
import { Users, Building2, Briefcase, Heart, ArrowRight, CheckCircle, TrendingUp, Award, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Landing() {
  const roles = [
    {
      title: 'Citizens',
      description: 'Report issues, track progress, and engage with your community',
      icon: Users,
      path: '/citizen',
      color: 'from-blue-500 to-blue-600',
      features: ['Report Issues', 'Track Status', 'Earn Rewards']
    },
    {
      title: 'Government Authority',
      description: 'Manage complaints, assign tasks, and monitor performance',
      icon: Building2,
      path: '/authority',
      color: 'from-purple-500 to-purple-600',
      features: ['AI Routing', 'Analytics', 'Staff Management']
    },
    {
      title: 'Field Workers',
      description: 'Receive tasks, update progress, and track performance',
      icon: Briefcase,
      path: '/worker',
      color: 'from-green-500 to-green-600',
      features: ['Task Calendar', 'GPS Navigation', 'Proof of Work']
    },
    {
      title: 'NGO / CSR',
      description: 'Sponsor projects and track social impact',
      icon: Heart,
      path: '/ngo',
      color: 'from-pink-500 to-pink-600',
      features: ['Adopt Issues', 'Impact Analytics', 'Brand Visibility']
    }
  ];

  const stats = [
    { label: 'Issues Resolved', value: '12,456', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Active Citizens', value: '45,230', icon: Users, color: 'text-blue-600' },
    { label: 'Avg Response Time', value: '4.2 hrs', icon: Clock, color: 'text-purple-600' },
    { label: 'CSR Funding', value: '₹7.5M', icon: TrendingUp, color: 'text-amber-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25"></div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CivicPulse
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200/60 rounded-full mb-6">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Civic Management</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Transform Your City with
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Smart Reporting
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A comprehensive platform connecting citizens, government, workers, and NGOs
            for transparent civic issue management with real-time tracking and AI-driven insights.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300"
              >
                <stat.icon className={`w-7 h-7 ${stat.color} mb-3 mx-auto`} />
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Choose Your Role
          </h2>
          <p className="text-lg text-slate-600">
            Select how you want to contribute to your community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={role.path}
                className="block bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group h-full"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                <p className="text-slate-600 mb-5 leading-relaxed">{role.description}</p>

                <ul className="space-y-2.5 mb-6">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 pt-3 border-t border-slate-100">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg"></div>
            <span className="font-bold text-xl tracking-tight">CivicPulse</span>
          </div>
          <p className="text-slate-400">
            Building smarter cities through technology and transparency
          </p>
        </div>
      </footer>
    </div>
  );
}