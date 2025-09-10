import React from 'react';
import { AuthView } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface SignupSuccessScreenProps {
  onNavigate: (view: AuthView) => void;
}

const SignupSuccessScreen: React.FC<SignupSuccessScreenProps> = ({ onNavigate }) => {
    const { t } = useAppContext();
    
    // The main App component will detect the user object from context and switch to the authenticated view automatically.

    return (
        <div className="auth-container min-h-screen p-4 flex flex-col justify-center items-center text-center">
            <div className="auth-card w-full max-w-sm dark:bg-gray-800/50">
                <div className="animate-bounce text-7xl mb-4">🎉</div>
                <h1 className="display-large text-3xl">{t('signup_success_title')}</h1>
                <p className="headline-medium text-xl mt-2 dark:text-white">{t('signup_success_subtitle')}</p>
                <p className="body-large text-gray-600 dark:text-gray-400 mt-2">{t('signup_success_message')}</p>

                <div className="my-6 p-4 bg-primary/10 dark:bg-green-900/40 rounded-xl text-left space-y-2">
                    <p className="flex items-center gap-2 text-primary dark:text-green-300"><span className="text-xl">🤖</span> AI से व्यक्तिगत सलाह</p>
                    <p className="flex items-center gap-2 text-primary dark:text-green-300"><span className="text-xl">📸</span> रोग पहचान तकनीक</p>
                    <p className="flex items-center gap-2 text-primary dark:text-green-300"><span className="text-xl">📈</span> बाज़ार भाव अपडेट</p>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">आपको डैशबोर्ड पर भेजा जा रहा है...</p>
                
                {/* The app auto-redirects because the `user` state is now set in AppContext, causing App.tsx to render AuthenticatedApp */}
            </div>
        </div>
    );
};

export default SignupSuccessScreen;
