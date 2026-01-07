import React, { useEffect, useState } from 'react';
import { DailyData } from '../types';
import { AlertTriangle, Moon, Sun, Clock, CheckCircle } from 'lucide-react';

interface Props {
  data?: DailyData | null;
  isLoading?: boolean;
}

export const CurrentRahu: React.FC<Props> = ({ data, isLoading = false }) => {
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

  const isActive = status === 'ACTIVE';
  
  // Define base classes
  const containerClasses = `relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 transform translate-z-0 min-h-[400px] flex flex-col justify-center ${
    !isLoading && isActive 
      ? 'bg-gradient-to-br from-rose-900 via-red-900 to-orange-900 text-white border-2 border-red-500/50' 
      : 'bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'
  }`;

  return (
    <div className={containerClasses}>
      {/* Background Decor - Always present to avoid shift */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-colors duration-500 ${
         !isLoading && isActive ? 'bg-orange-500/20' : 'bg-purple-500/20 opacity-50'
      }`}></div>
      
      <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t pointer-events-none transition-colors duration-500 ${
         !isLoading && isActive ? 'from-black/30 to-transparent' : 'from-black/5 to-transparent'
      }`}></div>

      <div className="relative z-10 flex flex-col items-center text-center w-full">
        
        {/* Status Badge Container - Fixed height */}
        <div className="h-8 mb-4 flex items-center justify-center w-full">
          {isLoading ? (
             <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Title */}
        {isLoading ? (
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
        ) : (
          <h2 className="text-lg font-medium opacity-80 mb-1">Today's Rahu Kaal</h2>
        )}
        
        {/* Main Time Display - Fixed Min Height for font stability */}
        <div className="min-h-[60px] flex items-center justify-center mb-2">
           {isLoading ? (
              <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
           ) : data ? (
              <div className="text-4xl md:text-6xl font-black tracking-tight flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                <span>{formatTime(data.rahu.start)}</span>
                <span className="text-xl md:text-3xl font-light opacity-60">–</span>
                <span>{formatTime(data.rahu.end)}</span>
              </div>
           ) : null}
        </div>
        
        {/* Time Left - Fixed height */}
        <div className="flex items-center justify-center h-6 mt-2 mb-8 w-full">
           {isLoading ? (
             <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
           ) : (
             <div className="flex items-center gap-2 text-sm md:text-base font-medium opacity-90">
                <Clock className="w-4 h-4" />
                <span>{timeLeft}</span>
             </div>
           )}
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {isLoading || !data ? (
             <>
               <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-700/50 animate-pulse"></div>
               <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-700/50 animate-pulse"></div>
             </>
          ) : (
             <>
               <div className={`flex flex-col items-center p-3 rounded-xl transition-colors ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                 <Sun className={`w-5 h-5 mb-1 ${isActive ? 'text-amber-500' : 'text-amber-500'}`} />
                 <span className={`text-xs ${isActive ? 'text-slate-500' : 'opacity-60'}`}>Sunrise</span>
                 <span className="font-semibold">{formatTime(data.sunrise)}</span>
               </div>
               <div className={`flex flex-col items-center p-3 rounded-xl transition-colors ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                 <Moon className={`w-5 h-5 mb-1 ${isActive ? 'text-indigo-600' : 'text-indigo-400'}`} />
                 <span className={`text-xs ${isActive ? 'text-slate-500' : 'opacity-60'}`}>Sunset</span>
                 <span className="font-semibold">{formatTime(data.sunset)}</span>
               </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
};