import React, { useState, useEffect } from 'react';
import { getRahuKaal, getForecastBatch, getCityName } from './services/api';
import { Coordinates, DailyData, LoadingState } from './types';
import { CurrentRahu } from './components/CurrentRahu';
import { SolarInfo } from './components/SolarInfo';
import { WeeklyTable } from './components/WeeklyTable';
import { LocationControl } from './components/LocationControl';
import { PopularCities } from './components/PopularCities';
import { AboutSection } from './components/AboutSection';
import { AdContainer } from './components/AdContainer';
import { SubscriptionForm } from './components/SubscriptionForm';
import { requestNotificationPermission, scheduleNotification, sendTestNotification } from './services/notificationService';
import { DateSelector } from './components/DateSelector';
import { Bell, BellRing, Info, Loader2, Sun, Moon, Languages, ArrowUp, X } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLanguage } from './contexts/LanguageContext';
import { WhatIsRahuKaal } from './pages/WhatIsRahuKaal';
import { Remedies } from './pages/Remedies';
import { DoAndDont } from './pages/DoAndDont';
import { RahuKaalChart } from './pages/RahuKaalChart';

// Helper to handle Date serialization in localStorage
const serializeData = (data: DailyData[]) => JSON.stringify(data);
const deserializeData = (json: string): DailyData[] => {
  try {
    const parsed = JSON.parse(json);
    return parsed.map((item: any) => ({
      ...item,
      date: new Date(item.date),
      sunrise: new Date(item.sunrise),
      sunset: new Date(item.sunset),
      rahu: {
        ...item.rahu,
        start: new Date(item.rahu.start),
        end: new Date(item.rahu.end),
        date: new Date(item.rahu.date),
      },
      yamagandam: item.yamagandam ? {
        ...item.yamagandam,
        start: new Date(item.yamagandam.start),
        end: new Date(item.yamagandam.end),
        date: new Date(item.yamagandam.date),
      } : undefined,
      gulika: item.gulika ? {
        ...item.gulika,
        start: new Date(item.gulika.start),
        end: new Date(item.gulika.end),
        date: new Date(item.gulika.date),
      } : undefined,
    }));
  } catch (e) {
    return [];
  }
};

function App() {
  const { t, language, setLanguage } = useLanguage();
  
  const [coords, setCoords] = useState<Coordinates>(() => {
    const saved = localStorage.getItem('user_coords');
    return saved ? JSON.parse(saved) : { lat: 28.6139, lng: 77.2090, label: 'New Delhi (Default)' };
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [forecast, setForecast] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [loadingMore, setLoadingMore] = useState(false);
  const MAX_DAYS = 28;

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'default'
  );

  const [alertOffset, setAlertOffset] = useState<number>(() => {
    const saved = localStorage.getItem('alert_offset');
    return saved ? parseInt(saved, 10) : 15;
  });

  const [notifyOnEnd, setNotifyOnEnd] = useState<boolean>(() => {
    const saved = localStorage.getItem('notify_on_end');
    return saved ? saved === 'true' : false;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleOffsetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10);
    setAlertOffset(val);
    localStorage.setItem('alert_offset', val.toString());
  };

  const handleNotifyOnEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setNotifyOnEnd(val);
    localStorage.setItem('notify_on_end', val.toString());
  };

  useEffect(() => {
    if (!localStorage.getItem('user_coords') && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let label = 'My Location';
          try { label = await getCityName(lat, lng); } catch(e) {}
          handleLocationChange({ lat, lng, label });
        },
        (err) => console.log('Auto-location denied', err)
      );
    }
  }, []);

  // Main Data Fetching & Caching Logic
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `rahu_forecast_${coords.lat.toFixed(3)}_${coords.lng.toFixed(3)}`;

    async function loadData() {
      const targetStart = new Date(selectedDate);
      targetStart.setHours(0, 0, 0, 0);
      const targetStr = selectedDate.toDateString();
      
      // 1. Check Cache First
      const cachedJson = localStorage.getItem(cacheKey);
      if (cachedJson) {
        const cachedData = deserializeData(cachedJson);
        // Filter out past dates relative to the selected date
        const validForecast = cachedData.filter(d => {
          const dStart = new Date(d.date);
          dStart.setHours(0, 0, 0, 0);
          return dStart.getTime() >= targetStart.getTime();
        });

        // If we have "Selected Date" in the cache, load it immediately!
        const hasTarget = validForecast.some(d => d.date.toDateString() === targetStr);
        if (hasTarget && validForecast.length >= 7 && isMounted) {
          const targetData = validForecast.find(d => d.date.toDateString() === targetStr)!;
          setDailyData(targetData);
          setForecast(validForecast);
          setLoading(LoadingState.SUCCESS);
          
          // If we have data, we can stop here. The cache is valid.
          return; 
        }
      }

      // 2. Fetch if Cache is missing or insufficient
      if (isMounted) {
        setLoading(LoadingState.LOADING);
        // Reset only if we didn't load from cache (to avoid flashing if partial data existed)
        if (!dailyData || dailyData.date.toDateString() !== targetStr) setDailyData(null); 
      }

      try {
        const targetDayData = await getRahuKaal(coords, selectedDate);
        if (isMounted) {
          setDailyData(targetDayData);
          setLoading(LoadingState.SUCCESS);
        }

        const week = await getForecastBatch(coords, selectedDate, 7);
        if (isMounted) {
          setForecast(week);
          localStorage.setItem(cacheKey, serializeData(week));
        }
      } catch (e) {
        if (isMounted && !dailyData) setLoading(LoadingState.ERROR);
      }
    }
    
    loadData();
    return () => { isMounted = false; };
  }, [coords, selectedDate]);

  const handleLoadMore = async () => {
    if (loadingMore || forecast.length >= MAX_DAYS) return;
    setLoadingMore(true);
    try {
      const lastItem = forecast[forecast.length - 1];
      const startDate = new Date(lastItem.date);
      startDate.setDate(startDate.getDate() + 1);
      
      const newBatch = await getForecastBatch(coords, startDate, 7);
      const updatedForecast = [...forecast, ...newBatch];
      
      setForecast(updatedForecast);
      
      // Update cache with the expanded forecast
      const cacheKey = `rahu_forecast_${coords.lat.toFixed(3)}_${coords.lng.toFixed(3)}`;
      localStorage.setItem(cacheKey, serializeData(updatedForecast));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (notifPermission === 'granted' && dailyData) {
      scheduleNotification(dailyData.rahu, alertOffset, notifyOnEnd);
    }
  }, [dailyData, notifPermission, alertOffset, notifyOnEnd]);

  const handleLocationChange = (newCoords: Coordinates) => {
    setCoords(newCoords);
    localStorage.setItem('user_coords', JSON.stringify(newCoords));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === 'granted' && dailyData) {
      scheduleNotification(dailyData.rahu, alertOffset, notifyOnEnd);
      sendTestNotification();
    }
  };

  const isLoading = loading === LoadingState.LOADING && !dailyData;
  const hasMore = forecast.length < MAX_DAYS && forecast.length > 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black dark:focus:bg-slate-900 dark:focus:text-white rounded-md">
        Skip to content
      </a>
      <div className="max-w-4xl mx-auto space-y-6">
        <header role="banner" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {t('appTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t('appSubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
               className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-1.5 px-3"
               aria-label="Toggle language"
             >
               <Languages className="w-4 h-4" />
               <span className="text-sm font-medium">{t('langToggle')}</span>
             </button>

             <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm" aria-label={t('themeToggle')}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
             {notifPermission === 'granted' ? (
                 <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                   <div className="flex items-center gap-2 pl-4 pr-2 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium transition-colors border border-green-200 dark:border-green-900">
                      <BellRing className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('alertLabel')}</span>
                      <select value={alertOffset} onChange={handleOffsetChange} className="bg-transparent border-none outline-none font-bold cursor-pointer text-green-800 dark:text-green-200">
                        <option value="0">{t('atStart')}</option>
                        <option value="5">5{t('minBefore')}</option>
                        <option value="10">10{t('minBefore')}</option>
                        <option value="15">15{t('minBefore')}</option>
                        <option value="30">30{t('minBefore')}</option>
                        <option value="60">1{t('hourBefore')}</option>
                      </select>
                   </div>
                   <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                     <input 
                       type="checkbox" 
                       checked={notifyOnEnd}
                       onChange={handleNotifyOnEndChange}
                       className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-transparent"
                     />
                     {t('notifyOnEnd')}
                   </label>
                 </div>
             ) : (
                <button onClick={enableNotifications} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium shadow-lg transition-all">
                  <Bell className="w-4 h-4" />
                  <span>{t('enableAlerts')}</span>
                </button>
             )}
          </div>
        </header>

        <nav aria-label="Location selector">
          <LocationControl currentCoords={coords} onLocationChange={handleLocationChange} />
        </nav>

        {showInstallBtn && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-white animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <img src="/rahu-coin.png" alt="App Icon" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Add Rahu Kaal Tracker to your Home Screen</h3>
                <p className="text-indigo-100 text-xs sm:text-sm">Get fast offline access and daily alerts.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={handleInstallClick}
                className="flex-1 sm:flex-none px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                {t('installApp')}
              </button>
              <button 
                onClick={() => setShowInstallBtn(false)}
                className="p-2 text-indigo-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <main id="main-content" role="main" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {currentView === 'home' && (
            <>
              <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
              
              {loading === LoadingState.ERROR && !dailyData ? (
                 <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-2xl text-center">
                    {t('errorSolar')}
                 </div>
              ) : (
                <>
                  <CurrentRahu data={dailyData} isLoading={isLoading} />
                  <SolarInfo data={dailyData} isLoading={isLoading} />
                  <AdContainer slotId="YOUR_SLOT_ID_1" />
                  <div className="bg-indigo-50 dark:bg-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-slate-800 flex gap-4">
                    <Info className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
                    <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2 w-full">
                      <h2 className="font-bold text-slate-900 dark:text-white text-base">{t('infoTitle')}</h2>
                      <div className={`relative ${!isInfoExpanded ? 'max-h-20 overflow-hidden' : ''}`}>
                        <p className="leading-relaxed">{t('infoDesc')}</p>
                        {!isInfoExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-indigo-50 dark:from-slate-900 to-transparent pointer-events-none" />
                        )}
                      </div>
                      <button 
                        onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline focus:outline-none text-sm mt-1"
                      >
                        {isInfoExpanded ? t('readLess') || 'Read less' : t('readMore') || 'Read more'}
                      </button>
                    </div>
                  </div>
                  <WeeklyTable forecast={forecast} selectedDate={selectedDate} onLoadMore={handleLoadMore} isLoadingMore={loadingMore} hasMore={hasMore} />
                  <PopularCities onCitySelect={handleLocationChange} />
                  <SubscriptionForm currentCoords={coords} />
                  <AdContainer slotId="YOUR_SLOT_ID_2" />
                  <AboutSection />
                </>
              )}
            </>
          )}
          {currentView === 'what-is-rahu-kaal' && <WhatIsRahuKaal onBack={() => setCurrentView('home')} />}
          {currentView === 'remedies' && <Remedies onBack={() => setCurrentView('home')} />}
          {currentView === 'do-and-dont' && <DoAndDont onBack={() => setCurrentView('home')} />}
          {currentView === 'rahu-kaal-chart' && <RahuKaalChart onBack={() => setCurrentView('home')} />}
        </main>
        
        <footer role="contentinfo" className="text-center text-slate-400 text-sm py-8">
           <div className="flex flex-wrap justify-center gap-4 mb-4">
             <button onClick={() => { setCurrentView('what-is-rahu-kaal'); window.scrollTo(0,0); }} className="hover:text-indigo-500 transition-colors">What is Rahu Kaal?</button>
             <button onClick={() => { setCurrentView('remedies'); window.scrollTo(0,0); }} className="hover:text-indigo-500 transition-colors">Remedies & Mantras</button>
             <button onClick={() => { setCurrentView('do-and-dont'); window.scrollTo(0,0); }} className="hover:text-indigo-500 transition-colors">Do's and Don'ts</button>
             <button onClick={() => { setCurrentView('rahu-kaal-chart'); window.scrollTo(0,0); }} className="hover:text-indigo-500 transition-colors">Standard Chart</button>
           </div>
           <p>© {new Date().getFullYear()} Rahu Kaal Tracker. All rights reserved.</p>
           <p className="text-xs mt-1">{t('footerText')}</p>
        </footer>
      </div>
      
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all z-50 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
