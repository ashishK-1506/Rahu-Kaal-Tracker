import React, { useEffect, useState } from 'react';
import { DailyData, RahuTime } from '../types';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  data?: DailyData | null;
  isLoading?: boolean;
}

const TimingCard = ({ 
  title, 
  time, 
  isLoading, 
  colorClass, 
  bgClass, 
  activeBgClass, 
  language,
  t
}: { 
  title: string, 
  time?: RahuTime, 
  isLoading: boolean, 
  colorClass: string,
  bgClass: string,
  activeBgClass: string,
  language: string,
  t: (key: string) => string
}) => {
  const [status, setStatus] = useState<'UPCOMING' | 'ACTIVE' | 'PASSED'>('UPCOMING');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!time || isLoading) return;
    const update = () => {
      const now = new Date();
      let newStatus: 'UPCOMING' | 'ACTIVE' | 'PASSED' = 'UPCOMING';
      if (now < time.start) newStatus = 'UPCOMING';
      else if (now >= time.start && now <= time.end) newStatus = 'ACTIVE';
      else newStatus = 'PASSED';

      setStatus(newStatus);

      if (newStatus === 'UPCOMING') {
        const diff = time.start.getTime() - now.getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${t('startsIn')} ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`);
      } else if (newStatus === 'ACTIVE') {
        const diff = time.end.getTime() - now.getTime();
        const mins = Math.floor(diff / (1000 * 60));
        setTimeLeft(`${t('endsIn')} ${mins}m`);
      } else {
        setTimeLeft(t('completed'));
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [time, isLoading, language, t]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const isActive = status === 'ACTIVE';

  const containerClasses = `relative overflow-hidden rounded-3xl p-6 shadow-lg transition-all duration-500 flex flex-col justify-center border ${
    !isLoading && isActive 
      ? `${activeBgClass} text-white border-transparent` 
      : `bg-white dark:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700`
  }`;

  return (
    <div className={containerClasses}>
      <div className="relative z-10 flex flex-col items-center text-center w-full">
        <div className="h-6 mb-3 flex items-center justify-center w-full">
          {isLoading ? (
             <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          ) : (
            <>
              {status === 'ACTIVE' && (
                <div className="animate-pulse flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-white text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3" />
                  {t('active')}
                </div>
              )}
              {status === 'UPCOMING' && (
                <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                  {t('upcoming')}
                </div>
              )}
              {status === 'PASSED' && (
                <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  {t('passed')}
                </div>
              )}
            </>
          )}
        </div>

        {isLoading ? (
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse"></div>
        ) : (
          <h2 className={`text-base font-bold mb-2 ${isActive ? 'text-white' : colorClass}`}>{title}</h2>
        )}
        
        <div className="min-h-[40px] flex items-center justify-center mb-2">
           {isLoading ? (
              <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
           ) : time ? (
              <div className="text-2xl md:text-3xl font-black tracking-tight flex items-center justify-center gap-2 flex-wrap">
                <span>{formatTime(time.start)}</span>
                <span className="text-lg font-light opacity-60">–</span>
                <span>{formatTime(time.end)}</span>
              </div>
           ) : null}
        </div>
        
        <div className="flex items-center justify-center h-5 mt-1 w-full">
           {isLoading ? (
             <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
           ) : (
             <div className={`flex items-center gap-1.5 text-sm font-medium ${isActive ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export const CurrentRahu: React.FC<Props> = ({ data, isLoading = false }) => {
  const { t, language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TimingCard 
        title={t('rahuKaal') || 'Rahu Kaal'}
        time={data?.rahu}
        isLoading={isLoading}
        colorClass="text-red-600 dark:text-red-400"
        bgClass="bg-red-50 dark:bg-red-900/10"
        activeBgClass="bg-gradient-to-br from-rose-600 to-red-700"
        language={language}
        t={t}
      />
      <TimingCard 
        title={t('yamagandam') || 'Yamagandam'}
        time={data?.yamagandam}
        isLoading={isLoading}
        colorClass="text-orange-600 dark:text-orange-400"
        bgClass="bg-orange-50 dark:bg-orange-900/10"
        activeBgClass="bg-gradient-to-br from-orange-500 to-amber-600"
        language={language}
        t={t}
      />
      <TimingCard 
        title={t('gulika') || 'Gulika Kaal'}
        time={data?.gulika}
        isLoading={isLoading}
        colorClass="text-yellow-600 dark:text-yellow-400"
        bgClass="bg-yellow-50 dark:bg-yellow-900/10"
        activeBgClass="bg-gradient-to-br from-yellow-400 to-yellow-600"
        language={language}
        t={t}
      />
    </div>
  );
};