import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import type { User } from '../types';
import AuthService from '../services/authService';

type Theme = 'light' | 'dark';
type Language = 'hi' | 'en' | 'pa';

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
  loginAsGuest: (name?: string) => void;
}

const translations: Record<string, Record<Language, string>> = {
  // --- Auth Flow ---
  welcome_title: { hi: "🙏 नमस्कार!", en: "🙏 Welcome!", pa: "🙏 ਜੀ ਆਇਆਂ ਨੂੰ!" },
  welcome_subtitle: { hi: "खेती में आधुनिक तकनीक का स्वागत है", en: "Welcome to modern technology in farming", pa: "ਖੇਤੀਬਾੜੀ ਵਿੱਚ ਆਧੁਨਿਕ ਤਕਨਾਲੋਜੀ ਦਾ ਸੁਆਗਤ ਹੈ" },
  welcome_description: { hi: "फसल की देखभाल, रोग पहचान, और बाज़ार की जानकारी एक ही जगह", en: "Crop care, disease detection, and market information in one place", pa: "ਫਸਲਾਂ ਦੀ ਦੇਖਭਾਲ, ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ, ਅਤੇ ਬਜ਼ਾਰ ਦੀ ਜਾਣਕਾਰੀ ਇੱਕੋ ਥਾਂ 'ਤੇ" },
  get_started: { hi: "शुरू करें", en: "Get Started", pa: "ਸ਼ੁਰੂ ਕਰੋ" },
  already_have_account: { hi: "पहले से खाता है?", en: "Already have an account?", pa: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?" },
  login_prompt: { hi: "लॉगिन करें", en: "Login", pa: "ਲੌਗਇਨ ਕਰੋ" },
  your_account: { hi: "अपना खाता", en: "Your Account", pa: "ਤੁਹਾਡਾ ਖਾਤਾ" },
  secure_farm_info: { hi: "खेती की जानकारी को सुरक्षित रखने के लिए", en: "To keep your farm information secure", pa: "ਆਪਣੀ ਖੇਤੀ ਦੀ ਜਾਣਕਾਰੀ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖਣ ਲਈ" },
  create_new_account: { hi: "नया खाता बनाएं", en: "Create New Account", pa: "ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ" },
  first_time_user: { hi: "पहली बार इस्तेमाल कर रहे हैं?", en: "Using for the first time?", pa: "ਪਹਿਲੀ ਵਾਰ ਵਰਤ ਰਹੇ ਹੋ?" },
  get_personalized_advice: { hi: "✅ व्यक्तिगत सलाह पाएं", en: "✅ Get personalized advice", pa: "✅ ਵਿਅਕਤੀਗਤ ਸਲਾਹ ਲਓ" },
  track_your_crops: { hi: "✅ अपनी फसल ट्रैक करें", en: "✅ Track your crops", pa: "✅ ਆਪਣੀਆਂ ਫਸਲਾਂ 'ਤੇ ਨਜ਼ਰ ਰੱਖੋ" },
  connect_with_experts: { hi: "✅ विशेषज्ञों से जुड़ें", en: "✅ Connect with experts", pa: "✅ ਮਾਹਿਰਾਂ ਨਾਲ ਜੁੜੋ" },
  create_account_btn: { hi: "खाता बनाएं", en: "Create Account", pa: "ਖਾਤਾ ਬਣਾਓ" },
  existing_user: { hi: "पहले से खाता है?", en: "Already have an account?", pa: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?" },
  quick_dashboard_access: { hi: "⚡ तुरंत डैशबोर्ड देखें", en: "⚡ Instant dashboard access", pa: "⚡ ਤੁਰੰਤ ਡੈਸ਼ਬੋਰਡ ਐਕਸੈਸ" },
  view_your_data: { hi: "📊 अपना डेटा देखें", en: "📊 View your data", pa: "📊 ਆਪਣਾ ਡਾਟਾ ਵੇਖੋ" },
  continue_where_left: { hi: "🔄 जहाँ छोड़ा था, वहीं से शुरू करें", en: "🔄 Continue where you left off", pa: "🔄 ਜਿੱਥੇ ਛੱਡਿਆ ਸੀ ਉੱਥੋਂ ਜਾਰੀ ਰੱਖੋ" },
  login_title: { hi: "🔐 लॉगिन करें", en: "🔐 Login", pa: "🔐 ਲੌਗਇਨ ਕਰੋ" },
  login_subtitle: { hi: "अपने खेत की जानकारी देखने के लिए", en: "To see your farm information", pa: "ਆਪਣੀ ਖੇਤੀ ਦੀ ਜਾਣਕਾਰੀ ਦੇਖਣ ਲਈ" },
  phone_number: { hi: "📱 मोबाइल नंबर *", en: "📱 Mobile Number *", pa: "📱 ਮੋਬਾਈਲ ਨੰਬਰ *" },
  password: { hi: "🔒 पासवर्ड *", en: "🔒 Password *", pa: "🔒 ਪਾਸਵਰਡ *" },
  enter_your_password: { hi: "अपना पासवर्ड डालें", en: "Enter your password", pa: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ" },
  remember_me: { hi: "मुझे याद रखें", en: "Remember me", pa: "ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ" },
  forgot_password: { hi: "पासवर्ड भूल गए?", en: "Forgot password?", pa: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?" },
  new_user_prompt: { hi: "नया यूजर हैं?", en: "New user?", pa: "ਨਵੇਂ ਉਪਭੋਗਤਾ ਹੋ?" },
  signup_step_1: { hi: "चरण 1 का 3", en: "Step 1 of 3", pa: "ਕਦਮ 1/3" },
  signup_title_1: { hi: "👤 बुनियादी जानकारी", en: "👤 Basic Information", pa: "👤 ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ" },
  your_name: { hi: "🏷️ आपका नाम *", en: "🏷️ Your Name *", pa: "🏷️ ਤੁਹਾਡਾ ਨਾਮ *" },
  create_password: { hi: "🔒 नया पासवर्ड बनाएं *", en: "🔒 Create New Password *", pa: "🔒 ਨਵਾਂ ਪਾਸਵਰਡ ਬਣਾਓ *" },
  confirm_password: { hi: "🔒 पासवर्ड दोहराएं *", en: "🔒 Confirm Password *", pa: "🔒 ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ *" },
  signup_step_2: { hi: "चरण 2 का 3", en: "Step 2 of 3", pa: "ਕਦਮ 2/3" },
  signup_title_2: { hi: "📍 स्थान की जानकारी", en: "📍 Location Information", pa: "📍 ਸਥਾਨ ਦੀ ਜਾਣਕਾਰੀ" },
  select_state: { hi: "🏛️ राज्य चुनें *", en: "🏛️ Select State *", pa: "🏛️ ਰਾਜ ਚੁਣੋ *" },
  select_district: { hi: "🏘️ जिला चुनें *", en: "🏘️ Select District *", pa: "🏘️ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ *" },
  village_area: { hi: "🏠 गांव/क्षेत्र", en: "🏠 Village/Area", pa: "🏠 ਪਿੰਡ/ਖੇਤਰ" },
  signup_step_3: { hi: "चरण 3 का 3", en: "Step 3 of 3", pa: "ਕਦਮ 3/3" },
  signup_title_3: { hi: "🌾 खेती की जानकारी", en: "🌾 Farm Information", pa: "🌾 ਖੇਤੀ ਦੀ ਜਾਣਕਾਰੀ" },
  land_size_acres: { hi: "📏 कुल जमीन (एकड़ में) *", en: "📏 Total Land (in Acres) *", pa: "📏 ਕੁੱਲ ਜ਼ਮੀਨ (ਏਕੜ ਵਿੱਚ) *" },
  primary_crops: { hi: "🌱 मुख्य फसलें *", en: "🌱 Primary Crops *", pa: "🌱 ਮੁੱਖ ਫਸਲਾਂ *" },
  soil_type: { hi: "🏔️ मिट्टी का प्रकार", en: "🏔️ Soil Type", pa: "🏔️ ਮਿੱਟੀ ਦੀ ਕਿਸਮ" },
  irrigation_method: { hi: "💧 सिंचाई का तरीका", en: "💧 Irrigation Method", pa: "💧 ਸਿੰਚਾਈ ਦਾ ਤਰੀਕਾ" },
  farming_experience: { hi: "👨‍🌾 खेती का अनुभव", en: "👨‍🌾 Farming Experience", pa: "👨‍🌾 ਖੇਤੀ ਦਾ ਤਜਰਬਾ" },
  next_step: { hi: "अगला चरण", en: "Next Step", pa: "ਅਗਲਾ ਕਦਮ" },
  previous_step: { hi: "पिछला चरण", en: "Previous Step", pa: "ਪਿਛਲਾ ਕਦਮ" },
  finish_signup: { hi: "पंजीकरण पूरा करें", en: "Finish Registration", pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੂਰੀ ਕਰੋ" },
  signup_success_title: { hi: "🎉 बधाई हो!", en: "🎉 Congratulations!", pa: "🎉 ਵਧਾਈਆਂ!" },
  signup_success_subtitle: { hi: "आपका खाता तैयार है", en: "Your account is ready", pa: "ਤੁਹਾਡਾ ਖਾਤਾ ਤਿਆਰ ਹੈ" },
  signup_success_message: { hi: "आपकी खेती की यात्रा अब शुरू होती है", en: "Your farming journey starts now", pa: "ਤੁਹਾਡੀ ਖੇਤੀ ਦੀ ਯਾਤਰਾ ਹੁਣ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ" },
  view_dashboard: { hi: "डैशबोर्ड देखें", en: "View Dashboard", pa: "ਡੈਸ਼ਬੋਰਡ ਵੇਖੋ" },
  continue_as_guest: { hi: "या, मेहमान के रूप में जारी रखें", en: "Or, continue as a guest", pa: "ਜਾਂ, ਮਹਿਮਾਨ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ" },
  enter_as_guest: { hi: "अतिथि के रूप में प्रवेश करें", en: "Enter as Guest", pa: "ਮਹਿਮਾਨ ਵਜੋਂ ਦਾਖਲ ਹੋਵੋ" },
  your_guest_name: { hi: "आपका नाम", en: "Your Name", pa: "ਤੁਹਾਡਾ ਨਾਮ" },
  continue_btn: { hi: "जारी रखें", en: "Continue", pa: "ਜਾਰੀ ਰੱਖੋ" },

  // --- Dashboard ---
  greeting: { hi: "🙏 नमस्कार", en: "🙏 Hello", pa: "🙏 ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ" },
  greeting_subtitle: { hi: "आज आपके खेत का स्वास्थ्य देखते हैं", en: "Let's check your farm's health today", pa: "ਆਓ ਅੱਜ ਤੁਹਾਡੇ ਖੇਤ ਦੀ ਸਿਹਤ ਦੀ ਜਾਂਚ ਕਰੀਏ" },
  location: { hi: "📍 पुणे, महाराष्ट्र", en: "📍 Pune, Maharashtra", pa: "📍 ਪੁਣੇ, ਮਹਾਰਾਸ਼ਟਰ" },
  weather_title: { hi: "आज का मौसम", en: "Today's Weather", pa: "ਅੱਜ ਦਾ ਮੌਸਮ" },
  weather_desc: { hi: "साफ आसमान", en: "Clear Sky", pa: "ਸਾਫ ਆਸਮਾਨ" },
  temp_label: { hi: "तापमान", en: "Temperature", pa: "ਤਾਪਮਾਨ" },
  humidity_label: { hi: "नमी", en: "Humidity", pa: "ਨਮੀ" },
  wind_label: { hi: "हवा", en: "Wind", pa: "ਹਵਾ" },
  ai_suggestion_title: { hi: "AI सुझाव", en: "AI Suggestion", pa: "AI ਸੁਝਾਅ" },
  ai_suggestion_text: { hi: "💧 आज शाम 6-7 बजे के बीच सिंचाई करना उपयुक्त रहेगा।", en: "💧 It is suitable to irrigate today between 6-7 PM.", pa: "💧 ਅੱਜ ਸ਼ਾਮ 6-7 ਵਜੇ ਦੇ ਵਿਚਕਾਰ ਸਿੰਚਾਈ ਕਰਨਾ ਉਚਿਤ ਰਹੇਗਾ।" },
  disease_detection_subtitle: { hi: "फोटो खींचकर जांचें", en: "Check by taking a photo", pa: "ਤਸਵੀਰ ਲੈ ਕੇ ਜਾਂਚ ਕਰੋ" },
  voice_assistant_subtitle: { hi: "बोलकर सलाह लें", en: "Get advice by speaking", pa: "ਬੋਲ ਕੇ ਸਲਾਹ ਲਓ" },
  market_prices_subtitle: { hi: "ताज़ा दरें देखें", en: "See latest rates", pa: "ਤਾਜ਼ਾ ਰੇਟ ਵੇਖੋ" },
  farm_calendar_subtitle: { hi: "आज के काम", en: "Today's tasks", pa: "ਅੱਜ ਦੇ ਕੰਮ" },
  current_crop_status: { hi: "वर्तमान फसल स्थिति", en: "Current Crop Status", pa: "ਮੌਜੂਦਾ ਫਸਲ ਦੀ ਸਥਿਤੀ" },
  crop_name: { hi: "गेहूं", en: "Wheat", pa: "ਕਣਕ" },
  sowing_date: { hi: "बुआई: 15 नवंबर 2024", en: "Sown: 15 Nov 2024", pa: "ਬਿਜਾਈ: 15 ਨਵੰਬਰ 2024" },
  healthy_status: { hi: "स्वस्थ स्थिति", en: "Healthy Condition", pa: "ਸਿਹਤਮੰਦ ਸਥਿਤੀ" },
  days_label: { hi: "दिन", en: "Day", pa: "ਦਿਨ" },
  growth: { hi: "Growth", en: "Growth", pa: "ਵਿਕਾਸ" },
  health: { hi: "Health", en: "Health", pa: "ਸਿਹਤ" },
  remaining: { hi: "Remaining", en: "Remaining", pa: "ਬਾਕੀ" },
  days_remaining: { hi: "दिन", en: "days", pa: "ਦਿਨ" },
  next_action: { hi: "अगला कार्य", en: "Next Action", pa: "ਅਗਲੀ ਕਾਰਵਾਈ" },
  next_action_desc: { hi: "🌱 फसल में फूल आने का समय। फॉस्फोरस युक्त खाद डालें।", en: "🌱 Time for flowering. Apply phosphorus rich fertilizer.", pa: "🌱 ਫੁੱਲ ਆਉਣ ਦਾ ਸਮਾਂ। ਫਾਸਫੋਰਸ ਨਾਲ ਭਰਪੂਰ ਖਾਦ ਪਾਓ।" },
  
  // --- Bottom Nav ---
  dashboard: { hi: "डैशबोर्ड", en: "Dashboard", pa: "ਡੈਸ਼ਬੋਰਡ" },
  disease_detection: { hi: "रोग पहचान", en: "Disease", pa: "ਰੋਗ" },
  voice_assistant: { hi: "सहायक", en: "Assistant", pa: "ਸਹਾਇਕ" },
  crop_calendar: { hi: "कैलेंडर", en: "Calendar", pa: "ਕੈਲੰਡਰ" },
  market_prices: { hi: "बाज़ार", en: "Market", pa: "ਬਜ਼ਾਰ" },
  weather: { hi: "मौसम", en: "Weather", pa: "ਮੌਸਮ" },
  profile: { hi: "प्रोफ़ाइल", en: "Profile", pa: "ਪ੍ਰੋਫਾਈਲ" },

  // --- Profile Page ---
  profile_greeting: { hi: "राजू पटेल", en: "Raju Patel", pa: "ਰਾਜੂ ਪਟੇਲ" },
  profile_location: { hi: "📍 पुणे, महाराष्ट्र", en: "📍 Pune, Maharashtra", pa: "📍 ਪੁਣੇ, ਮਹਾਰਾਸ਼ਟਰ" },
  land_stat: { hi: "Land", en: "Land", pa: "ਜ਼ਮੀਨ" },
  crops_stat: { hi: "Crops", en: "Crops", pa: "ਫਸਲਾਂ" },
  experience_stat: { hi: "Experience", en: "Experience", pa: "ਤਜਰਬਾ" },
  personal_info: { hi: "व्यक्तिगत जानकारी", en: "Personal Information", pa: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ" },
  name_label: { hi: "Name", en: "Name", pa: "ਨਾਮ" },
  phone_label: { hi: "Phone", en: "Phone", pa: "ਫ਼ੋਨ" },
  language_label: { hi: "Language", en: "Language", pa: "ਭਾਸ਼ਾ" },
  location_label: { hi: "Location", en: "Location", pa: "ਸਥਾਨ" },
  farm_info: { hi: "खेती की जानकारी", en: "Farm Information", pa: "ਖੇਤੀ ਦੀ ਜਾਣਕਾਰੀ" },
  land_size_label: { hi: "Land Size", en: "Land Size", pa: "ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ" },
  primary_crops_label: { hi: "Primary Crops", en: "Primary Crops", pa: "ਮੁੱਖ ਫਸਲਾਂ" },
  soil_type_label: { hi: "Soil Type", en: "Soil Type", pa: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ" },
  irrigation_label: { hi: "Irrigation", en: "Irrigation", pa: "ਸਿੰਚਾਈ" },
  settings: { hi: "सेटिंग्स", en: "Settings", pa: "ਸੈਟਿੰਗਜ਼" },
  language_toggle: { hi: "भाषा बदलें", en: "Change Language", pa: "ਭਾਸ਼ਾ ਬਦਲੋ" },
  dark_mode_toggle: { hi: "डार्क मोड", en: "Dark Mode", pa: "ਡਾਰਕ ਮੋਡ" },
  notifications_toggle: { hi: "सूचनाएं", en: "Notifications", pa: "ਸੂਚਨਾਵਾਂ" },
  voice_assistance_toggle: { hi: "आवाज सहायता", en: "Voice Assistance", pa: "ਆਵਾਜ਼ ਸਹਾਇਤਾ" },
  edit_profile: { hi: "✏️ प्रोफाइल संपादित करें", en: "✏️ Edit Profile", pa: "✏️ ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ" },
  logout: { hi: "लॉग आउट", en: "Logout", pa: "ਲੌਗ ਆਉਟ" },
  user_land_unit: { hi: "एकड़", en: "Acres", pa: "ਏਕੜ" },
  guest_mode_notice: { hi: "आप अतिथि मोड में ब्राउज़ कर रहे हैं। अपना डेटा सहेजने और व्यक्तिगत सलाह पाने के लिए साइन अप करें।", en: "You are browsing in guest mode. Sign up to save your data and get personalized advice.", pa: "ਤੁਸੀਂ ਗੈਸਟ ਮੋਡ ਵਿੱਚ ਬ੍ਰਾਊਜ਼ ਕਰ ਰਹੇ ਹੋ। ਆਪਣਾ ਡਾਟਾ ਸੁਰੱਖਿਅਤ ਕਰਨ ਅਤੇ ਵਿਅਕਤੀਗਤ ਸਲਾਹ ਲੈਣ ਲਈ ਸਾਈਨ ਅੱਪ ਕਰੋ।" },
  sign_up_now: { hi: "अभी साइन अप करें", en: "Sign Up Now", pa: "ਹੁਣੇ ਸਾਈਨ ਅੱਪ ਕਰੋ" },
  exit_guest_mode: { hi: "अतिथि मोड से बाहर निकलें", en: "Exit Guest Mode", pa: "ਗੈਸਟ ਮੋਡ ਤੋਂ ਬਾਹਰ ਜਾਓ" },
  
  // --- Disease Detection ---
  disease_detection_title: { hi: "🔬 AI रोग पहचान", en: "🔬 AI Disease Detection", pa: "🔬 AI ਰੋਗ ਦੀ ਪਛਾਣ" },
  disease_detection_page_subtitle: { hi: "पत्तियों की फोटो से तुरंत जांच", en: "Instant check from leaf photos", pa: "ਪੱਤਿਆਂ ਦੀਆਂ ਫੋਟੋਆਂ ਤੋਂ ਤੁਰੰਤ ਜਾਂਚ" },
  take_crop_photo: { hi: "फसल की फोटो खींचें", en: "Take a Crop Photo", pa: "ਫਸਲ ਦੀ ਫੋਟੋ ਲਓ" },
  take_crop_photo_desc: { hi: "पत्ती की साफ तस्वीर लें ताकि AI सही जांच कर सके।", en: "Take a clear picture of the leaf for accurate AI analysis.", pa: "ਸਹੀ AI ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਪੱਤੇ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਲਓ।" },
  open_camera: { hi: "📸 कैमरा खोलें", en: "📸 Open Camera", pa: "📸 ਕੈਮਰਾ ਖੋਲ੍ਹੋ" },
  choose_from_gallery: { hi: "📁 गैलरी से चुनें", en: "📁 Choose from Gallery", pa: "📁 ਗੈਲਰੀ ਵਿੱਚੋਂ ਚੁਣੋ" },
  analyzing: { hi: "जांच हो रही है", en: "Analyzing", pa: "ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ" },
  analyze_with_ai: { hi: "🤖 AI से जांच कराएं", en: "🤖 Analyze with AI", pa: "🤖 AI ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ" },
  take_another_photo: { hi: "🔄 दूसरी फोटो लें", en: "🔄 Take Another Photo", pa: "🔄 ਦੂਜੀ ਫੋਟੋ ਲਓ" },
  confidence_score: { hi: "आत्मविश्वास स्कोर", en: "Confidence Score", pa: "ਵਿਸ਼ਵਾਸ ਸਕੋਰ" },
  symptoms: { hi: "लक्षण", en: "Symptoms", pa: "ਲੱਛਣ" },
  treatment: { hi: "उपचार", en: "Treatment", pa: "ਇਲਾਜ" },
  prevention: { hi: "बचाव के उपाय", en: "Prevention Measures", pa: "ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ" },
  save_to_history: { hi: "💾 इतिहास में सहेजें", en: "💾 Save to History", pa: "💾 ਇਤਿਹਾਸ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਕਰੋ" },
  view_history: { hi: "📜 इतिहास देखें", en: "📜 View History", pa: "📜 ਇਤਿਹਾਸ ਵੇਖੋ" },
  contact_expert: { hi: "📞 विशेषज्ञ से बात करें", en: "📞 Contact Expert", pa: "📞 ਮਾਹਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ" },
  analysis_history: { hi: "📜 विश्लेषण इतिहास", en: "📜 Analysis History", pa: "📜 ਵਿਸ਼ਲੇਸ਼ਣ ਇਤਿਹਾਸ" },
  no_history_found: { hi: "कोई सहेजा गया इतिहास नहीं मिला।", en: "No saved history found.", pa: "ਕੋਈ ਸੁਰੱਖਿਅਤ ਕੀਤਾ ਇਤਿਹਾਸ ਨਹੀਂ ਮਿਲਿਆ।" },
  no_history_found_desc: { hi: "जब आप किसी विश्लेषण को सहेजते हैं, तो वह यहां दिखाई देगा।", en: "When you save an analysis, it will appear here.", pa: "ਜਦੋਂ ਤੁਸੀਂ ਕੋਈ ਵਿਸ਼ਲੇਸ਼ਣ ਸੁਰੱਖਿਅਤ ਕਰਦੇ ਹੋ, ਤਾਂ ਉਹ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ।" },
  save_history_prompt: { hi: "अपना विश्लेषण इतिहास सहेजने के लिए कृपया एक खाता बनाएं।", en: "To save your analysis history, please create an account.", pa: "ਆਪਣਾ ਵਿਸ਼ਲੇਸ਼ਣ ਇਤਿਹਾਸ ਸੁਰੱਖਿਅਤ ਕਰਨ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਖਾਤਾ ਬਣਾਓ।" },
  
  // --- Voice Assistant Page ---
  voice_assistant_title: { hi: "🎤 AI आवाज़ सहायक", en: "🎤 AI Voice Assistant", pa: "🎤 AI ਆਵਾਜ਼ ਸਹਾਇਕ" },
  voice_assistant_page_subtitle: { hi: "बोलकर अपनी खेती के सवाल पूछें", en: "Ask your farming questions by speaking", pa: "ਬੋਲ ਕੇ ਆਪਣੇ ਖੇਤੀ ਦੇ ਸਵਾਲ ਪੁੱਛੋ" },
  voice_welcome_message: { hi: "नमस्ते! मैं आपका खेती सहायक हूँ। आप मौसम, बाज़ार भाव, या फसल की जानकारी के बारे में पूछ सकते हैं।", en: "Hello! I am your farming assistant. You can ask about weather, market prices, or crop information.", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੌਸਮ, ਬਜ਼ਾਰ ਭਾਅ, ਜਾਂ ਫਸਲ ਦੀ ਜਾਣਕਾਰੀ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।" },
  listening: { hi: "सुन रहा है...", en: "Listening...", pa: "ਸੁਣ ਰਿਹਾ ਹਾਂ..." },
  processing: { hi: "सोच रहा है...", en: "Processing...", pa: "ਪ੍ਰੋਸੈਸਿੰਗ..." },
  tap_to_speak: { hi: "बोलने के लिए टैप करें", en: "Tap to Speak", pa: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ" },
  speak_now: { hi: "अब बोलें...", en: "Speak now...", pa: "ਹੁਣ ਬੋਲੋ..." },
  quick_queries: { hi: "त्वरित प्रश्न:", en: "Quick Queries:", pa: "ਤੁਰੰਤ ਸਵਾਲ:" },
  ask_weather: { hi: "आज का मौसम", en: "Today's weather", pa: "ਅੱਜ ਦਾ ਮੌਸਮ" },
  ask_market_price: { hi: "गेहूं का भाव", en: "Wheat price", pa: "ਕਣਕ ਦਾ ਭਾਅ" },
  ask_crop_info: { hi: "गन्ने में पानी कब दें", en: "When to water sugarcane", pa: "ਗੰਨੇ ਨੂੰ ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਹੈ" },
  
  // --- Market Prices Page ---
  market_prices_title: { hi: "📈 आज के बाज़ार भाव", en: "📈 Today's Market Prices", pa: "📈 ਅੱਜ ਦੇ ਬਜ਼ਾਰ ਭਾਅ" },
  market_prices_page_subtitle: { hi: "प्रमुख मंडियों से वास्तविक समय की कीमतें", en: "Real-time prices from major mandis", pa: "ਪ੍ਰਮੁੱਖ ਮੰਡੀਆਂ ਤੋਂ ਅਸਲ-ਸਮੇਂ ਦੀਆਂ ਕੀਮਤਾਂ" },
  last_updated: { hi: "आखिरी अपडेट:", en: "Last Updated:", pa: "ਆਖਰੀ ਅੱਪਡੇਟ:" },
  quintal: { hi: "क्विंटल", en: "quintal", pa: "ਕੁਇੰਟਲ" },
  price_details: { hi: "मूल्य विवरण", en: "Price Details", pa: "ਕੀਮਤ ਦੇ ਵੇਰਵੇ" },
  seven_day_trend: { hi: "7-दिन का ट्रेंड", en: "7-Day Trend", pa: "7-ਦਿਨ ਦਾ ਰੁਝਾਨ" },
  market_info: { hi: "बाजार की जानकारी", en: "Market Information", pa: "ਬਜ਼ਾਰ ਦੀ ਜਾਣਕਾਰੀ" },
  market_volume: { hi: "बाजार मात्रा", en: "Market Volume", pa: "ਬਜ਼ਾਰ ਦੀ ਮਾਤਰਾ" },
  quality_grade: { hi: "गुणवत्ता ग्रेड", en: "Quality Grade", pa: "ਗੁਣਵੱਤਾ ਗ੍ਰੇਡ" },
  ai_selling_advice: { hi: "AI बेचने की सलाह", en: "AI Selling Advice", pa: "AI ਵੇਚਣ ਦੀ ਸਲਾਹ" },
  selling_advice_text: { hi: "कीमतें बढ़ रही हैं। अगले 2-3 दिनों में बेचना फायदेमंद हो सकता है।", en: "Prices are trending up. Selling in the next 2-3 days could be profitable.", pa: "ਕੀਮਤਾਂ ਵੱਧ ਰਹੀਆਂ ਹਨ। ਅਗਲੇ 2-3 ਦਿਨਾਂ ਵਿੱਚ ਵੇਚਣਾ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ।" },
  
  // --- Crop Calendar Page ---
  crop_calendar_title: { hi: "📅 फसल कैलेंडर", en: "📅 Crop Calendar", pa: "📅 ਫਸਲ ਕੈਲੰਡਰ" },
  crop_calendar_page_subtitle: { hi: "आपकी फसलों के लिए मौसमी गाइड", en: "Seasonal guide for your crops", pa: "ਤੁਹਾਡੀਆਂ ਫਸਲਾਂ ਲਈ ਮੌਸਮੀ ਗਾਈਡ" },
  todays_tasks: { hi: "आज के कार्य", en: "Today's Tasks", pa: "ਅੱਜ ਦੇ ਕੰਮ" },
  high_priority: { hi: "उच्च प्राथमिकता", en: "High Priority", pa: "ਉੱਚ ਤਰਜੀਹ" },
  medium_priority: { hi: "मध्यम प्राथमिकता", en: "Medium Priority", pa: "ਮੱਧਮ ਤਰਜੀਹ" },
  low_priority: { hi: "कम प्राथमिकता", en: "Low Priority", pa: "ਘੱਟ ਤਰਜੀਹ" },
  completed: { hi: "पूर्ण", en: "Completed", pa: "ਪੂਰਾ ਹੋਇਆ" },

  // --- Weather Page ---
  weather_page_title: { hi: "🌤️ मौसम पूर्वानुमान", en: "🌤️ Weather Forecast", pa: "🌤️ ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ" },
  weather_page_subtitle: { hi: "अपने खेत के लिए विस्तृत मौसम की जानकारी", en: "Detailed weather information for your farm", pa: "ਤੁਹਾਡੇ ਖੇਤ ਲਈ ਵਿਸਤ੍ਰਿਤ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ" },
  feels_like: { hi: "जैसा महसूस होता है", en: "Feels like", pa: "ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ" },
  pressure: { hi: "दबाव", en: "Pressure", pa: "ਦਬਾਅ" },
  visibility: { hi: "दृश्यता", en: "Visibility", pa: "ਦ੍ਰਿਸ਼ਟੀ" },
  uv_index: { hi: "यूवी इंडेक्स", en: "UV Index", pa: "ਯੂਵੀ ਇੰਡੈਕਸ" },
  hourly_forecast: { hi: "घंटे का पूर्वानुमान", en: "Hourly Forecast", pa: "ਘੰਟਾਵਾਰ ਭਵਿੱਖਬਾਣੀ" },
  seven_day_forecast: { hi: "7-दिन का पूर्वानुमान", en: "7-Day Forecast", pa: "7-ਦਿਨ ਦੀ ਭਵਿੱਖਬਾਣੀ" },
  farming_advice: { hi: "खेती की सलाह", en: "Farming Advice", pa: "ਖੇਤੀ ਸਲਾਹ" },
  weather_advice_text: { hi: "शाम को सिंचाई के लिए अच्छा दिन है। कल बारिश की संभावना है, इसलिए आज कीटनाशक का छिड़काव न करें।", en: "Good day for evening irrigation. Rain is expected tomorrow, so avoid pesticide spraying today.", pa: "ਸ਼ਾਮ ਨੂੰ ਸਿੰਚਾਈ ਲਈ ਚੰਗਾ ਦਿਨ ਹੈ। ਕੱਲ੍ਹ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ, ਇਸ ਲਈ ਅੱਜ ਕੀਟਨਾਸ਼ਕਾਂ ਦਾ ਛਿੜਕਾਅ ਨਾ ਕਰੋ।" },
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

  const loginAsGuest = (name?: string) => {
    const guestName = name && name.trim().length > 0 ? name.trim() : 'User';
    const guestUser: User = {
      id: 'guest_user',
      name: guestName,
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