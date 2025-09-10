import React from 'react';
import { AuthView } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface AuthChoiceScreenProps {
  onNavigate: (view: AuthView) => void;
}

const AuthChoiceScreen: React.FC<AuthChoiceScreenProps> = ({ onNavigate }) => {
    const { t, loginAsGuest } = useAppContext();

    const ChoiceCard: React.FC<{
        icon: string;
        title: string;
        description: string;
        benefits: string[];
        buttonText: string;
        onClick: () => void;
    }> = ({ icon, title, description, benefits, buttonText, onClick }) => (
        <div className="glass-card shadow-glass p-6 rounded-3xl flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="text-5xl mb-3">{icon}</div>
            <h2 className="headline-medium text-2xl dark:text-white">{title}</h2>
            <p className="body-large text-gray-500 dark:text-gray-400">{description}</p>
            <ul className="my-4 space-y-2 text-left text-gray-700 dark:text-gray-300 flex-grow">
                {benefits.map((benefit, i) => <li key={i} className="flex items-start gap-2">{benefit}</li>)}
            </ul>
            <button onClick={onClick} className="morphic-button w-full mt-auto text-white font-bold py-3 px-4 rounded-xl shadow-lg">
                {buttonText}
            </button>
        </div>
    );

    return (
        <div className="auth-container p-4 flex flex-col justify-center items-center">
             <div className="w-full max-w-lg text-center mb-8">
                 <button onClick={() => onNavigate(AuthView.Welcome)} className="text-primary dark:text-green-300 mb-4 flex items-center gap-2 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back
                 </button>
                <h1 className="display-large text-3xl sm:text-4xl">{t('your_account')}</h1>
                <p className="body-large text-gray-600 dark:text-gray-300 mt-1">{t('secure_farm_info')}</p>
            </div>
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ChoiceCard 
                    icon="👤+"
                    title={t('create_new_account')}
                    description={t('first_time_user')}
                    benefits={[t('get_personalized_advice'), t('track_your_crops'), t('connect_with_experts')]}
                    buttonText={t('create_account_btn')}
                    onClick={() => onNavigate(AuthView.Signup)}
                 />
                 <ChoiceCard 
                    icon="🔐"
                    title={t('login_prompt')}
                    description={t('existing_user')}
                    benefits={[t('quick_dashboard_access'), t('view_your_data'), t('continue_where_left')]}
                    buttonText={t('login_prompt')}
                    onClick={() => onNavigate(AuthView.Login)}
                 />
            </div>
            <div className="mt-8 text-center">
                <button 
                    onClick={loginAsGuest} 
                    className="body-large text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-green-300 underline transition-colors"
                >
                    {t('continue_as_guest')}
                </button>
            </div>
        </div>
    );
};

export default AuthChoiceScreen;