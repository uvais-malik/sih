
export enum View {
  Dashboard,
  DiseaseDetection,
  Profile,
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