import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import type { User } from '../types';
import AuthService from '../services/authService';

type Theme = 'light' | 'dark';
type Language = 'hi' | 'en';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'isVerified' | 'createdAt'>) => Promise<User>;
  loginAsGuest: () => void;
}

const translations: Record<string, Record<Language, string>> = {
  // --- Auth Flow ---
  welcome_title: { hi: "🙏 नमस्कार!", en: "🙏 Welcome!" },
  welcome_subtitle: { hi: "खेती में आधुनिक तकनीक का स्वागत है", en: "Welcome to modern technology in farming" },
  welcome_description: { hi: "फसल की देखभाल, रोग पहचान, और बाज़ार की जानकारी एक ही जगह", en: "Crop care, disease detection, and market information in one place" },
  get_started: { hi: "शुरू करें", en: "Get Started" },
  already_have_account: { hi: "पहले से खाता है?", en: "Already have an account?" },
  login_prompt: { hi: "लॉगिन करें", en: "Login" },
  your_account: { hi: "अपना खाता", en: "Your Account" },
  secure_farm_info: { hi: "खेती की जानकारी को सुरक्षित रखने के लिए", en: "To keep your farm information secure" },
  create_new_account: { hi: "नया खाता बनाएं", en: "Create New Account" },
  first_time_user: { hi: "पहली बार इस्तेमाल कर रहे हैं?", en: "Using for the first time?" },
  get_personalized_advice: { hi: "✅ व्यक्तिगत सलाह पाएं", en: "✅ Get personalized advice" },
  track_your_crops: { hi: "✅ अपनी फसल ट्रैक करें", en: "✅ Track your crops" },
  connect_with_experts: { hi: "✅ विशेषज्ञों से जुड़ें", en: "✅ Connect with experts" },
  create_account_btn: { hi: "खाता बनाएं", en: "Create Account" },
  existing_user: { hi: "पहले से खाता है?", en: "Already have an account?" },
  quick_dashboard_access: { hi: "⚡ तुरंत डैशबोर्ड देखें", en: "⚡ Instant dashboard access" },
  view_your_data: { hi: "📊 अपना डेटा देखें", en: "📊 View your data" },
  continue_where_left: { hi: "🔄 जहाँ छोड़ा था, वहीं से शुरू करें", en: "🔄 Continue where you left off" },
  login_title: { hi: "🔐 लॉगिन करें", en: "🔐 Login" },
  login_subtitle: { hi: "अपने खेत की जानकारी देखने के लिए", en: "To see your farm information" },
  phone_number: { hi: "📱 मोबाइल नंबर *", en: "📱 Mobile Number *" },
  password: { hi: "🔒 पासवर्ड *", en: "🔒 Password *" },
  enter_your_password: { hi: "अपना पासवर्ड डालें", en: "Enter your password" },
  remember_me: { hi: "मुझे याद रखें", en: "Remember me" },
  forgot_password: { hi: "पासवर्ड भूल गए?", en: "Forgot password?" },
  new_user_prompt: { hi: "नया यूजर हैं?", en: "New user?" },
  signup_step_1: { hi: "चरण 1 का 3", en: "Step 1 of 3" },
  signup_title_1: { hi: "👤 बुनियादी जानकारी", en: "👤 Basic Information" },
  your_name: { hi: "🏷️ आपका नाम *", en: "🏷️ Your Name *" },
  create_password: { hi: "🔒 नया पासवर्ड बनाएं *", en: "🔒 Create New Password *" },
  confirm_password: { hi: "🔒 पासवर्ड दोहराएं *", en: "🔒 Confirm Password *" },
  signup_step_2: { hi: "चरण 2 का 3", en: "Step 2 of 3" },
  signup_title_2: { hi: "📍 स्थान की जानकारी", en: "📍 Location Information" },
  select_state: { hi: "🏛️ राज्य चुनें *", en: "🏛️ Select State *" },
  select_district: { hi: "🏘️ जिला चुनें *", en: "🏘️ Select District *" },
  village_area: { hi: "🏠 गांव/क्षेत्र", en: "🏠 Village/Area" },
  signup_step_3: { hi: "चरण 3 का 3", en: "Step 3 of 3" },
  signup_title_3: { hi: "🌾 खेती की जानकारी", en: "🌾 Farm Information" },
  land_size_acres: { hi: "📏 कुल जमीन (एकड़ में) *", en: "📏 Total Land (in Acres) *" },
  primary_crops: { hi: "🌱 मुख्य फसलें *", en: "🌱 Primary Crops *" },
  soil_type: { hi: "🏔️ मिट्टी का प्रकार", en: "🏔️ Soil Type" },
  irrigation_method: { hi: "💧 सिंचाई का तरीका", en: "💧 Irrigation Method" },
  farming_experience: { hi: "👨‍🌾 खेती का अनुभव", en: "👨‍🌾 Farming Experience" },
  next_step: { hi: "अगला चरण", en: "Next Step" },
  previous_step: { hi: "पिछला चरण", en: "Previous Step" },
  finish_signup: { hi: "पंजीकरण पूरा करें", en: "Finish Registration" },
  signup_success_title: { hi: "🎉 बधाई हो!", en: "🎉 Congratulations!" },
  signup_success_subtitle: { hi: "आपका खाता तैयार है", en: "Your account is ready" },
  signup_success_message: { hi: "आपकी खेती की यात्रा अब शुरू होती है", en: "Your farming journey starts now" },
  view_dashboard: { hi: "डैशबोर्ड देखें", en: "View Dashboard" },
  continue_as_guest: { hi: "या, मेहमान के रूप में जारी रखें", en: "Or, continue as a guest" },

  // --- Dashboard ---
  greeting: { hi: "🙏 नमस्कार", en: "🙏 Hello" },
  greeting_subtitle: { hi: "आज आपके खेत का स्वास्थ्य देखते हैं", en: "Let's check your farm's health today" },
  location: { hi: "📍 पुणे, महाराष्ट्र", en: "📍 Pune, Maharashtra" },
  weather_title: { hi: "आज का मौसम", en: "Today's Weather" },
  weather_desc: { hi: "साफ आसमान", en: "Clear Sky" },
  temp_label: { hi: "तापमान", en: "Temperature" },
  humidity_label: { hi: "नमी", en: "Humidity" },
  wind_label: { hi: "हवा", en: "Wind" },
  ai_suggestion_title: { hi: "AI सुझाव", en: "AI Suggestion" },
  ai_suggestion_text: { hi: "💧 आज शाम 6-7 बजे के बीच सिंचाई करना उपयुक्त रहेगा।", en: "💧 It is suitable to irrigate today between 6-7 PM." },
  disease_detection: { hi: "रोग पहचान", en: "Disease Detection" },
  disease_detection_subtitle: { hi: "फोटो खींचकर जांचें", en: "Check by taking a photo" },
  voice_assistant: { hi: "आवाज़ में पूछें", en: "Ask with Voice" },
  voice_assistant_subtitle: { hi: "बोलकर सलाह लें", en: "Get advice by speaking" },
  market_prices: { hi: "बाज़ार भाव", en: "Market Prices" },
  market_prices_subtitle: { hi: "ताज़ा दरें देखें", en: "See latest rates" },
  farm_calendar: { hi: "खेती कैलेंडर", en: "Farm Calendar" },
  farm_calendar_subtitle: { hi: "आज के काम", en: "Today's tasks" },
  current_crop_status: { hi: "वर्तमान फसल स्थिति", en: "Current Crop Status" },
  crop_name: { hi: "गेहूं", en: "Wheat" },
  sowing_date: { hi: "बुआई: 15 नवंबर 2024", en: "Sown: 15 Nov 2024" },
  healthy_status: { hi: "स्वस्थ स्थिति", en: "Healthy Condition" },
  days_label: { hi: "दिन", en: "Day" },
  growth: { hi: "Growth", en: "Growth" },
  health: { hi: "Health", en: "Health" },
  remaining: { hi: "Remaining", en: "Remaining" },
  days_remaining: { hi: "दिन", en: "days" },
  next_action: { hi: "अगला कार्य", en: "Next Action" },
  next_action_desc: { hi: "🌱 फसल में फूल आने का समय। फॉस्फोरस युक्त खाद डालें।", en: "🌱 Time for flowering. Apply phosphorus rich fertilizer." },
  
  // --- Bottom Nav ---
  dashboard: { hi: "डैशबोर्ड", en: "Dashboard" },
  profile: { hi: "प्रोफ़ाइल", en: "Profile" },

  // --- Profile Page ---
  profile_greeting: { hi: "राजू पटेल", en: "Raju Patel" },
  profile_location: { hi: "📍 पुणे, महाराष्ट्र", en: "📍 Pune, Maharashtra" },
  land_stat: { hi: "Land", en: "Land" },
  crops_stat: { hi: "Crops", en: "Crops" },
  experience_stat: { hi: "Experience", en: "Experience" },
  personal_info: { hi: "व्यक्तिगत जानकारी", en: "Personal Information" },
  name_label: { hi: "Name", en: "Name" },
  phone_label: { hi: "Phone", en: "Phone" },
  language_label: { hi: "Language", en: "Language" },
  location_label: { hi: "Location", en: "Location" },
  farm_info: { hi: "खेती की जानकारी", en: "Farm Information" },
  land_size_label: { hi: "Land Size", en: "Land Size" },
  primary_crops_label: { hi: "Primary Crops", en: "Primary Crops" },
  soil_type_label: { hi: "Soil Type", en: "Soil Type" },
  irrigation_label: { hi: "Irrigation", en: "Irrigation" },
  settings: { hi: "सेटिंग्स", en: "Settings" },
  language_toggle: { hi: "English Language", en: "हिंदी भाषा" },
  dark_mode_toggle: { hi: "डार्क मोड", en: "Dark Mode" },
  notifications_toggle: { hi: "सूचनाएं", en: "Notifications" },
  voice_assistance_toggle: { hi: "आवाज सहायता", en: "Voice Assistance" },
  edit_profile: { hi: "✏️ प्रोफाइल संपादित करें", en: "✏️ Edit Profile" },
  logout: { hi: "लॉग आउट", en: "Logout" },
  user_land_unit: { hi: "एकड़", en: "Acres" },
  guest_mode_notice: { hi: "आप अतिथि मोड में ब्राउज़ कर रहे हैं। अपना डेटा सहेजने और व्यक्तिगत सलाह पाने के लिए साइन अप करें।", en: "You are browsing in guest mode. Sign up to save your data and get personalized advice." },
  sign_up_now: { hi: "अभी साइन अप करें", en: "Sign Up Now" },
  exit_guest_mode: { hi: "अतिथि मोड से बाहर निकलें", en: "Exit Guest Mode" },
  
  // --- Disease Detection ---
  disease_detection_title: { hi: "🔬 AI रोग पहचान", en: "🔬 AI Disease Detection" },
  disease_detection_page_subtitle: { hi: "पत्तियों की फोटो से तुरंत जांच", en: "Instant check from leaf photos" },
  take_crop_photo: { hi: "फसल की फोटो खींचें", en: "Take a Crop Photo" },
  take_crop_photo_desc: { hi: "पत्ती की साफ तस्वीर लें ताकि AI सही जांच कर सके।", en: "Take a clear picture of the leaf for accurate AI analysis." },
  open_camera: { hi: "📸 कैमरा खोलें", en: "📸 Open Camera" },
  choose_from_gallery: { hi: "📁 गैलरी से चुनें", en: "📁 Choose from Gallery" },
  analyzing: { hi: "जांच हो रही है", en: "Analyzing" },
  analyze_with_ai: { hi: "🤖 AI से जांच कराएं", en: "🤖 Analyze with AI" },
  take_another_photo: { hi: "🔄 दूसरी फोटो लें", en: "🔄 Take Another Photo" },
  confidence_score: { hi: "आत्मविश्वास स्कोर", en: "Confidence Score" },
  symptoms: { hi: "लक्षण", en: "Symptoms" },
  treatment: { hi: "उपचार", en: "Treatment" },
  prevention: { hi: "बचाव के उपाय", en: "Prevention Measures" },
  save_to_history: { hi: "💾 इतिहास में सहेजें", en: "💾 Save to History" },
  view_history: { hi: "📜 इतिहास देखें", en: "📜 View History" },
  contact_expert: { hi: "📞 विशेषज्ञ से बात करें", en: "📞 Contact Expert" },
  analysis_history: { hi: "📜 विश्लेषण इतिहास", en: "📜 Analysis History" },
  no_history_found: { hi: "कोई सहेजा गया इतिहास नहीं मिला।", en: "No saved history found." },
  no_history_found_desc: { hi: "जब आप किसी विश्लेषण को सहेजते हैं, तो वह यहां दिखाई देगा।", en: "When you save an analysis, it will appear here." },
  save_history_prompt: { hi: "अपना विश्लेषण इतिहास सहेजने के लिए कृपया एक खाता बनाएं।", en: "To save your analysis history, please create an account."},
  
  // --- Voice Assistant Modal ---
  ai_response: { hi: "🤖 AI का जवाब:", en: "🤖 AI's Response:" },
  listening: { hi: "सुन रहा है...", en: "Listening..." },
  tap_to_ask: { hi: "पूछने के लिए टैप करें", en: "Tap to ask" },
};


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'hi');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('cropAdvisor_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('cropAdvisor_user');
      }
      // Simulate initial load time
      setTimeout(() => setIsLoading(false), 1000);
    };
    checkAuth();
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };
  
  const login = async (phone: string, password: string) => {
    const loggedInUser = await AuthService.login(phone, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'isVerified' | 'createdAt'>) => {
      const newUser = await AuthService.register(userData);
      setUser(newUser);
      return newUser;
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest_user',
      name: 'User',
      phone: '',
      location: {
        state: 'Maharashtra',
        district: 'Pune',
        village: 'Guestville',
      },
      farm: {
        landSize: 5,
        primaryCrops: ['Wheat', 'Sugarcane'],
        soilType: 'Alluvial',
        irrigationType: 'Drip',
        farmingExperience: 'Intermediate (3-10 years)',
      },
      isVerified: false,
      createdAt: new Date().toISOString(),
      isGuest: true,
    };
    setUser(guestUser);
  };

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, t, user, isLoading, login, logout, register, loginAsGuest }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};