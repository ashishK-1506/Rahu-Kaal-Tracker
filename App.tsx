import React, { useState, useEffect } from 'react';
import { getRahuKaal, getWeeklyForecast, getCityName } from './services/api';
import { Coordinates, DailyData, LoadingState } from './types';
import { CurrentRahu } from './components/CurrentRahu';
import { WeeklyTable } from './components/WeeklyTable';
import { LocationControl } from './components/LocationControl';
import { requestNotificationPermission, scheduleNotification, sendTestNotification } from './services/notificationService';
import { Bell, BellRing, Info, Loader2, Sun, Moon } from 'lucide-react';

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

  useEffect(() => {
    async function loadData() {
      setLoading(LoadingState.LOADING);
      try {
        const today = await getRahuKaal(coords);
        const week = await getWeeklyForecast(coords);
        
        setDailyData(today);
        setForecast(week);
        setLoading(LoadingState.SUCCESS);

        // Re-schedule notifications if data updates
        if (notifPermission === 'granted') {
          scheduleNotification(today.rahu);
        }

      } catch (e) {
        console.error(e);
        setLoading(LoadingState.ERROR);
      }
    }
    loadData();
  }, [coords, notifPermission]);

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
      scheduleNotification(dailyData.rahu);
      sendTestNotification();
    } else if (perm === 'denied') {
      // If denied, the browser usually won't explicitly prompt again. We must instruct the user.
      alert(
        "Notifications are currently blocked by your browser.\n\n" +
        "To enable them:\n" +
        "1. Click the 'Lock' icon or 'Settings' icon in the address bar.\n" +
        "2. Find 'Notifications' and change it to 'Allow' or click 'Reset Permission'.\n" +
        "3. Reload the page."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
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
                 <button className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium cursor-default">
                    <BellRing className="w-4 h-4" />
                    <span>Alerts Active</span>
                 </button>
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

        {loading === LoadingState.LOADING && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Calculating planetary positions...</p>
          </div>
        )}

        {loading === LoadingState.ERROR && (
           <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-2xl text-center">
              Failed to load solar data. Please check your connection or try a different location.
           </div>
        )}

        {loading === LoadingState.SUCCESS && dailyData && (
          <main className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CurrentRahu data={dailyData} />
            
            {/* Info Section */}
            <div className="bg-indigo-50 dark:bg-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-slate-800 flex gap-4">
              <Info className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Why track Rahu Kaal?</h4>
                <p>
                  In Vedic astrology, Rahu Kaal is considered an inauspicious period lasting about 90 minutes daily. 
                  It is believed to be unfavorable for starting new ventures, buying assets, or important travel. 
                  However, routine tasks can continue as normal.
                </p>
                <p className="text-xs opacity-70 pt-2">
                  *Calculation based on your local sunrise/sunset times using the 1/8th day segment method.
                </p>
              </div>
            </div>

            <WeeklyTable forecast={forecast} />
          </main>
        )}
        
        <footer className="text-center text-slate-400 text-sm py-8">
           <p>© {new Date().getFullYear()} Rahu Kaal Tracker.</p>
           <p className="text-xs mt-1">Timings are approximate and calculated based on solar data.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;