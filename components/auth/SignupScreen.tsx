import React, { useState } from 'react';
import { AuthView, User } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface SignupScreenProps {
  onNavigate: (view: AuthView) => void;
}

const StepIndicator: React.FC<{ currentStep: number; t: (key: string) => string }> = ({ currentStep, t }) => (
    <div className="flex justify-center items-center mb-6">
        {[1, 2, 3].map(step => (
            <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {currentStep > step ? '✓' : step}
                </div>
                {step < 3 && <div className={`w-12 h-1 transition-all duration-300 ${currentStep > step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
            </React.Fragment>
        ))}
    </div>
);

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate }) => {
    const { t, register } = useAppContext();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Omit<User, 'id' | 'isVerified' | 'createdAt'>>({
        name: '',
        phone: '',
        password: '',
        location: { state: '', district: '', village: '' },
        farm: { landSize: 0, primaryCrops: [], soilType: '', irrigationType: '', farmingExperience: '' }
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        
        const valueToSet = e.target.type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

        if (keys.length > 1) {
            setFormData(prev => ({
                ...prev,
                [keys[0]]: { ...prev[keys[0]], [keys[1]]: valueToSet }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: valueToSet }));
        }
    };
    
    const handleCropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentCrops = prev.farm.primaryCrops;
            if (checked) {
                return { ...prev, farm: { ...prev.farm, primaryCrops: [...currentCrops, value]}};
            } else {
                return { ...prev, farm: { ...prev.farm, primaryCrops: currentCrops.filter(c => c !== value)}};
            }
        });
    };

    const nextStep = () => {
        setError('');
        if (step === 1) {
            if (!formData.name || !formData.phone || !formData.password || !confirmPassword) {
                setError('Please fill all required fields.'); return;
            }
            if (formData.password !== confirmPassword) {
                setError('Passwords do not match.'); return;
            }
        }
        if (step === 2) {
             if (!formData.location.state || !formData.location.district) {
                setError('Please select your state and district.'); return;
            }
        }
        setStep(s => s + 1);
    }
    const prevStep = () => setStep(s => s - 1);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.farm.landSize <= 0) {
            setError('Please enter a valid land size.'); return;
        }
        if (formData.farm.primaryCrops.length === 0) {
            setError('Please select at least one primary crop.'); return;
        }
        
        setIsLoading(true);
        try {
            await register(formData);
            onNavigate(AuthView.SignupSuccess);
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
            setStep(1); // Go back to first step on phone number error
        } finally {
            setIsLoading(false);
        }
    }

    const titles = [t('signup_title_1'), t('signup_title_2'), t('signup_title_3')];

    return (
        <div className="auth-container min-h-screen p-4 flex flex-col justify-center items-center">
            <div className="auth-card w-full max-w-md dark:bg-gray-800/50">
                <StepIndicator currentStep={step} t={t} />
                <h2 className="text-center text-xl font-semibold mb-6 text-primary dark:text-green-300">{titles[step - 1]}</h2>

                <form onSubmit={handleSubmit} className="animate-fade-in">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="form-field">
                                <label>{t('your_name')}</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Raju Patel" />
                            </div>
                            <div className="form-field">
                                <label>{t('phone_number')}</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10)}))} maxLength={10} required placeholder="9876543210"/>
                            </div>
                            <div className="form-field">
                                <label>{t('create_password')}</label>
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                            </div>
                             <div className="form-field">
                                <label>{t('confirm_password')}</label>
                                <input type="password" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-4">
                             <div className="form-field">
                                <label>{t('select_state')}</label>
                                <select name="location.state" value={formData.location.state} onChange={handleInputChange} required>
                                    <option value="">Select State</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>{t('select_district')}</label>
                                <select name="location.district" value={formData.location.district} onChange={handleInputChange} required>
                                    <option value="">Select District</option>
                                     <option value="District A">District A</option>
                                    <option value="District B">District B</option>
                                    <option value="District C">District C</option>
                                </select>
                            </div>
                             <div className="form-field">
                                <label>{t('village_area')}</label>
                                <input type="text" name="location.village" value={formData.location.village} onChange={handleInputChange} placeholder="e.g. Shivaji Nagar" />
                            </div>
                        </div>
                    )}
                     {step === 3 && (
                        <div className="space-y-4">
                            <div className="form-field">
                                <label>{t('land_size_acres')}</label>
                                <input type="number" step="0.1" name="farm.landSize" value={formData.farm.landSize || ''} onChange={handleInputChange} required placeholder="5.0" />
                            </div>
                            <div className="form-field">
                                <label>{t('primary_crops')}</label>
                                <div className="crop-chips">
                                    {['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Onion', 'Tomato'].map(crop => (
                                        <label key={crop} className="crop-chip">
                                            <input type="checkbox" value={crop} onChange={handleCropChange} checked={formData.farm.primaryCrops.includes(crop)} />
                                            <span>{crop}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                             <div className="form-field">
                                <label>{t('irrigation_method')}</label>
                                 <div className="irrigation-options">
                                    {['Drip', 'Sprinkler', 'Flood', 'Rain-fed'].map(type => (
                                        <label className="radio-option" key={type}>
                                            <input type="radio" name="farm.irrigationType" value={type} checked={formData.farm.irrigationType === type} onChange={handleInputChange} />
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-field">
                                <label>{t('farming_experience')}</label>
                                <select name="farm.farmingExperience" value={formData.farm.farmingExperience} onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    <option value="Beginner (0-2 years)">Beginner (0-2 years)</option>
                                    <option value="Intermediate (3-10 years)">Intermediate (3-10 years)</option>
                                    <option value="Experienced (10+ years)">Experienced (10+ years)</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flex gap-4">
                        {step > 1 && <button type="button" onClick={prevStep} className="w-full text-primary dark:text-green-300 font-semibold py-3 px-4 rounded-xl border-2 border-primary hover:bg-primary/10 transition-colors">{t('previous_step')}</button>}
                        {step < 3 && <button type="button" onClick={nextStep} className="morphic-button w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg">{t('next_step')}</button>}
                        {step === 3 && <button type="submit" disabled={isLoading} className="morphic-button w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg disabled:opacity-50">{isLoading ? `${t('analyzing')}...` : t('finish_signup')}</button>}
                    </div>
                     {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignupScreen;