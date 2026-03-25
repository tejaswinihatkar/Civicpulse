import { Issue, User, Worker, NGO, Badge } from '../types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues and vehicle damage',
    category: 'road',
    status: 'in-progress',
    priority: 'high',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Main Street, Connaught Place, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1625465809518-56046973ecb7?w=800'],
    reportedBy: 'citizen-1',
    reportedAt: new Date('2026-03-12T09:30:00'),
    updatedAt: new Date('2026-03-13T10:00:00'),
    upvotes: 45,
    assignedTo: 'worker-1',
    department: 'Public Works',
    slaDeadline: new Date('2026-03-14T09:30:00')
  },
  {
    id: '2',
    title: 'Overflowing garbage bins near park',
    description: 'Multiple garbage bins overflowing, creating hygiene issues',
    category: 'garbage',
    status: 'submitted',
    priority: 'critical',
    location: {
      lat: 28.6145,
      lng: 77.2088,
      address: 'Central Park, Sector 15, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800'],
    reportedBy: 'citizen-2',
    reportedAt: new Date('2026-03-13T08:15:00'),
    updatedAt: new Date('2026-03-13T08:15:00'),
    upvotes: 78,
    department: 'Sanitation',
    slaDeadline: new Date('2026-03-14T08:15:00')
  },
  {
    id: '3',
    title: 'Streetlight not working',
    description: 'Dark street at night, safety concern for pedestrians',
    category: 'streetlight',
    status: 'resolved',
    priority: 'medium',
    location: {
      lat: 28.6150,
      lng: 77.2085,
      address: 'Park Lane, Sector 12, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1518331368925-fd8d678638d0?w=800'],
    reportedBy: 'citizen-3',
    reportedAt: new Date('2026-03-10T19:00:00'),
    updatedAt: new Date('2026-03-12T14:30:00'),
    upvotes: 23,
    assignedTo: 'worker-2',
    department: 'Electricity',
    slaDeadline: new Date('2026-03-12T19:00:00'),
    resolvedAt: new Date('2026-03-12T14:30:00'),
    proofOfWork: {
      beforeImages: ['https://images.unsplash.com/photo-1518331368925-fd8d678638d0?w=800'],
      afterImages: ['https://images.unsplash.com/photo-1509062522202-dfbf8f77873f?w=800'],
      completedAt: new Date('2026-03-12T14:30:00'),
      notes: 'Replaced faulty bulb and fixed wiring'
    }
  },
  {
    id: '4',
    title: 'Water leakage from main pipeline',
    description: 'Continuous water leakage wasting precious water resources',
    category: 'water',
    status: 'acknowledged',
    priority: 'critical',
    location: {
      lat: 28.6135,
      lng: 77.2095,
      address: 'Model Town, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1584555684040-bad07c4833f5?w=800'],
    reportedBy: 'citizen-4',
    reportedAt: new Date('2026-03-13T07:45:00'),
    updatedAt: new Date('2026-03-13T09:00:00'),
    upvotes: 92,
    department: 'Water Supply',
    slaDeadline: new Date('2026-03-14T07:45:00')
  },
  {
    id: '5',
    title: 'Blocked drainage causing waterlogging',
    description: 'Heavy waterlogging during rain due to blocked drainage',
    category: 'drainage',
    status: 'in-progress',
    priority: 'high',
    location: {
      lat: 28.6142,
      lng: 77.2082,
      address: 'Rajendra Place, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800'],
    reportedBy: 'citizen-5',
    reportedAt: new Date('2026-03-12T11:20:00'),
    updatedAt: new Date('2026-03-13T08:30:00'),
    upvotes: 67,
    assignedTo: 'worker-3',
    department: 'Drainage',
    slaDeadline: new Date('2026-03-15T11:20:00'),
    sponsored: {
      sponsorId: 'ngo-1',
      sponsorName: 'Clean City Foundation',
      amount: 50000
    }
  },
  {
    id: '6',
    title: 'Illegal dumping in residential area',
    description: 'Construction waste illegally dumped in residential area',
    category: 'garbage',
    status: 'submitted',
    priority: 'high',
    location: {
      lat: 28.6148,
      lng: 77.2078,
      address: 'Karol Bagh, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'],
    reportedBy: 'citizen-1',
    reportedAt: new Date('2026-03-13T06:00:00'),
    updatedAt: new Date('2026-03-13T06:00:00'),
    upvotes: 54,
    department: 'Sanitation',
    slaDeadline: new Date('2026-03-14T06:00:00')
  },
  {
    id: '7',
    title: 'Traffic signal malfunction',
    description: 'Traffic signal stuck on red, causing major congestion',
    category: 'traffic',
    status: 'acknowledged',
    priority: 'critical',
    location: {
      lat: 28.6137,
      lng: 77.2092,
      address: 'Outer Circle, Connaught Place, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'],
    reportedBy: 'citizen-2',
    reportedAt: new Date('2026-03-13T08:45:00'),
    updatedAt: new Date('2026-03-13T09:15:00'),
    upvotes: 112,
    department: 'Traffic Management',
    slaDeadline: new Date('2026-03-13T10:45:00')
  },
  {
    id: '8',
    title: 'Broken park bench and damaged equipment',
    description: 'Children\'s park equipment damaged and needs repair',
    category: 'park',
    status: 'submitted',
    priority: 'medium',
    location: {
      lat: 28.6152,
      lng: 77.2087,
      address: 'Community Park, Sector 18, New Delhi'
    },
    images: ['https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800'],
    reportedBy: 'citizen-3',
    reportedAt: new Date('2026-03-12T16:30:00'),
    updatedAt: new Date('2026-03-12T16:30:00'),
    upvotes: 31,
    department: 'Parks & Recreation',
    slaDeadline: new Date('2026-03-17T16:30:00')
  }
];

export const mockUsers: User[] = [
  {
    id: 'citizen-1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    points: 450,
    badges: ['active-citizen', 'community-leader']
  },
  {
    id: 'citizen-2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    points: 680,
    badges: ['active-citizen', 'clean-city-champion', 'community-leader']
  },
  {
    id: 'citizen-3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    points: 320,
    badges: ['active-citizen']
  }
];

export const mockWorkers: Worker[] = [
  {
    id: 'worker-1',
    name: 'Suresh Singh',
    email: 'suresh@gov.in',
    role: 'worker',
    department: 'Public Works',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    activeTasksCount: 3,
    completedTasksCount: 127,
    slaComplianceRate: 94.5,
    rating: 4.7,
    location: {
      lat: 28.6140,
      lng: 77.2089
    }
  },
  {
    id: 'worker-2',
    name: 'Ramesh Yadav',
    email: 'ramesh@gov.in',
    role: 'worker',
    department: 'Electricity',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    activeTasksCount: 2,
    completedTasksCount: 203,
    slaComplianceRate: 97.2,
    rating: 4.9,
    location: {
      lat: 28.6149,
      lng: 77.2084
    }
  },
  {
    id: 'worker-3',
    name: 'Vijay Verma',
    email: 'vijay@gov.in',
    role: 'worker',
    department: 'Drainage',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    activeTasksCount: 4,
    completedTasksCount: 156,
    slaComplianceRate: 91.8,
    rating: 4.6,
    location: {
      lat: 28.6143,
      lng: 77.2081
    }
  }
];

export const mockNGOs: NGO[] = [
  {
    id: 'ngo-1',
    name: 'Clean City Foundation',
    logo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200',
    totalSponsored: 2500000,
    projectsSponsored: 12,
    impactScore: 8.7
  },
  {
    id: 'ngo-2',
    name: 'Green Earth Initiative',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200',
    totalSponsored: 1800000,
    projectsSponsored: 8,
    impactScore: 7.9
  },
  {
    id: 'ngo-3',
    name: 'Urban Development Corp',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200',
    totalSponsored: 3200000,
    projectsSponsored: 15,
    impactScore: 9.2
  }
];

export const mockBadges: Badge[] = [
  {
    id: 'active-citizen',
    name: 'Active Citizen',
    description: 'Reported 10+ issues',
    icon: 'shield-check',
    requiredPoints: 100
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Received 500+ upvotes',
    icon: 'trophy',
    requiredPoints: 500
  },
  {
    id: 'clean-city-champion',
    name: 'Clean City Champion',
    description: 'Helped resolve 50+ issues',
    icon: 'award',
    requiredPoints: 1000
  }
];

export const categoryStats = [
  { category: 'Road', count: 45, resolved: 32, pending: 13 },
  { category: 'Garbage', count: 67, resolved: 54, pending: 13 },
  { category: 'Electricity', count: 34, resolved: 28, pending: 6 },
  { category: 'Water', count: 28, resolved: 19, pending: 9 },
  { category: 'Drainage', count: 23, resolved: 15, pending: 8 },
  { category: 'Streetlight', count: 41, resolved: 35, pending: 6 },
  { category: 'Park', count: 15, resolved: 10, pending: 5 },
  { category: 'Traffic', count: 19, resolved: 14, pending: 5 }
];

export const weeklyStats = [
  { day: 'Mon', reported: 32, resolved: 28 },
  { day: 'Tue', reported: 45, resolved: 38 },
  { day: 'Wed', reported: 38, resolved: 35 },
  { day: 'Thu', reported: 52, resolved: 42 },
  { day: 'Fri', reported: 41, resolved: 39 },
  { day: 'Sat', reported: 28, resolved: 25 },
  { day: 'Sun', reported: 24, resolved: 22 }
];