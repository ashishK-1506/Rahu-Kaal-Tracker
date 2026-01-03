import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, BookOpen, Star, HelpCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Guide & Privacy</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Astrological significance and usage instructions</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-8 pt-2 border-t border-slate-100 dark:border-slate-700/50 space-y-8 animate-in slide-in-from-top-2 fade-in duration-300">
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Astrological Significance</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    In Vedic Astrology, <strong>Rahu</strong> is a shadow planet (North Node of the Moon) associated with materialism, mischief, and eclipses. 
                    <strong>Rahu Kaal</strong> (Time of Rahu) is a daily period of approximately 90 minutes deemed inauspicious for beginning new, important ventures.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-2">
                    It is believed that activities started during this time may face obstacles or yield negative results. However, routine activities (like daily work or ongoing projects) 
                    are not affected and can be continued normally.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-sky-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">How to Use This Tracker</h4>
                  <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-2 list-disc pl-4">
                    <li><strong>Location Matters:</strong> Rahu Kaal varies by seconds or minutes depending on your longitude and latitude. Always ensure your location is set correctly.</li>
                    <li><strong>Plan Ahead:</strong> Use the "Upcoming 7 Days" table to schedule meetings or ceremonies outside of these windows.</li>
                    <li><strong>Set Alerts:</strong> Enable notifications to get reminders 15 minutes (or your preferred time) before Rahu Kaal begins.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                 <div>
                   <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Privacy & Data Security</h4>
                   <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                     <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                       We prioritize your privacy. Here is how we handle your data:
                     </p>
                     <ul className="text-slate-600 dark:text-slate-300 text-sm mt-2 space-y-1">
                       <li className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         Location data is processed locally on your device.
                       </li>
                       <li className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         We do not store your coordinates on any server.
                       </li>
                       <li className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         Preferences are saved in your browser's LocalStorage.
                       </li>
                     </ul>
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
