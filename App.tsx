import React, { useState, useEffect } from 'react';
import { getRahuKaal, getWeeklyForecast, getCityName } from './services/api';
import { Coordinates, DailyData, LoadingState } from './types';
import { CurrentRahu } from './components/CurrentRahu';
import { WeeklyTable } from './components/WeeklyTable';
import { LocationControl } from './components/LocationControl';
import { AboutSection } from './components/AboutSection';
import { AdContainer } from './components/AdContainer';
import { SubscriptionForm } from './components/SubscriptionForm';
import { requestNotificationPermission, scheduleNotification, sendTestNotification } from './services/notificationService';
import { Bell, BellRing, Info, Loader2, Sun, Moon } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  // Default to New Delhi coordinates initially
  const [coords, setCoords] = useState<Coordinates>(() => {
    const saved = localStorage.getItem('user_coords');
    return saved ? JSON.parse(saved) : { lat: 28.6139, lng: 77.2090, label: 'New Delhi (Default)' };
  });

  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [forecast, setForecast] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'default'
  );

  // Notification Preference (Defaults to 15 minutes)
  const [alertOffset, setAlertOffset] = useState<number>(() => {
    const saved = localStorage.getItem('alert_offset');
    return saved ? parseInt(saved, 10) : 15;
  });

  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10);
    setAlertOffset(val);
    localStorage.setItem('alert_offset', val.toString());
  };

  useEffect(() => {
    // Attempt auto-location on first load if not explicitly set by user previously
    if (!localStorage.getItem('user_coords') && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let label = 'My Location';
          try {
             label = await getCityName(lat, lng);
          } catch(e) {
             console.error("Failed to auto-fetch city name", e);
          }
          
          handleLocationChange({
            lat,
            lng,
            label,
          });
        },
        (err) => console.log('Auto-location denied/failed', err)
      );
    }
  }, []);

  // 1. Data Fetching Effect (Optimized for Perceived Performance)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // Clear forecast when location changes to show skeleton state
      setForecast([]);
      setLoading(LoadingState.LOADING);
      setDailyData(null); // Reset daily data to trigger skeleton
      
      try {
        // Step 1: Fetch TODAY's data first (High Priority)
        const today = await getRahuKaal(coords);
        
        if (isMounted) {
          setDailyData(today);
          setLoading(LoadingState.SUCCESS); // Render UI immediately
        }

        // Step 2: Fetch WEEKLY data in background (Low Priority)
        try {
          const week = await getWeeklyForecast(coords);
          if (isMounted) {
            setForecast(week);
          }
        } catch (weekError) {
          console.warn('Weekly forecast fetch failed:', weekError);
          // We don't fail the whole UI if just the forecast fails, as we have today's data
        }

      } catch (e) {
        console.error(e);
        if (isMounted) {
          setLoading(LoadingState.ERROR);
        }
      }
    }
    
    loadData();

    return () => { isMounted = false; };
  }, [coords]);

  // 2. Notification Scheduling Effect
  useEffect(() => {
    if (notifPermission === 'granted' && dailyData) {
      scheduleNotification(dailyData.rahu, alertOffset);
    }
  }, [dailyData, notifPermission, alertOffset]);

  const handleLocationChange = (newCoords: Coordinates) => {
    setCoords(newCoords);
    localStorage.setItem('user_coords', JSON.stringify(newCoords));
  };

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      alert("Push notifications are not supported on this device/browser.");
      return;
    }

    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    
    if (perm === 'granted' && dailyData) {
      scheduleNotification(dailyData.rahu, alertOffset);
      sendTestNotification();
    } else if (perm === 'denied') {
      alert(
        "Notifications are currently blocked by your browser.\n\n" +
        "To enable them:\n" +
        "1. Click the 'Lock' icon or 'Settings' icon in the address bar.\n" +
        "2. Find 'Notifications' and change it to 'Allow' or click 'Reset Permission'.\n" +
        "3. Reload the page."
      );
    }
  };

  // Derived state for display
  const isLoading = loading === LoadingState.LOADING || !dailyData;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header role="banner" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Rahu Kaal Tracker
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Vedic Astrology Timing Guide
            </p>
          </div>

          <div className="flex items-center gap-3">
             {/* Theme Toggle */}
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

             {notifPermission === 'granted' ? (
                 <div className="flex items-center gap-2 pl-4 pr-2 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium transition-colors border border-green-200 dark:border-green-900">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4" />
                      <span className="hidden sm:inline">Alert:</span>
                    </div>
                    <select 
                      value={alertOffset}
                      onChange={handleOffsetChange}
                      className="bg-transparent border-none outline-none font-bold cursor-pointer text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100 py-0.5 rounded focus:ring-2 focus:ring-green-500/50"
                      aria-label="Set alert time"
                    >
                      <option value="0" className="text-slate-900">At Start</option>
                      <option value="5" className="text-slate-900">5m before</option>
                      <option value="10" className="text-slate-900">10m before</option>
                      <option value="15" className="text-slate-900">15m before</option>
                      <option value="30" className="text-slate-900">30m before</option>
                      <option value="60" className="text-slate-900">1h before</option>
                    </select>
                 </div>
             ) : (
                <button 
                  onClick={enableNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <Bell className="w-4 h-4" />
                  <span>Enable Daily Alerts</span>
                </button>
             )}
          </div>
        </header>

        <LocationControl currentCoords={coords} onLocationChange={handleLocationChange} />

        {loading === LoadingState.ERROR ? (
           <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-2xl text-center">
              Failed to load solar data. Please check your connection or try a different location.
           </div>
        ) : (
          <main role="main" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 
                We always render CurrentRahu now. 
                If isLoading is true, CurrentRahu renders its internal skeleton.
            */}
            <CurrentRahu data={dailyData} isLoading={isLoading} />
            
            {/* Ad Unit 1 - Main Display */}
            <AdContainer slotId="YOUR_SLOT_ID_1" />
            
            {/* Info Section - Optimized for SEO */}
            <div className="bg-indigo-50 dark:bg-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-slate-800 flex gap-4">
              <Info className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                <h2 className="font-bold text-slate-900 dark:text-white text-base">What is Rahu Kaal?</h2>
                <p>
                  <strong>Rahu Kaal</strong> (or <em>Rahu Kalam</em>) is a specific period of time each day considered inauspicious in <strong>Vedic Astrology</strong>. 
                  Lasting approximately 90 minutes, this segment of the day varies based on sunrise and sunset times at your location.
                </p>
                <p>
                  Astrologers generally recommend avoiding new ventures, auspicious ceremonies (<em>Muhurat</em>), or important travel during this time. 
                  Use this <strong>daily tracker</strong> to calculate precise Rahu Kaal timings for your city and plan your day effectively.
                </p>
              </div>
            </div>

            <WeeklyTable forecast={forecast} />
            
            {/* SMS Subscription Form */}
            <SubscriptionForm currentCoords={coords} />
            
            {/* Ad Unit 2 - Secondary Display */}
            <AdContainer slotId="YOUR_SLOT_ID_2" />
            
            <AboutSection />
          </main>
        )}
        
        <footer role="contentinfo" className="text-center text-slate-400 text-sm py-8">
           <p>© {new Date().getFullYear()} Rahu Kaal Tracker.</p>
           <p className="text-xs mt-1">Timings are approximate and calculated based on solar data.</p>
        </footer>
      </div>
      <Analytics />
    </div>
  );
}

export default App;