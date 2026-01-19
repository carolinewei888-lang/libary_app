
export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  interestedBookIds: string[]; // List of book IDs the user is interested in
}

export type BookStatus = 'AVAILABLE' | 'BORROWED';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category: string;
  isbn?: string; 
  status: BookStatus;
  borrowedBy?: string | null; 
  createdAt: string;
  // New Decision Aids
  isTrending?: boolean;
  isRareFind?: boolean;
  rating?: number; // 0-5 stars
}

export interface BookDeepDetails {
  chapterCount: string;
  coreConcepts: string[];
  nytReview: string;
  matchReason: string; // "Why you should read this"
}

export interface AIRecipe {
  author: string;
  description: string;
  category: string;
  coverStyleKeyword: string; 
}
