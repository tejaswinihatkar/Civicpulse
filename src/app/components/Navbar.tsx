import { Link, useLocation } from 'react-router';
import { Menu, Bell, User, LogOut, X } from 'lucide-react';
import { useState } from 'react';

import { getStoredUser, logout } from '../services/api';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getStoredUser();

  const userRole = user?.role?.toLowerCase();
  const userName = user?.name;

  const getRoleLinks = () => {
    switch (userRole) {
      case 'citizen':
        return [
          { path: '/citizen', label: 'Dashboard' },
          { path: '/citizen/report', label: 'Report Issue' },
          { path: '/citizen/my-issues', label: 'My Issues' },
          { path: '/citizen/reels', label: 'Reels' },
          { path: '/citizen/rewards', label: 'Rewards' },
          { path: '/citizen/profile', label: 'Profile' }
        ];
      case 'authority':
        return [
          { path: '/authority', label: 'Dashboard' },
          { path: '/authority/complaints', label: 'Complaints' },
          { path: '/authority/workers', label: 'Workers' },
          { path: '/authority/analytics', label: 'Analytics' },
          { path: '/authority/profile', label: 'Profile' }
        ];
      case 'worker':
        return [
          { path: '/worker', label: 'My Tasks' },
          { path: '/worker/calendar', label: 'Calendar' },
          { path: '/worker/performance', label: 'Performance' },
          { path: '/worker/profile', label: 'Profile' }
        ];
      case 'ngo':
        return [
          { path: '/ngo', label: 'Dashboard' },
          { path: '/ngo/projects', label: 'Projects' },
          { path: '/ngo/impact', label: 'Impact' },
          { path: '/ngo/profile', label: 'Profile' }
        ];
      default:
        return [];
    }
  };

  const links = getRoleLinks();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25"></div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CivicPulse
              </span>
            </Link>

            {/* Desktop Navigation */}
            {links.length > 0 && (
              <div className="hidden md:flex ml-10 space-x-1">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {userName && (
              <>
                <button className="p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                <div className="hidden sm:flex items-center space-x-2.5 px-3 py-1.5 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {userName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Mobile menu button */}
            {links.length > 0 && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && links.length > 0 && (
          <div className="md:hidden pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg transition-all ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}