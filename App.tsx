
import React, { useState, useCallback } from 'react';
import { View, AuthView } from './types';
import Dashboard from './components/Dashboard';
import DiseaseDetection from './components/disease/DiseaseDetection';
import UserProfile from './components/profile/UserProfile';
import VoiceAssistantModal from './components/voice/VoiceAssistantModal';
import { useAppContext } from './context/AppContext';

// Auth Components
import LoadingScreen from './components/auth/LoadingScreen';
import WelcomeScreen from './components/auth/WelcomeScreen';
import AuthChoiceScreen from './components/auth/AuthChoiceScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import SignupSuccessScreen from './components/auth/SignupSuccessScreen';

const AuthenticatedApp: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);
  const { t } = useAppContext();

  const renderView = () => {
    switch (activeView) {
      case View.DiseaseDetection:
        return <DiseaseDetection />;
      case View.Profile:
        return <UserProfile />;
      case View.Dashboard:
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  const openVoiceAssistant = useCallback(() => {
    setVoiceModalOpen(true);
  }, []);

  const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  );

  const LeafIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 20A7 7 0 0 1 4 13V6a2 2 0 0 1 2-2h4l3 3h6a2 2 0 0 1 2 2v7a7 7 0 0 1-11 5z"/><path d="M11 14a2.5 2.5 0 0 0 0-5v5z"/></svg>
  );

  const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );


  const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-all duration-300 ${
        isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-300'
      }`}
    >
      {icon}
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen w-full font-inter text-gray-800 dark:text-gray-200 antialiased">
      <main className="pb-24">
        {renderView()}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-t border-gray-200/80 dark:border-gray-700/80 flex justify-around items-center shadow-lg z-50">
          <NavItem icon={<HomeIcon/>} label={t('dashboard')} isActive={activeView === View.Dashboard} onClick={() => setActiveView(View.Dashboard)} />
          <NavItem icon={<LeafIcon/>} label={t('disease_detection')} isActive={activeView === View.DiseaseDetection} onClick={() => setActiveView(View.DiseaseDetection)} />
          <NavItem icon={<UserIcon/>} label={t('profile')} isActive={activeView === View.Profile} onClick={() => setActiveView(View.Profile)} />
      </div>

      <div 
        onClick={openVoiceAssistant}
        className="fixed bottom-20 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-amber-500 flex items-center justify-center text-white cursor-pointer shadow-2xl shadow-secondary/50 hover:scale-110 transition-transform duration-300 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      </div>

      <VoiceAssistantModal isOpen={isVoiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </div>
  );
};

const UnauthenticatedApp: React.FC = () => {
    const [authView, setAuthView] = useState<AuthView>(AuthView.Welcome);

    switch(authView) {
        case AuthView.AuthChoice:
            return <AuthChoiceScreen onNavigate={setAuthView} />;
        case AuthView.Login:
            return <LoginScreen onNavigate={setAuthView} />;
        case AuthView.Signup:
            return <SignupScreen onNavigate={setAuthView} />;
        case AuthView.SignupSuccess:
            return <SignupSuccessScreen onNavigate={setAuthView} />;
        case AuthView.Welcome:
        default:
            return <WelcomeScreen onNavigate={setAuthView} />;
    }
};

const App: React.FC = () => {
    const { user, isLoading } = useAppContext();
    
    if (isLoading) {
        return <LoadingScreen />;
    }
    
    return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
