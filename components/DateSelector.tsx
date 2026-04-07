import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const DateSelector: React.FC<Props> = ({ selectedDate, onChange }) => {
  const { language } = useLanguage();

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onChange(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      onChange(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <button 
          onClick={handlePrevDay}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {isToday ? (language === 'hi' ? 'आज' : 'Today') : formatDate(selectedDate)}
          </span>
          {isToday && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(selectedDate)}
            </span>
          )}
        </div>

        <button 
          onClick={handleNextDay}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="relative w-full sm:w-auto flex items-center">
        <label htmlFor="date-picker" className="sr-only">Select date</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarIcon className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="date"
          id="date-picker"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
          className="block w-full sm:w-auto pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        />
      </div>
    </div>
  );
};
