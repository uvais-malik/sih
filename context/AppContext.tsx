import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';
type Language = 'hi' | 'en';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // --- Dashboard ---
  greeting: { hi: "🙏 नमस्कार, राजू जी!", en: "🙏 Hello, Raju!" },
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
  language_toggle: { hi: "अंग्रेजी भाषा", en: "English Language" },
  dark_mode_toggle: { hi: "डार्क मोड", en: "Dark Mode" },
  notifications_toggle: { hi: "सूचनाएं", en: "Notifications" },
  voice_assistance_toggle: { hi: "आवाज सहायता", en: "Voice Assistance" },
  edit_profile: { hi: "✏️ प्रोफाइल संपादित करें", en: "✏️ Edit Profile" },
  user_name: { hi: "राजू पटेल", en: "Raju Patel" },
  user_phone: { hi: "+91-9876543210", en: "+91-9876543210" },
  user_language: { hi: "हिंदी", en: "English" },
  user_location: { hi: "पुणे, महाराष्ट्र", en: "Pune, Maharashtra" },
  user_land_size: { hi: "5 एकड़", en: "5 Acres" },
  user_primary_crops: { hi: "गन्ना, प्याज", en: "Sugarcane, Onion" },
  user_soil_type: { hi: "काली कपास मिट्टी", en: "Black Cotton Soil" },
  user_irrigation: { hi: "ड्रिप सिंचाई", en: "Drip Irrigation" },
  user_experience_value: { hi: "2 साल", en: "2 Years" },
  user_land_value: { hi: "5 एकड़", en: "5 Acres" },
  user_crops_value: { hi: "3 फसलें", en: "3 Crops" },
  
  // --- Disease Detection ---
  disease_detection_title: { hi: "🔬 AI रोग पहचान", en: "🔬 AI Disease Detection" },
  disease_detection_page_subtitle: { hi: "पत्तियों की फोटो से तुरंत जांच", en: "Instant check from leaf photos" },
  
  // CameraView
  take_crop_photo: { hi: "फसल की फोटो खींचें", en: "Take a Crop Photo" },
  take_crop_photo_desc: { hi: "पत्ती की साफ तस्वीर लें ताकि AI सही जांच कर सके।", en: "Take a clear picture of the leaf for accurate AI analysis." },
  open_camera: { hi: "📸 कैमरा खोलें", en: "📸 Open Camera" },
  choose_from_gallery: { hi: "📁 गैलरी से चुनें", en: "📁 Choose from Gallery" },
  analyzing: { hi: "जांच हो रही है...", en: "Analyzing..." },
  analyze_with_ai: { hi: "🤖 AI से जांच कराएं", en: "🤖 Analyze with AI" },
  take_another_photo: { hi: "🔄 दूसरी फोटो लें", en: "🔄 Take Another Photo" },

  // AnalysisResults
  confidence_score: { hi: "आत्मविश्वास स्कोर", en: "Confidence Score" },
  symptoms: { hi: "लक्षण", en: "Symptoms" },
  treatment: { hi: "उपचार", en: "Treatment" },
  prevention: { hi: "बचाव के उपाय", en: "Prevention Measures" },
  save_to_history: { hi: "💾 इतिहास में सहेजें", en: "💾 Save to History" },
  view_history: { hi: "📜 इतिहास देखें", en: "📜 View History" },
  contact_expert: { hi: "📞 विशेषज्ञ से बात करें", en: "📞 Contact Expert" },

  // AnalysisHistory
  analysis_history: { hi: "📜 विश्लेषण इतिहास", en: "📜 Analysis History" },
  no_history_found: { hi: "कोई सहेजा गया इतिहास नहीं मिला।", en: "No saved history found." },
  no_history_found_desc: { hi: "जब आप किसी विश्लेषण को सहेजते हैं, तो वह यहां दिखाई देगा।", en: "When you save an analysis, it will appear here." },
  
  // --- Voice Assistant Modal ---
  ai_response: { hi: "🤖 AI का जवाब:", en: "🤖 AI's Response:" },
  listening: { hi: "सुन रहा है...", en: "Listening..." },
  tap_to_ask: { hi: "पूछने के लिए टैप करें", en: "Tap to ask" },
};


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'hi');

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

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
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
