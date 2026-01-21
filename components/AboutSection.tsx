import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, BookOpen, Star, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('aboutGuide')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('aboutSubtitle')}</p>
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
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{t('astroSig')}</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {t('astroDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-sky-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{t('howToUse')}</h4>
                  <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-2 list-disc pl-4">
                    <li>{t('useTip1')}</li>
                    <li>{t('useTip2')}</li>
                    <li>{t('useTip3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                 <div>
                   <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{t('privacy')}</h4>
                   <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                     <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                       {t('privacyDesc')}
                     </p>
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