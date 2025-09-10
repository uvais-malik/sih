
import React, { useState, useCallback } from 'react';
import { View, AuthView } from './types';
import Dashboard from './components/Dashboard';
import DiseaseDetection from './components/disease/DiseaseDetection';
import UserProfile from './components/profile/UserProfile';
import VoiceAssistant from './components/voice/VoiceAssistant';
import CropCalendar from './components/calendar/CropCalendar';
import MarketPrices from './components/market/MarketPrices';
import Weather from './components/weather/Weather';
import BottomNavigation from './components/BottomNavigation';
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

  const renderView = () => {
    switch (activeView) {
      case View.DiseaseDetection:
        return <DiseaseDetection />;
      case View.VoiceAssistant:
        return <VoiceAssistant />;
      case View.CropCalendar:
        return <CropCalendar />;
      case View.MarketPrices:
        return <MarketPrices />;
      case View.Weather:
        return <Weather />;
      case View.Profile:
        return <UserProfile />;
      case View.Dashboard:
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };


  return (
    <div className="min-h-screen w-full font-inter text-gray-800 dark:text-gray-200 antialiased">
      <main className="pb-24">
        {renderView()}
      </main>
      
      <BottomNavigation activeView={activeView} setActiveView={setActiveView} />
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