export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  name: string;
  degree: string;
  year: string;
  academicBackground: string;
  skills: string[];
  interests: string[];
  careerGoals: string;
  preferredAreas: string[];
  updatedAt: string;
}

export interface CareerPath {
  title: string;
  matchExplanation: string;
  whySuitable: string;
  skillsToLearn: string[];
  nextSteps: string[];
  matchScore: number;
}

export interface Recommendation {
  id: string;
  userId: string;
  createdAt: string;
  careers: CareerPath[];
  profileSnapshot: Partial<Profile>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
