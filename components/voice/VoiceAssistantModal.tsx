import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { t } = useAppContext();

  const handleMicClick = () => {
      setIsListening(prev => !prev);
      if(!isListening) {
        setTranscript('गेहूं की फसल के लिए सबसे अच्छी खाद कौन सी है?');
        setTimeout(() => {
            setResponse('गेहूं की फसल के लिए, नाइट्रोजन, फॉस्फोरस, और पोटाशियम युक्त NPK खाद सबसे अच्छी मानी जाती है।');
        }, 1500)
      } else {
        setTranscript('');
        setResponse('');
      }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-t-3xl p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
        
        {response && (
            <div className="mb-6 p-4 bg-primary/10 dark:bg-green-900/40 rounded-xl">
                 <p className="font-bold text-primary dark:text-green-300">{t('ai_response')}</p>
                 <p className="body-large text-gray-800 dark:text-gray-200">{response}</p>
            </div>
        )}
        
        {transcript && !response && (
            <div className="mb-6">
                <p className="body-large text-center text-gray-600 dark:text-gray-300 h-12">{transcript}</p>
            </div>
        )}


        <div className="flex flex-col items-center">
            <button onClick={handleMicClick} className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-300 ${isListening ? 'bg-red-500' : 'bg-primary'}`}>
                {isListening && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                )}
                <MicIcon className="w-10 h-10 text-white"/>
            </button>
            <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                {isListening ? t('listening') : t('tap_to_ask')}
            </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
