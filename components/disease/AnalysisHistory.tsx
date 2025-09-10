import React, { useState, useEffect } from 'react';
import type { AnalysisHistoryEntry } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface AnalysisHistoryProps {
  onBack: () => void;
}

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<AnalysisHistoryEntry[]>([]);
  const { t } = useAppContext();

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('diseaseHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
      setHistory([]);
    }
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-green-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="headline-medium text-2xl dark:text-white">{t('analysis_history')}</h1>
      </div>
      
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((entry) => (
            <div key={entry.id} className="glass-card shadow-glass p-4 rounded-2xl">
              <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg text-red-600 dark:text-red-400">{entry.diseaseName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><ClockIcon className="w-4 h-4" /> {entry.date}</p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-xl text-primary dark:text-green-300">{entry.confidence}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                  </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('no_history_found')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{t('no_history_found_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;
