import { Timestamp } from 'firebase/firestore';

export type UserRole = 'seeker' | 'provider' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  skills: string[];
  bio: string;
  averageRating: number;
  totalReviews: number;
  createdAt: Timestamp;
}

export type ServiceCategory = 'Hardware' | 'Software' | 'Networking' | 'Mobile' | 'Other';

export interface ServiceListing {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  category: ServiceCategory;
  priceRange: string;
  createdAt: Timestamp;
}

export type RequestStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  seekerId: string;
  seekerName: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceTitle: string;
  status: RequestStatus;
  description: string;
  reviewId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  requestId: string;
  providerId: string;
  seekerId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}
