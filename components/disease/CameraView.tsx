import React, { useState, useRef, useCallback } from 'react';
import { analyzeCropDisease } from '../../services/geminiService';
import type { DiseaseAnalysisResult } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface CameraViewProps {
  setAnalysisResult: (result: DiseaseAnalysisResult) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);


const CameraView: React.FC<CameraViewProps> = ({ setAnalysisResult, setIsLoading, setError, isLoading, error }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useAppContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeCropDisease(imageFile);
      setAnalysisResult(result);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, setIsLoading, setError, setAnalysisResult]);

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleReset = () => {
      setImageFile(null);
      setImagePreview(null);
      setError(null);
  }

  return (
    <div className="p-4 sm:p-6">
        <div className="text-center mb-6">
            <h1 className="headline-medium text-2xl dark:text-white">{t('disease_detection_title')}</h1>
            <p className="body-large text-gray-600 dark:text-gray-300 mt-1">{t('disease_detection_page_subtitle')}</p>
        </div>
        
        <div className="glass-card shadow-glass rounded-3xl p-6 min-h-[400px] flex flex-col justify-center items-center">
            {!imagePreview && (
                 <div className="text-center w-full">
                     <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center text-primary mb-4">
                        <CameraIcon className="w-16 h-16"/>
                     </div>
                     <h2 className="font-poppins font-semibold text-xl text-gray-800 dark:text-gray-100">{t('take_crop_photo')}</h2>
                     <p className="body-large text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">{t('take_crop_photo_desc')}</p>
                 </div>
            )}
            {imagePreview && (
                 <div className="w-full text-center">
                    <img src={imagePreview} alt="Crop preview" className="w-full max-w-sm mx-auto h-64 object-cover rounded-2xl shadow-lg mb-4" />
                 </div>
            )}

            <div className="mt-8 w-full max-w-sm space-y-3">
                 {isLoading && (
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-primary mt-4 dark:text-green-300">{t('analyzing')}</p>
                    </div>
                )}
                {!isLoading && !imagePreview && (
                    <>
                        <button onClick={triggerFileSelect} className="morphic-button w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 rounded-xl shadow-lg">
                           {t('open_camera')}
                        </button>
                        <button onClick={triggerFileSelect} className="w-full text-primary dark:text-green-300 font-semibold py-3 px-4 rounded-xl border-2 border-dashed border-primary/50 hover:bg-primary/10 transition-colors">
                           <span className="flex items-center justify-center gap-2">{t('choose_from_gallery')}</span>
                        </button>
                    </>
                )}
                {!isLoading && imagePreview && (
                    <>
                         <button onClick={handleAnalyze} className="morphic-button w-full text-white font-bold py-4 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
                            {t('analyze_with_ai')}
                         </button>
                         <button onClick={handleReset} className="w-full text-gray-600 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {t('take_another_photo')}
                         </button>
                    </>
                )}
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
        <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>
  );
};

export default CameraView;
