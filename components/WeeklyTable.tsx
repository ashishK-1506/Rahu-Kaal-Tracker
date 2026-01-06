import React from 'react';
import { DailyData } from '../types';

interface Props {
  forecast: DailyData[];
}

export const WeeklyTable: React.FC<Props> = ({ forecast }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isLoading = forecast.length === 0;

  return (
    <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming 7 Days</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Plan your important activities ahead.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Rahu Kaal Time</th>
              <th className="px-6 py-4 hidden sm:table-cell whitespace-nowrap">Duration</th>
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
                const isToday = idx === 0;
                const duration = Math.round((day.rahu.end.getTime() - day.rahu.start.getTime()) / 60000);
                
                return (
                  <tr key={day.date.toISOString()} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`block font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {isToday ? 'Today' : formatDate(day.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                      {formatTime(day.rahu.start)} - {formatTime(day.rahu.end)}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {duration} min
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};