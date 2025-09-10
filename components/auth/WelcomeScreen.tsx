import React from 'react';
import { AuthView } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface WelcomeScreenProps {
  onNavigate: (view: AuthView) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useAppContext();

  const handleLanguageChange = () => {
    if (language === 'en') setLanguage('hi');
    else if (language === 'hi') setLanguage('pa');
    else setLanguage('en');
  };
  
  const getNextLanguageName = () => {
    if (language === 'en') return 'हिंदी';
    if (language === 'hi') return 'ਪੰਜਾਬੀ';
    return 'English';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1B5E20] to-[#8BC34A] flex flex-col justify-between p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Floating Icons */}
        <div className="absolute inset-0 z-0">
            <span className="floating-icon absolute top-[10%] left-[10%] text-4xl opacity-20" style={{animationDelay: '0s'}}>🌾</span>
            <span className="floating-icon absolute top-[20%] right-[15%] text-5xl opacity-20" style={{animationDelay: '1s'}}>🚜</span>
            <span className="floating-icon absolute top-[50%] left-[20%] text-3xl opacity-20" style={{animationDelay: '2s'}}>☀️</span>
            <span className="floating-icon absolute top-[70%] right-[10%] text-4xl opacity-20" style={{animationDelay: '3s'}}>💧</span>
            <span className="floating-icon absolute top-[85%] left-[30%] text-5xl opacity-20" style={{animationDelay: '0.5s'}}>🌱</span>
        </div>

        <div className="z-10 text-right">
            <button 
              onClick={handleLanguageChange}
              className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm"
            >
              🌐 {getNextLanguageName()}
            </button>
        </div>

        <div className="z-10 text-center">
            <div className="w-32 h-32 bg-white/90 rounded-full mx-auto flex items-center justify-center shadow-2xl mb-6">
                <span className="text-7xl">👨‍🌾</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-poppins text-shadow">{t('welcome_title')}</h1>
            <h2 className="text-xl sm:text-2xl font-poppins mt-2 text-shadow-sm">{t('welcome_subtitle')}</h2>
            <p className="mt-4 max-w-sm mx-auto text-gray-200">{t('welcome_description')}</p>
        </div>

        <div className="z-10 space-y-4">
            <button 
                onClick={() => onNavigate(AuthView.AuthChoice)}
                className="w-full bg-white text-green-800 font-bold py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform"
            >
                {t('get_started')}
            </button>
            <div className="text-center">
                <span className="text-gray-300">{t('already_have_account')}</span>
                <button onClick={() => onNavigate(AuthView.Login)} className="font-semibold ml-2 underline">{t('login_prompt')}</button>
            </div>
        </div>
    </div>
  );
};

export default WelcomeScreen;