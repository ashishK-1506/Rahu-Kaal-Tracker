import React from 'react';
import { DailyData } from '../types';
import { Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  forecast: DailyData[];
  selectedDate?: Date;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export const WeeklyTable: React.FC<Props> = ({ 
  forecast, 
  selectedDate,
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
              <th scope="col" className="px-6 py-4 whitespace-nowrap">{t('date')}</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap text-red-600 dark:text-red-400">{t('rahuKaal')}</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap text-orange-600 dark:text-orange-400">{t('yamagandam')}</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap text-yellow-600 dark:text-yellow-400">{t('gulika')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
               // Skeleton Loader
               Array.from({ length: 7 }).map((_, i) => (
                 <tr key={i} className="animate-pulse">
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                 </tr>
               ))
            ) : (
              forecast.map((day, idx) => {
                const isToday = day.date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
                
                return (
                  <tr key={day.date.toISOString()} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${isSelected ? 'bg-indigo-50/80 dark:bg-indigo-900/20' : (isToday ? 'bg-slate-50/50 dark:bg-slate-800/50' : '')}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`block font-medium ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : (isToday ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200')}`}>
                        {isToday ? `${t('today')} (${formatDate(day.date)})` : formatDate(day.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                      {formatTime(day.rahu.start)} - {formatTime(day.rahu.end)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                      {day.yamagandam ? `${formatTime(day.yamagandam.start)} - ${formatTime(day.yamagandam.end)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                      {day.gulika ? `${formatTime(day.gulika.start)} - ${formatTime(day.gulika.end)}` : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Load More Button Area */}
      {!isLoading && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore || !hasMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasMore ? (
              <ChevronDown className="w-4 h-4" />
            ) : null}
            {isLoadingMore 
              ? t('loading') 
              : !hasMore 
                ? (language === 'hi' ? 'सभी उपलब्ध डेटा लोड हो गया' : 'All available data loaded')
                : (() => {
                    if (!forecast || forecast.length === 0) return t('loadMore');
                    const lastDate = forecast[forecast.length - 1].date;
                    const nextStart = new Date(lastDate);
                    nextStart.setDate(nextStart.getDate() + 1);
                    const nextEnd = new Date(nextStart);
                    nextEnd.setDate(nextEnd.getDate() + 6);
                    const formatShortDate = (date: Date) => new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric' }).format(date);
                    const dateStr = `${formatShortDate(nextStart)} – ${formatShortDate(nextEnd)}`;
                    return language === 'hi' ? `${dateStr} लोड करें` : `Load ${dateStr}`;
                  })()
            }
          </button>
        </div>
      )}
    </div>
  );
};