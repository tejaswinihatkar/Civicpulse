export type IssueCategory = 
  | 'road' 
  | 'garbage' 
  | 'electricity' 
  | 'water' 
  | 'drainage' 
  | 'streetlight' 
  | 'park' 
  | 'traffic'
  | 'other';

export type IssueStatus = 'submitted' | 'acknowledged' | 'in-progress' | 'resolved' | 'rejected';

export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';

export type UserRole = 'citizen' | 'authority' | 'worker' | 'ngo' | 'super_admin';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  upvotes: number;
  assignedTo?: string;
  department?: string;
  slaDeadline?: Date;
  resolvedAt?: Date;
  proofOfWork?: {
    beforeImages: string[];
    afterImages: string[];
    completedAt: Date;
    notes: string;
  };
  sponsored?: {
    sponsorId: string;
    sponsorName: string;
    amount: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  points?: number;
  badges?: string[];
  department?: string;
}

export interface Worker extends User {
  role: 'worker';
  activeTasksCount: number;
  completedTasksCount: number;
  slaComplianceRate: number;
  rating: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface NGO {
  id: string;
  name: string;
  logo?: string;
  totalSponsored: number;
  projectsSponsored: number;
  impactScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
}
