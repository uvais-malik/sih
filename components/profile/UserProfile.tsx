import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ProfileHeader: React.FC = () => {
    const { t, user } = useAppContext();
    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-5xl shadow-lg mb-4">
                    👨‍🌾
                </div>
                <div className="absolute bottom-4 right-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
            </div>
            <h1 className="display-large text-3xl">{user?.name || t('profile_greeting')}</h1>
            <p className="body-large text-gray-500 dark:text-gray-400 mt-1">{`📍 ${user?.location.district || ''}, ${user?.location.state || ''}`}</p>
            <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="text-center">
                    <p className="font-bold text-xl dark:text-white">{user?.farm.landSize} {t('user_land_unit')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('land_stat')}</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-xl dark:text-white">{user?.farm.primaryCrops.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('crops_stat')}</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-xl dark:text-white capitalize">{user?.farm.farmingExperience?.split(' ')[0] || 'N/A'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('experience_stat')}</p>
                </div>
            </div>
        </div>
    );
}

const InfoCard: React.FC<{title: string; icon: string; children: React.ReactNode}> = ({ title, icon, children }) => (
    <div className="glass-card shadow-glass rounded-3xl p-6">
        <h2 className="headline-medium text-xl flex items-center gap-2 dark:text-white">{icon} {title}</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 body-large">
            {children}
        </div>
    </div>
);

const InfoField: React.FC<{label: string; value: string | undefined}> = ({label, value}) => (
    <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{value || 'N/A'}</p>
    </div>
);

const Toggle: React.FC<{label: string; enabled: boolean; onChange?: () => void;}> = ({label, enabled, onChange}) => (
     <div className={`flex justify-between items-center p-2 rounded-lg transition-colors ${onChange ? 'sm:col-span-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50' : ''}`} onClick={onChange}>
        <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
    </div>
)

const UserProfile: React.FC = () => {
    const { theme, setTheme, language, setLanguage, t, user, logout } = useAppContext();

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <ProfileHeader />
            <InfoCard title={t('personal_info')} icon="👤">
                <InfoField label={t('name_label')} value={user?.name} />
                <InfoField label={t('phone_label')} value={user?.phone} />
                <InfoField label={t('language_label')} value={language === 'hi' ? 'हिंदी' : 'English'} />
                <InfoField label={t('location_label')} value={`${user?.location.village || ''}, ${user?.location.district}, ${user?.location.state}`} />
            </InfoCard>
             <InfoCard title={t('farm_info')} icon="🌾">
                <InfoField label={t('land_size_label')} value={`${user?.farm.landSize} ${t('user_land_unit')}`} />
                <InfoField label={t('primary_crops_label')} value={user?.farm.primaryCrops.join(', ')} />
                <InfoField label={t('soil_type_label')} value={user?.farm.soilType} />
                <InfoField label={t('irrigation_label')} value={user?.farm.irrigationType} />
                 <div className="sm:col-span-2">
                    <InfoField label={t('farming_experience')} value={user?.farm.farmingExperience} />
                 </div>
            </InfoCard>
             <InfoCard title={t('settings')} icon="⚙️">
                <div className="col-span-1 sm:col-span-2 grid grid-cols-1 gap-2">
                  <Toggle label={t('language_toggle')} enabled={language === 'en'} onChange={() => setLanguage(language === 'en' ? 'hi' : 'en')} />
                  <Toggle label={t('dark_mode_toggle')} enabled={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                  <Toggle label={t('notifications_toggle')} enabled={true} />
                  <Toggle label={t('voice_assistance_toggle')} enabled={true} />
                </div>
            </InfoCard>

             <button className="morphic-button w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                {t('edit_profile')}
            </button>
             <button onClick={logout} className="w-full text-red-600 dark:text-red-400 font-semibold py-3 px-4 rounded-xl border-2 border-red-500/50 hover:bg-red-500/10 transition-colors">
                {t('logout')}
            </button>
        </div>
    );
};

export default UserProfile;
