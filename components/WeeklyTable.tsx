import React from 'react';
import { DailyData } from '../types';
import { Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  forecast: DailyData[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export const WeeklyTable: React.FC<Props> = ({ 
  forecast, 
  onLoadMore, 
  isLoadingMore = false, 
  hasMore = false 
}) => {
  const { t, language } = useLanguage();

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isLoading = forecast.length === 0;

  return (
    <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('upcomingTimings')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('planAhead')}</p>
        </div>
        <Calendar className="w-5 h-5 text-indigo-500 opacity-50" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">{t('date')}</th>
              <th className="px-6 py-4 whitespace-nowrap">{t('time')}</th>
              <th className="px-6 py-4 hidden sm:table-cell whitespace-nowrap">{t('duration')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
               // Skeleton Loader
               Array.from({ length: 7 }).map((_, i) => (
                 <tr key={i} className="animate-pulse">
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div></td>
                   <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div></td>
                 </tr>
               ))
            ) : (
              forecast.map((day, idx) => {
                const isToday = day.date.toDateString() === new Date().toDateString();
                const duration = Math.round((day.rahu.end.getTime() - day.rahu.start.getTime()) / 60000);
                
                return (
                  <tr key={day.date.toISOString()} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`block font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {isToday ? t('today') : formatDate(day.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                      {formatTime(day.rahu.start)} - {formatTime(day.rahu.end)}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {duration} {t('min')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Load More Button Area */}
      {hasMore && !isLoading && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {isLoadingMore ? t('loading') : t('loadMore')}
          </button>
        </div>
      )}
    </div>
  );
};