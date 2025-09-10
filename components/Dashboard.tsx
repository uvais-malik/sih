
import React from 'react';
import { View } from '../types';
import { useAppContext } from '../context/AppContext';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Header: React.FC = () => {
    const { t } = useAppContext();
    return (
      <div className="glass-card shadow-glass p-6 rounded-3xl flex justify-between items-center">
        <div>
          <h1 className="display-large text-3xl sm:text-4xl">{t('greeting')}</h1>
          <p className="body-large text-gray-600 dark:text-gray-300 mt-1">{t('greeting_subtitle')}</p>
        </div>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl shadow-lg">
            👨‍🌾
          </div>
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
        </div>
      </div>
    );
};

const WeatherWidget: React.FC = () => {
    const { t } = useAppContext();
    return (
      <div className="glass-card shadow-glass rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-yellow-100/30 via-transparent to-blue-100/30 dark:from-yellow-500/10 dark:to-blue-500/10">
        <div className="flex justify-between items-start text-gray-700 dark:text-gray-300">
            <div>
                <p className="body-large text-gray-500 dark:text-gray-400 text-sm">{t('location')}</p>
                <h2 className="headline-medium text-2xl mt-1 dark:text-white">{t('weather_title')}</h2>
            </div>
            <div className="text-6xl animate-pulse">☀️</div>
        </div>
        <div className="mt-4 flex items-end gap-2">
            <p className="font-bold text-7xl text-gray-800 dark:text-gray-100">32°<span className="text-5xl align-top">C</span></p>
            <p className="body-large text-gray-600 dark:text-gray-300 pb-2">{t('weather_desc')}</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="font-bold text-xl dark:text-white">32°C</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('temp_label')}</p>
            </div>
            <div>
                <p className="font-bold text-xl dark:text-white">65%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('humidity_label')}</p>
            </div>
            <div>
                <p className="font-bold text-xl dark:text-white">12 km/h</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('wind_label')}</p>
            </div>
        </div>
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-100/50 to-green-200/40 dark:from-green-900/50 dark:to-green-800/40 border border-green-200 dark:border-green-700 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl text-white">🤖</div>
          <div>
            <h3 className="font-bold text-primary dark:text-green-300">{t('ai_suggestion_title')}</h3>
            <p className="body-large text-sm text-on-primary-container dark:text-gray-300">{t('ai_suggestion_text')}</p>
          </div>
        </div>
      </div>
    );
}

const QuickActionCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  gradient: string;
  animation?: string;
  onClick: () => void;
}> = ({ icon, title, subtitle, gradient, animation, onClick }) => (
  <div onClick={onClick} className="glass-card shadow-glass rounded-3xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-3 ${gradient} ${animation}`}>
      {icon}
    </div>
    <h3 className="font-poppins font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
  </div>
);

const CropStatus: React.FC = () => {
    const percentage = 75;
    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const { t } = useAppContext();

    return (
        <div className="mt-8">
            <h2 className="headline-medium text-2xl mb-4 px-4 dark:text-white">{t('current_crop_status')}</h2>
            <div className="glass-card shadow-glass rounded-3xl p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-4xl">🌾</div>
                    <div>
                        <h3 className="font-poppins font-bold text-2xl dark:text-white">{t('crop_name')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('sowing_date')}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('healthy_status')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center my-6">
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(128,128,128,0.2)" strokeWidth="12" />
                            <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                style={{ strokeDasharray: circumference, strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                                transform="rotate(-90 60 60)"
                            />
                             <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#86efac" />
                                <stop offset="100%" stopColor="#16a34a" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-bold text-4xl text-primary dark:text-green-300">{percentage}%</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('days_label')} 35/120</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-100/60 dark:bg-green-900/60 p-3 rounded-xl"><p className="font-bold dark:text-white">65%</p><p className="text-xs text-green-800 dark:text-green-300">{t('growth')}</p></div>
                    <div className="bg-blue-100/60 dark:bg-blue-900/60 p-3 rounded-xl"><p className="font-bold dark:text-white">85%</p><p className="text-xs text-blue-800 dark:text-blue-300">{t('health')}</p></div>
                    <div className="bg-purple-100/60 dark:bg-purple-900/60 p-3 rounded-xl"><p className="font-bold dark:text-white">20 {t('days_remaining')}</p><p className="text-xs text-purple-800 dark:text-purple-300">{t('remaining')}</p></div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
                    <h4 className="font-bold">{t('next_action')}</h4>
                    <p className="text-sm mt-1">{t('next_action_desc')}</p>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t } = useAppContext();
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Header />
      <WeatherWidget />
      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard icon="📸" title={t('disease_detection')} subtitle={t('disease_detection_subtitle')} gradient="bg-gradient-to-br from-red-200 to-pink-200 dark:from-red-800/50 dark:to-pink-800/50" onClick={() => onNavigate(View.DiseaseDetection)}/>
        <QuickActionCard icon="🎤" title={t('voice_assistant')} subtitle={t('voice_assistant_subtitle')} gradient="bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-800/50 dark:to-indigo-800/50" animation="animate-pulse" onClick={() => {}}/>
        <QuickActionCard icon="📈" title={t('market_prices')} subtitle={t('market_prices_subtitle')} gradient="bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-800/50 dark:to-emerald-800/50" onClick={() => {}}/>
        <QuickActionCard icon="📅" title={t('farm_calendar')} subtitle={t('farm_calendar_subtitle')} gradient="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800/50 dark:to-pink-800/50" onClick={() => {}}/>
      </div>
      <CropStatus />
    </div>
  );
};

export default Dashboard;