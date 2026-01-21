import React, { useState, useEffect } from 'react';
import { getRahuKaal, getForecastBatch, getCityName } from './services/api';
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
      }
    }));
  } catch (e) {
    return [];
  }
};

function App() {
  const [coords, setCoords] = useState<Coordinates>(() => {
    const saved = localStorage.getItem('user_coords');
    return saved ? JSON.parse(saved) : { lat: 28.6139, lng: 77.2090, label: 'New Delhi (Default)' };
  });

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

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

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
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayStr = new Date().toDateString();
      
      // 1. Check Cache First
      const cachedJson = localStorage.getItem(cacheKey);
      if (cachedJson) {
        const cachedData = deserializeData(cachedJson);
        // Filter out past dates (keep today and future)
        const validForecast = cachedData.filter(d => d.date >= todayStart);

        // If we have "Today" in the cache, load it immediately!
        const hasToday = validForecast.some(d => d.date.toDateString() === todayStr);
        if (hasToday && isMounted) {
          const todayData = validForecast.find(d => d.date.toDateString() === todayStr)!;
          setDailyData(todayData);
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
        if (!dailyData) setDailyData(null); 
      }

      try {
        const today = await getRahuKaal(coords);
        if (isMounted) {
          setDailyData(today);
          setLoading(LoadingState.SUCCESS);
        }

        const week = await getForecastBatch(coords, new Date(), 7);
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
  }, [coords]);

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
      scheduleNotification(dailyData.rahu, alertOffset);
    }
  }, [dailyData, notifPermission, alertOffset]);

  const handleLocationChange = (newCoords: Coordinates) => {
    setCoords(newCoords);
    localStorage.setItem('user_coords', JSON.stringify(newCoords));
  };

  const enableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === 'granted' && dailyData) {
      scheduleNotification(dailyData.rahu, alertOffset);
      sendTestNotification();
    }
  };

  const isLoading = loading === LoadingState.LOADING && !dailyData;
  const hasMore = forecast.length < MAX_DAYS && forecast.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <header role="banner" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Rahu Kaal Tracker
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Vedic Astrology Timing Guide</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
             {notifPermission === 'granted' ? (
                 <div className="flex items-center gap-2 pl-4 pr-2 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium transition-colors border border-green-200 dark:border-green-900">
                    <BellRing className="w-4 h-4" />
                    <select value={alertOffset} onChange={handleOffsetChange} className="bg-transparent border-none outline-none font-bold cursor-pointer text-green-800 dark:text-green-200">
                      <option value="0">At Start</option>
                      <option value="5">5m before</option>
                      <option value="10">10m before</option>
                      <option value="15">15m before</option>
                      <option value="30">30m before</option>
                      <option value="60">1h before</option>
                    </select>
                 </div>
             ) : (
                <button onClick={enableNotifications} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium shadow-lg transition-all">
                  <Bell className="w-4 h-4" />
                  <span>Enable Daily Alerts</span>
                </button>
             )}
          </div>
        </header>

        <LocationControl currentCoords={coords} onLocationChange={handleLocationChange} />

        {loading === LoadingState.ERROR && !dailyData ? (
           <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-2xl text-center">
              Failed to load solar data. Please check your connection.
           </div>
        ) : (
          <main role="main" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CurrentRahu data={dailyData} isLoading={isLoading} />
            <AdContainer slotId="YOUR_SLOT_ID_1" />
            <div className="bg-indigo-50 dark:bg-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-slate-800 flex gap-4">
              <Info className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                <h2 className="font-bold text-slate-900 dark:text-white text-base">What is Rahu Kaal?</h2>
                <p><strong>Rahu Kaal</strong> is a period considered inauspicious in Vedic Astrology for starting new ventures. It is calculated daily based on local sunrise and sunset.</p>
              </div>
            </div>
            <WeeklyTable forecast={forecast} onLoadMore={handleLoadMore} isLoadingMore={loadingMore} hasMore={hasMore} />
            <SubscriptionForm currentCoords={coords} />
            <AdContainer slotId="YOUR_SLOT_ID_2" />
            <AboutSection />
          </main>
        )}
        
        <footer role="contentinfo" className="text-center text-slate-400 text-sm py-8">
           <p>© {new Date().getFullYear()} Rahu Kaal Tracker.</p>
           <p className="text-xs mt-1">Timings are cached locally for offline access and speed.</p>
        </footer>
      </div>
      <Analytics />
    </div>
  );
}

export default App;