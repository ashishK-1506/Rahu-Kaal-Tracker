import React, { useEffect, useState } from 'react';
import { DailyData } from '../types';
import { AlertTriangle, Moon, Sun, Clock, CheckCircle } from 'lucide-react';

interface Props {
  data?: DailyData | null; // Data is now optional
  isLoading?: boolean;     // New loading prop
}

export const CurrentRahu: React.FC<Props> = ({ data, isLoading = false }) => {
  // Helper functions defined inside component scope or extracted
  const getStatus = (d: DailyData) => {
    const now = new Date();
    if (now < d.rahu.start) return 'UPCOMING';
    if (now >= d.rahu.start && now <= d.rahu.end) return 'ACTIVE';
    return 'PASSED';
  };

  const getTimeLeftString = (currentStatus: string, d: DailyData) => {
    const now = new Date();
    if (currentStatus === 'UPCOMING') {
      const diff = d.rahu.start.getTime() - now.getTime();
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Starts in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
    } else if (currentStatus === 'ACTIVE') {
      const diff = d.rahu.end.getTime() - now.getTime();
      const mins = Math.floor(diff / (1000 * 60));
      return `Ends in ${mins}m`;
    } else {
      return 'Completed for today';
    }
  };

  // Safe initialization
  const [status, setStatus] = useState<'UPCOMING' | 'ACTIVE' | 'PASSED'>('UPCOMING');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!data || isLoading) return;

    const update = () => {
      const newStatus = getStatus(data);
      setStatus(newStatus);
      setTimeLeft(getTimeLeftString(newStatus, data));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [data, isLoading]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  // SKELETON RENDER (For LCP Optimization)
  if (isLoading || !data) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[300px]">
        {/* Background Decor Placeholder */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-200 dark:bg-slate-700 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center animate-pulse">
          {/* Status Badge Skeleton */}
          <div className="h-8 mb-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>

          {/* Title Skeleton */}
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
          
          {/* Main Time Skeleton */}
          <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
          
          {/* Time Left Skeleton */}
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 h-20 justify-center gap-2">
               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></div>
               <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-600"></div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 h-20 justify-center gap-2">
               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></div>
               <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isActive = status === 'ACTIVE';

  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 transform translate-z-0 ${
      isActive 
        ? 'bg-gradient-to-br from-rose-900 via-red-900 to-orange-900 text-white border-2 border-red-500/50' 
        : 'bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'
    }`}>
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Status Badge Container - Fixed height to prevent CLS */}
        <div className="h-8 mb-4 flex items-center justify-center">
          {status === 'ACTIVE' && (
            <div className="animate-pulse flex items-center gap-2 bg-red-500/20 px-4 py-1 rounded-full text-red-200 text-sm font-bold uppercase tracking-wider border border-red-500/30">
              <AlertTriangle className="w-4 h-4" />
              Rahu Kaal Active
            </div>
          )}

          {status === 'UPCOMING' && (
            <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-1 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-bold uppercase tracking-wider border border-emerald-500/30">
               Safe Period
            </div>
          )}

          {status === 'PASSED' && (
             <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-1 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-bold uppercase tracking-wider border border-emerald-500/30">
               <CheckCircle className="w-4 h-4" />
               Rahu Kaal Passed
             </div>
          )}
        </div>

        <h2 className="text-lg font-medium opacity-80 mb-1">Today's Rahu Kaal</h2>
        
        {/* Main Time Display */}
        <div className="text-4xl md:text-6xl font-black tracking-tight mb-2 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <span>{formatTime(data.rahu.start)}</span>
          <span className="text-xl md:text-3xl font-light opacity-60">–</span>
          <span>{formatTime(data.rahu.end)}</span>
        </div>
        
        {/* Time Left - Fixed height container for stability */}
        <div className="flex items-center gap-2 mt-2 text-sm md:text-base font-medium opacity-90 h-6">
          <Clock className="w-4 h-4" />
          <span>{timeLeft}</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50">
            <Sun className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-xs opacity-60">Sunrise</span>
            <span className="font-semibold">{formatTime(data.sunrise)}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50">
            <Moon className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-xs opacity-60">Sunset</span>
            <span className="font-semibold">{formatTime(data.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};