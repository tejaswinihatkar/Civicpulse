import { createBrowserRouter, Navigate } from 'react-router';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportIssue } from './pages/citizen/ReportIssue';
import { CitizenRewards } from './pages/citizen/CitizenRewards';
import { IssueDetails } from './pages/citizen/IssueDetails';
import { CitizenReels } from './pages/citizen/CitizenReels';
import { CitizenProfile } from './pages/citizen/CitizenProfile';
import { AuthorityDashboard } from './pages/authority/AuthorityDashboard';
import { ComplaintManagementNew } from './pages/authority/ComplaintManagementNew';
import { WorkersManagement } from './pages/authority/WorkersManagement';
import { AuthorityProfile } from './pages/authority/AuthorityProfile';
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerCalendar } from './pages/worker/WorkerCalendar';
import { WorkerPerformance } from './pages/worker/WorkerPerformance';
import { WorkerProfile } from './pages/worker/WorkerProfile';
import { NGODashboard } from './pages/ngo/NGODashboard';
import { NGOProjects } from './pages/ngo/NGOProjects';
import { NGOImpact } from './pages/ngo/NGOImpact';
import { NGOProfile } from './pages/ngo/NGOProfile';
import { Navbar } from './components/Navbar';
import { getStoredUser } from './services/api';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to={`/login${role ? `?role=${role.toLowerCase()}` : ''}`} replace />;
  }
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  // Citizen Routes
  {
    path: '/citizen',
    element: <ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>
  },
  {
    path: '/citizen/report',
    element: <ProtectedRoute role="citizen"><ReportIssue /></ProtectedRoute>
  },
  {
    path: '/citizen/my-issues',
    element: <ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>
  },
  {
    path: '/citizen/rewards',
    element: <ProtectedRoute role="citizen"><CitizenRewards /></ProtectedRoute>
  },
  {
    path: '/citizen/issue-details',
    element: <ProtectedRoute role="citizen"><IssueDetails /></ProtectedRoute>
  },
  {
    path: '/citizen/reels',
    element: <ProtectedRoute role="citizen"><CitizenReels /></ProtectedRoute>
  },
  {
    path: '/citizen/profile',
    element: <ProtectedRoute role="citizen"><CitizenProfile /></ProtectedRoute>
  },
  // Authority Routes
  {
    path: '/authority',
    element: <ProtectedRoute role="authority"><AuthorityDashboard /></ProtectedRoute>
  },
  {
    path: '/authority/complaints',
    element: <ProtectedRoute role="authority"><ComplaintManagementNew /></ProtectedRoute>
  },
  {
    path: '/authority/workers',
    element: <ProtectedRoute role="authority"><WorkersManagement /></ProtectedRoute>
  },
  {
    path: '/authority/analytics',
    element: <ProtectedRoute role="authority"><AuthorityDashboard /></ProtectedRoute>
  },
  {
    path: '/authority/profile',
    element: <ProtectedRoute role="authority"><AuthorityProfile /></ProtectedRoute>
  },
  // Worker Routes
  {
    path: '/worker',
    element: <ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>
  },
  {
    path: '/worker/calendar',
    element: <ProtectedRoute role="worker"><WorkerCalendar /></ProtectedRoute>
  },
  {
    path: '/worker/performance',
    element: <ProtectedRoute role="worker"><WorkerPerformance /></ProtectedRoute>
  },
  {
    path: '/worker/profile',
    element: <ProtectedRoute role="worker"><WorkerProfile /></ProtectedRoute>
  },
  // NGO Routes
  {
    path: '/ngo',
    element: <ProtectedRoute role="ngo"><NGODashboard /></ProtectedRoute>
  },
  {
    path: '/ngo/projects',
    element: <ProtectedRoute role="ngo"><NGOProjects /></ProtectedRoute>
  },
  {
    path: '/ngo/impact',
    element: <ProtectedRoute role="ngo"><NGOImpact /></ProtectedRoute>
  },
  {
    path: '/ngo/profile',
    element: <ProtectedRoute role="ngo"><NGOProfile /></ProtectedRoute>
  }
]);