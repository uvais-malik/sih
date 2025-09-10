
import React, { useState } from 'react';
import CameraView from './CameraView';
import AnalysisResults from './AnalysisResults';
import AnalysisHistory from './AnalysisHistory';
import type { DiseaseAnalysisResult, AnalysisHistoryEntry } from '../../types';

type View = 'camera' | 'results' | 'history';

const DiseaseDetection: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('camera');
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (result: DiseaseAnalysisResult) => {
    setAnalysisResult(result);
    setCurrentView('results');
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    setCurrentView('camera');
  };
  
  const handleSaveResult = () => {
    if (!analysisResult) return;
    try {
      const history: AnalysisHistoryEntry[] = JSON.parse(localStorage.getItem('diseaseHistory') || '[]');
      const newEntry: AnalysisHistoryEntry = {
        id: new Date().toISOString(),
        diseaseName: analysisResult.diseaseName,
        confidence: analysisResult.confidence,
        date: new Date().toLocaleDateString(),
      };
      history.unshift(newEntry); // Add to the beginning
      localStorage.setItem('diseaseHistory', JSON.stringify(history.slice(0, 50))); // Limit history size
      alert('Analysis saved to history!');
    } catch (e) {
      console.error("Failed to save history", e);
      alert('Failed to save history.');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'results':
        return analysisResult ? (
          <AnalysisResults 
            result={analysisResult} 
            onReset={handleReset} 
            onSave={handleSaveResult}
            onViewHistory={() => setCurrentView('history')}
          />
        ) : null;
      
      case 'history':
        return <AnalysisHistory onBack={() => setCurrentView(analysisResult ? 'results' : 'camera')} />;

      case 'camera':
      default:
        return (
          <CameraView 
            setAnalysisResult={handleAnalysisComplete} 
            setIsLoading={setIsLoading} 
            setError={setError} 
            isLoading={isLoading} 
            error={error} 
          />
        );
    }
  };
  
  return <>{renderCurrentView()}</>;
};

export default DiseaseDetection;