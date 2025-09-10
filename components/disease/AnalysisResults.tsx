import React from 'react';
import type { DiseaseAnalysisResult } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface AnalysisResultsProps {
  result: DiseaseAnalysisResult;
  onReset: () => void;
  onSave: () => void;
  onViewHistory: () => void;
}

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>
);

const SectionCard: React.FC<{ title: string; icon: string; children: React.ReactNode; color: string;}> = ({ title, icon, children, color}) => (
    <div className={`bg-${color}-50 dark:bg-${color}-900/40 border border-${color}-200 dark:border-${color}-800/60 rounded-2xl p-4`}>
        <h3 className={`font-poppins font-bold text-lg text-${color}-800 dark:text-${color}-300 flex items-center gap-2`}>
            {icon} {title}
        </h3>
        <div className="mt-3 space-y-2 body-large text-gray-700 dark:text-gray-300">
            {children}
        </div>
    </div>
);


const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset, onSave, onViewHistory }) => {
  const { t } = useAppContext();
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white text-4xl mb-3 shadow-lg">
                ⚠️
            </div>
            <h1 className="headline-medium text-3xl text-red-600 dark:text-red-400">{result.diseaseName}</h1>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full flex items-center justify-end pr-2 text-white font-bold text-xs" 
                    style={{ width: `${result.confidence}%` }}
                >
                   {result.confidence}%
                </div>
            </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('confidence_score')}</p>
        </div>

        <SectionCard title={t('symptoms')} icon="🔍" color="gray">
            <ul className="list-disc list-inside space-y-2">
                {result.symptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
            </ul>
        </SectionCard>

        <SectionCard title={t('treatment')} icon="💊" color="green">
             <ol className="space-y-3">
                {result.treatments.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-200 text-green-800 text-sm font-bold rounded-full flex items-center justify-center">{index + 1}</span>
                        <span className='dark:text-gray-200'>{treatment}</span>
                    </li>
                ))}
            </ol>
        </SectionCard>

        <SectionCard title={t('prevention')} icon="🛡️" color="blue">
            <ul className="space-y-3">
                {result.preventions.map((prevention, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 flex-shrink-0 rounded-md bg-blue-500 text-white flex items-center justify-center">
                            <CheckIcon className="w-3 h-3"/>
                        </div>
                        <span className='dark:text-gray-200'>{prevention}</span>
                    </li>
                ))}
            </ul>
        </SectionCard>
        
        <div className="pt-4 space-y-3">
            <button onClick={onSave} className="morphic-button w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg">
                {t('save_to_history')}
            </button>
             <button onClick={onViewHistory} className="w-full text-primary dark:text-green-300 font-semibold py-3 px-4 rounded-xl border-2 border-primary hover:bg-primary/10 transition-colors">
                {t('view_history')}
            </button>
            <button onClick={onReset} className="w-full text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {t('take_another_photo')}
            </button>
             <button className="w-full text-primary dark:text-green-300 font-semibold py-3 px-4 rounded-xl border-2 border-primary hover:bg-primary/10 transition-colors">
                {t('contact_expert')}
            </button>
        </div>

    </div>
  );
};

export default AnalysisResults;
