import React, { useEffect, useState } from 'react';
import { RahuTime, DailyData } from '../types';
import { AlertTriangle, Moon, Sun, Clock, CheckCircle } from 'lucide-react';

interface Props {
  data: DailyData;
}

export const CurrentRahu: React.FC<Props> = ({ data }) => {
  const getStatus = (d: DailyData) => {
    const now = new Date();
    if (now < d.rahu.start) return 'UPCOMING';
    if (now >= d.rahu.start && now <= d.rahu.end) return 'ACTIVE';
    return 'PASSED';
  };

  const [status, setStatus] = useState<'UPCOMING' | 'ACTIVE' | 'PASSED'>(() => getStatus(data));
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const currentStatus = getStatus(data);
      setStatus(currentStatus);
      
      const start = data.rahu.start;
      const end = data.rahu.end;

      if (currentStatus === 'UPCOMING') {
        const diff = start.getTime() - now.getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`Starts in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`);
      } else if (currentStatus === 'ACTIVE') {
        const diff = end.getTime() - now.getTime();
        const mins = Math.floor(diff / (1000 * 60));
        setTimeLeft(`Ends in ${mins}m`);
      } else {
        setTimeLeft('Completed for today');
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [data]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const isActive = status === 'ACTIVE';

  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 ${
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
             <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-4 py-1 rounded-full text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-600">
               <CheckCircle className="w-4 h-4" />
               Rahu Kaal Passed
             </div>
          )}
        </div>

        <h2 className="text-lg font-medium opacity-80 mb-1">Today's Rahu Kaal</h2>
        <div className="text-4xl md:text-6xl font-black tracking-tight mb-2 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <span>{formatTime(data.rahu.start)}</span>
          <span className="text-xl md:text-3xl font-light opacity-60">–</span>
          <span>{formatTime(data.rahu.end)}</span>
        </div>
        
        <div className="flex items-center gap-2 mt-2 text-sm md:text-base font-medium opacity-90">
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