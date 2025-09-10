import React from 'react';
import { View } from '../types';
import { useAppContext } from '../context/AppContext';

interface BottomNavigationProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${
        isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-300'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className={`text-[10px] font-medium transition-all ${isActive ? 'font-bold' : ''}`}>{label}</span>
      {isActive && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full animate-fade-in"></div>
      )}
    </button>
);

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const LeafIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13V6a2 2 0 0 1 2-2h4l3 3h6a2 2 0 0 1 2 2v7a7 7 0 0 1-11 5z"/><path d="M11 14a2.5 2.5 0 0 0 0-5v5z"/></svg>;
const MicIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>;
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;


const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeView, setActiveView }) => {
    const { t } = useAppContext();
    
    const navItems = [
        { view: View.Dashboard, icon: <HomeIcon className="w-5 h-5"/>, label: t('dashboard') },
        { view: View.DiseaseDetection, icon: <LeafIcon className="w-5 h-5"/>, label: t('disease_detection') },
        { view: View.VoiceAssistant, icon: <MicIcon className="w-5 h-5"/>, label: t('voice_assistant') },
        { view: View.CropCalendar, icon: <CalendarIcon className="w-5 h-5"/>, label: t('crop_calendar') },
        { view: View.MarketPrices, icon: <BarChartIcon className="w-5 h-5"/>, label: t('market_prices') },
        { view: View.Weather, icon: <SunIcon className="w-5 h-5"/>, label: t('weather') },
        { view: View.Profile, icon: <UserIcon className="w-5 h-5"/>, label: t('profile') },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/80 dark:border-gray-700/80 z-50">
            <div className="flex justify-around items-center h-full max-w-4xl mx-auto px-2">
                {navItems.map(item => (
                    <NavItem 
                        key={item.view}
                        icon={item.icon} 
                        label={item.label}
                        isActive={activeView === item.view}
                        onClick={() => setActiveView(item.view)}
                    />
                ))}
            </div>
        </nav>
    );
};

export default BottomNavigation;
