import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "appTitle": "Rahu Kaal Tracker",
    "appSubtitle": "Vedic Astrology Timing Guide",
    "themeToggle": "Toggle theme",
    "enableAlerts": "Enable Daily Alerts",
    "alertLabel": "Alert:",
    "atStart": "At Start",
    "minBefore": "m before",
    "hourBefore": "h before",
    "locationDetect": "Detect",
    "locationSearch": "Search City",
    "locationPlaceholder": "Search city...",
    "currentLocation": "Current Location",
    "noResults": "No results found",
    "todayRahu": "Today's Rahu Kaal",
    "startsIn": "Starts in",
    "endsIn": "Ends in",
    "completed": "Completed for today",
    "safePeriod": "Safe Period",
    "rahuActive": "Rahu Kaal Active",
    "rahuPassed": "Rahu Kaal Passed",
    "sunrise": "Sunrise",
    "sunset": "Sunset",
    "infoTitle": "What is Rahu Kaal?",
    "infoDesc": "Rahu Kaal is a period considered inauspicious in Vedic Astrology for starting new ventures. It is calculated daily based on local sunrise and sunset.",
    "upcomingTimings": "Upcoming Timings",
    "planAhead": "Plan your important activities ahead.",
    "date": "Date",
    "time": "Rahu Kaal Time",
    "duration": "Duration",
    "today": "Today",
    "loadMore": "Load Next 7 Days",
    "loading": "Loading...",
    "aboutGuide": "Detailed Guide & Privacy",
    "aboutSubtitle": "Astrological significance and usage instructions",
    "astroSig": "Astrological Significance",
    "astroDesc": "In Vedic Astrology, Rahu is a shadow planet (North Node of the Moon) associated with materialism, mischief, and eclipses. Rahu Kaal (Time of Rahu) is a daily period of approximately 90 minutes deemed inauspicious for beginning new, important ventures. It is believed that activities started during this time may face obstacles or yield negative results. However, routine activities (like daily work or ongoing projects) are not affected and can be continued normally.",
    "howToUse": "How to Use This Tracker",
    "useTip1": "Location Matters: Rahu Kaal varies by seconds or minutes depending on your longitude and latitude. Always ensure your location is set correctly.",
    "useTip2": "Plan Ahead: Use the \"Upcoming 7 Days\" table to schedule meetings or ceremonies outside of these windows.",
    "useTip3": "Set Alerts: Enable notifications to get reminders 15 minutes (or your preferred time) before Rahu Kaal begins.",
    "privacy": "Privacy & Data Security",
    "privacyDesc": "We prioritize your privacy. Here is how we handle your data: Location data is processed locally on your device. We do not store your coordinates on any server. Preferences are saved in your browser's LocalStorage.",
    "subscribeTitle": "Get Daily SMS Alerts",
    "subscribeDesc": "Don't miss a timing. Receive precise Rahu Kaal timings for your location directly to your phone every morning.",
    "fullName": "Full Name",
    "phoneNumber": "Phone Number",
    "registeringFor": "Registering for:",
    "subscribeBtn": "Subscribe Now",
    "subscribing": "Subscribing...",
    "successTitle": "You're Subscribed!",
    "successDesc": "We'll send daily Rahu Kaal alerts for",
    "registerAnother": "Register another number",
    "footerText": "Timings are cached locally for offline access and speed.",
    "errorSolar": "Failed to load solar data. Please check your connection or try a different location.",
    "langToggle": "हिन्दी",
    "min": "min"
  },
  hi: {
    "appTitle": "राहु काल ट्रैकर",
    "appSubtitle": "वैदिक ज्योतिष समय गाइड",
    "themeToggle": "थीम बदलें",
    "enableAlerts": "दैनिक अलर्ट सक्षम करें",
    "alertLabel": "चेतावनी:",
    "atStart": "शुरुआत पर",
    "minBefore": "मिनट पहले",
    "hourBefore": "घंटा पहले",
    "locationDetect": "खोजें",
    "locationSearch": "शहर खोजें",
    "locationPlaceholder": "शहर खोजें...",
    "currentLocation": "वर्तमान स्थान",
    "noResults": "कोई परिणाम नहीं मिला",
    "todayRahu": "आज का राहु काल",
    "startsIn": "शुरू होगा",
    "endsIn": "समाप्त होगा",
    "completed": "आज के लिए पूर्ण",
    "safePeriod": "शुभ समय",
    "rahuActive": "राहु काल सक्रिय",
    "rahuPassed": "राहु काल बीत गया",
    "sunrise": "सूर्योदय",
    "sunset": "सूर्यास्त",
    "infoTitle": "राहु काल क्या है?",
    "infoDesc": "राहु काल वैदिक ज्योतिष में नए कार्यों को शुरू करने के लिए अशुभ माना जाने वाला समय है। इसकी गणना स्थानीय सूर्योदय और सूर्यास्त के आधार पर प्रतिदिन की जाती है।",
    "upcomingTimings": "आगामी समय",
    "planAhead": "अपनी महत्वपूर्ण गतिविधियों की योजना पहले से बनाएं।",
    "date": "दिनांक",
    "time": "राहु काल समय",
    "duration": "अवधि",
    "today": "आज",
    "loadMore": "अगले 7 दिन लोड करें",
    "loading": "लोड हो रहा है...",
    "aboutGuide": "विस्तृत गाइड और गोपनीयता",
    "aboutSubtitle": "ज्योतिषीय महत्व और उपयोग निर्देश",
    "astroSig": "ज्योतिषीय महत्व",
    "astroDesc": "वैदिक ज्योतिष में, राहु एक छाया ग्रह (चंद्रमा का उत्तरी नोड) है जो भौतिकवाद, शरारत और ग्रहणों से जुड़ा है। राहु काल (राहु का समय) प्रतिदिन लगभग 90 मिनट की एक अवधि है जिसे नए, महत्वपूर्ण कार्यों को शुरू करने के लिए अशुभ माना जाता है। ऐसा माना जाता है कि इस समय के दौरान शुरू की गई गतिविधियों में बाधाओं का सामना करना पड़ सकता है। हालांकि, नियमित गतिविधियां (जैसे दैनिक कार्य) सामान्य रूप से जारी रखी जा सकती हैं।",
    "howToUse": "इस ट्रैकर का उपयोग कैसे करें",
    "useTip1": "स्थान महत्वपूर्ण है: राहु काल आपके देशांतर और अक्षांश के आधार पर सेकंड या मिनट में भिन्न होता है। हमेशा सुनिश्चित करें कि आपका स्थान सही ढंग से सेट है।",
    "useTip2": "आगे की योजना बनाएं: इन खिड़कियों के बाहर बैठकों या समारोहों को शेड्यूल करने के लिए \"आगामी 7 दिन\" तालिका का उपयोग करें।",
    "useTip3": "अलर्ट सेट करें: राहु काल शुरू होने से 15 मिनट (या अपना पसंदीदा समय) पहले रिमाइंडर प्राप्त करने के लिए नोटिफिकेशन सक्षम करें।",
    "privacy": "गोपनीयता और डेटा सुरक्षा",
    "privacyDesc": "हम आपकी गोपनीयता को प्राथमिकता देते हैं। हम आपके डेटा को कैसे संभालते हैं: स्थान डेटा आपके डिवाइस पर स्थानीय रूप से संसाधित किया जाता है। हम आपके निर्देशांक किसी भी सर्वर पर संग्रहीत नहीं करते हैं। प्राथमिकताएं आपके ब्राउज़र के स्थानीय संग्रहण में सहेजी जाती हैं।",
    "subscribeTitle": "दैनिक SMS अलर्ट प्राप्त करें",
    "subscribeDesc": "कोई समय न चूकें। हर सुबह सीधे अपने फोन पर अपने स्थान के लिए सटीक राहु काल का समय प्राप्त करें।",
    "fullName": "पूरा नाम",
    "phoneNumber": "फ़ोन नंबर",
    "registeringFor": "पंजीकरण:",
    "subscribeBtn": "अभी सदस्यता लें",
    "subscribing": "सदस्यता ले रहे हैं...",
    "successTitle": "आपकी सदस्यता सक्रिय है!",
    "successDesc": "हम दैनिक राहु काल अलर्ट भेजेंगे",
    "registerAnother": "दूसरा नंबर रजिस्टर करें",
    "footerText": "ऑफ़लाइन पहुंच और गति के लिए समय स्थानीय रूप से कैश किया जाता है।",
    "errorSolar": "सौर डेटा लोड करने में विफल। कृपया अपना कनेक्शन जांचें या कोई अलग स्थान आज़माएं।",
    "langToggle": "English",
    "min": "मिनट"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
