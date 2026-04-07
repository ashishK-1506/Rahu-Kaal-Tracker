import React from 'react';
import { DailyData } from '../types';
import { Sun, Sunrise, Sunset, Calculator } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  data?: DailyData | null;
  isLoading?: boolean;
}

export const SolarInfo: React.FC<Props> = ({ data, isLoading = false }) => {
  const { t, language } = useLanguage();

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
          <div className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
          <div className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  const daylightMs = data.sunset.getTime() - data.sunrise.getTime();
  const segmentMs = daylightMs / 8;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('solarInfo')}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
          <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg text-amber-600 dark:text-amber-400">
            <Sunrise className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t('sunrise')}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatTime(data.sunrise)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30">
          <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg text-orange-600 dark:text-orange-400">
            <Sunset className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t('sunset')}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatTime(data.sunset)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t('calculationBreakdown')}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {formatDuration(daylightMs)} {t('daylight').toLowerCase()} &divide; 8 = <span className="text-indigo-600 dark:text-indigo-400">{formatDuration(segmentMs)}</span> {t('segment')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
