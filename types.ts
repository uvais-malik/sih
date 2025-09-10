export enum View {
  Dashboard,
  DiseaseDetection,
  Profile,
}

export enum AuthView {
  Welcome,
  AuthChoice,
  Login,
  Signup,
  SignupSuccess,
}

// Based on the user's provided schema for the signup flow
export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string; // Should be hashed in a real app
  location: {
    state: string;
    district: string;
    village?: string;
  };
  farm: {
    landSize: number; // in acres
    primaryCrops: string[];
    soilType?: string;
    irrigationType?: string;
    farmingExperience?: string;
  };
  isVerified: boolean;
  createdAt: string;
}


export interface DiseaseAnalysisResult {
  diseaseName: string;
  confidence: number;
  symptoms: string[];
  treatments: string[];
  preventions: string[];
}

export interface AnalysisHistoryEntry {
  id: string;
  diseaseName: string;
  confidence: number;
  date: string;
}
