import React, { useEffect, useState } from 'react';
import { getRahuKaal } from '../services/api';
import { DailyData, Coordinates } from '../types';
import { Loader2, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

import { Link } from 'react-router-dom';

const POPULAR_CITIES = [
  { label: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { label: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { label: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { label: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { label: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { label: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { label: 'Pune', lat: 18.5204, lng: 73.8567 },
  { label: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { label: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
];

interface Props {
  onCitySelect: (coords: Coordinates) => void;
}

export const PopularCities: React.FC<Props> = ({ onCitySelect }) => {
  const { t } = useLanguage();
  const [cityData, setCityData] = useState<Record<string, DailyData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTimings = async () => {
      setLoading(true);
      const today = new Date();
      const results: Record<string, DailyData> = {};
      
      try {
        await Promise.all(
          POPULAR_CITIES.map(async (city) => {
            const data = await getRahuKaal({ lat: city.lat, lng: city.lng, label: city.label }, today);
            results[city.label] = data;
          })
        );
        if (isMounted) {
          setCityData(results);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch popular cities timings:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchTimings();
    return () => { isMounted = false; };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-500" />
          {t('popularCities') || 'Popular Cities Today'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('popularCitiesDesc') || 'Quickly check Rahu Kaal timings for major cities or select one to set as your location.'}
        </p>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_CITIES.map((city) => {
              const data = cityData[city.label];
              return (
                <Link
                  key={city.label}
                  to={`/rahu-kaal-today-${city.label.toLowerCase()}`}
                  onClick={() => onCitySelect(city)}
                  className="flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all text-left group"
                >
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {city.label}
                  </span>
                  {data ? (
                    <span className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {formatTime(data.rahu.start)} - {formatTime(data.rahu.end)}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400 mt-1">Unavailable</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
