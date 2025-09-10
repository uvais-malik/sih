import React, { useState } from 'react';
import { AuthView } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface LoginScreenProps {
  onNavigate: (view: AuthView) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { t, login } = useAppContext();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }
    setError('');
    setIsLoading(true);
    try {
        await login(phone, password);
        // On successful login, the App component will automatically render the authenticated view
    } catch (err: any) {
        setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="auth-container min-h-screen p-4 flex flex-col justify-center items-center">
      <div className="auth-card w-full max-w-sm dark:bg-gray-800/50">
        <div className="text-center mb-8">
           <button onClick={() => onNavigate(AuthView.AuthChoice)} className="text-primary dark:text-green-300 mb-4 flex items-center gap-2 hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back
            </button>
          <h1 className="text-3xl font-bold font-poppins text-primary dark:text-green-300">{t('login_title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('login_subtitle')}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-field">
            <label htmlFor="phone" className="dark:text-green-200">{t('phone_number')}</label>
            <div className="flex items-center">
              <span className="border border-r-0 border-gray-200 dark:border-gray-600 rounded-l-xl px-3 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">+91</span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                maxLength={10}
                required
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">{t('password')}</label>
            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enter_your_password')}
                    required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 text-gray-500">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex items-center justify-between text-sm">
             <a href="#" className="font-medium text-primary hover:underline dark:text-green-300">{t('forgot_password')}</a>
          </div>

          <button type="submit" disabled={isLoading} className="morphic-button w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? `${t('analyzing')}...` : t('login_prompt')}
          </button>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t('new_user_prompt')}{' '}
            <button type="button" onClick={() => onNavigate(AuthView.Signup)} className="font-medium text-primary hover:underline dark:text-green-300">
              {t('create_account_btn')}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
