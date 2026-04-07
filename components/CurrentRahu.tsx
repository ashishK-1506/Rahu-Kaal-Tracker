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
  const [status, setStatus] = useState<'SAFE' | 'APPROACHING' | 'ACTIVE' | 'PASSED'>('SAFE');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!time || isLoading) return;
    const update = () => {
      const now = new Date();
      let newStatus: 'SAFE' | 'APPROACHING' | 'ACTIVE' | 'PASSED' = 'SAFE';
      let newProgress = 0;

      const formatDuration = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
      };

      if (now > time.end) {
        newStatus = 'PASSED';
        newProgress = 100;
        setTimeLeft(t('completed'));
      } else if (now >= time.start) {
        newStatus = 'ACTIVE';
        const total = time.end.getTime() - time.start.getTime();
        const elapsed = now.getTime() - time.start.getTime();
        newProgress = Math.min(100, Math.max(0, (elapsed / total) * 100));
        setTimeLeft(formatDuration(time.end.getTime() - now.getTime()));
      } else {
        const diff = time.start.getTime() - now.getTime();
        if (diff <= 60 * 60 * 1000) { // 1 hour
          newStatus = 'APPROACHING';
        } else {
          newStatus = 'SAFE';
        }
        newProgress = 0;
        setTimeLeft(formatDuration(diff));
      }

      setStatus(newStatus);
      setProgress(newProgress);
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

  let currentBgClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  let textColorClass = colorClass;
  let badgeClass = '';
  let badgeText = '';
  let badgeIcon = null;

  if (!isLoading) {
    if (status === 'ACTIVE') {
      currentBgClass = `${activeBgClass} border-transparent text-white shadow-xl scale-[1.02]`;
      textColorClass = 'text-white';
      badgeClass = 'bg-white/20 text-white';
      badgeText = t('active');
      badgeIcon = <AlertTriangle className="w-3 h-3" />;
    } else if (status === 'APPROACHING') {
      currentBgClass = 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50';
      textColorClass = 'text-amber-700 dark:text-amber-400';
      badgeClass = 'bg-amber-200 dark:bg-amber-800/50 text-amber-800 dark:text-amber-300';
      badgeText = t('upcoming');
      badgeIcon = <Clock className="w-3 h-3" />;
    } else if (status === 'SAFE') {
      currentBgClass = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/50';
      textColorClass = 'text-emerald-700 dark:text-emerald-400';
      badgeClass = 'bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300';
      badgeText = t('safePeriod') || 'Safe';
      badgeIcon = <CheckCircle className="w-3 h-3" />;
    } else if (status === 'PASSED') {
      currentBgClass = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-80';
      textColorClass = 'text-slate-500 dark:text-slate-400';
      badgeClass = 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
      badgeText = t('passed');
      badgeIcon = <CheckCircle className="w-3 h-3" />;
    }
  }

  const containerClasses = `relative overflow-hidden rounded-3xl p-6 shadow-lg transition-all duration-700 flex flex-col justify-between border min-h-[220px] ${currentBgClass}`;

  return (
    <div className={containerClasses}>
      <div className="relative z-10 flex flex-col w-full h-full">
        {/* Header: Title & Badge */}
        <div className="flex justify-between items-start mb-4">
          {isLoading ? (
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ) : (
            <h2 className={`text-lg font-bold ${textColorClass}`}>{title}</h2>
          )}

          {isLoading ? (
             <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass} ${status === 'ACTIVE' ? 'animate-pulse' : ''}`}>
              {badgeIcon}
              {badgeText}
            </div>
          )}
        </div>

        {/* Big Countdown */}
        <div className="flex-1 flex flex-col justify-center mb-4">
           {isLoading ? (
             <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-2"></div>
           ) : (
             <div className="flex flex-col">
                <span className={`text-sm font-medium mb-1 ${status === 'ACTIVE' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {status === 'PASSED' ? t('completed') : (status === 'ACTIVE' ? t('endsIn') : t('startsIn'))}
                </span>
                {status !== 'PASSED' && (
                  <div className={`text-3xl md:text-4xl font-black tracking-tight tabular-nums ${textColorClass}`}>
                    {timeLeft}
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Time Range & Progress */}
        <div className="mt-auto">
          {isLoading ? (
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3"></div>
          ) : time ? (
            <div className={`flex items-center gap-2 text-sm font-medium mb-3 ${status === 'ACTIVE' ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>
              <Clock className="w-4 h-4 opacity-70" />
              <span>{formatTime(time.start)} - {formatTime(time.end)}</span>
            </div>
          ) : null}

          {/* Progress Bar */}
          <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${status === 'ACTIVE' ? 'bg-white' : (status === 'PASSED' ? 'bg-slate-400' : 'bg-transparent')}`}
              style={{ width: `${progress}%` }}
            />
          </div>
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