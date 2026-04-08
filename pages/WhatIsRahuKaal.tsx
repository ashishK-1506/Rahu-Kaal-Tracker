import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function WhatIsRahuKaal({ onBack }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "What is Rahu Kaal? Mythology, Significance & Calculation";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Learn about the mythology, astrological significance, and calculation method of Rahu Kaal in Vedic astrology.');
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Tracker
      </button>
      
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
        What is Rahu Kaal?
      </h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">The Mythology</h2>
          <p>
            In Hindu mythology, Rahu is a shadow entity, often depicted as the severed head of an asura (demon) named Swarbhanu. According to the legend of the Samudra Manthan (churning of the ocean), Swarbhanu disguised himself as a deva (god) to drink the nectar of immortality (Amrita). The sun and moon gods realized the deception and informed Lord Vishnu.
          </p>
          <p>
            Lord Vishnu, in his Mohini avatar, severed Swarbhanu's head with his Sudarshana Chakra just as the nectar reached his throat. Because the nectar had touched his throat, the head remained immortal and became known as Rahu, while the body became Ketu. Rahu is said to periodically swallow the sun and moon in revenge, causing eclipses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Astrological Significance</h2>
          <p>
            In Vedic astrology, Rahu is considered a malefic planet that represents materialism, mischief, fear, dissatisfaction, obsession, and confusion. Rahu Kaal (or Rahukaalam) is a specific period of approximately 90 minutes every day that is ruled by Rahu.
          </p>
          <p>
            Because of Rahu's chaotic and unpredictable nature, this period is considered highly inauspicious for starting any new, important, or auspicious ventures. It is believed that activities initiated during Rahu Kaal are more likely to face obstacles, delays, or end in failure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">How is it Calculated?</h2>
          <p>
            Rahu Kaal is calculated based on the local sunrise and sunset times, which means it varies from city to city and day to day. The total daylight period (from sunrise to sunset) is divided into 8 equal segments. 
          </p>
          <p>
            Each day of the week has a specific segment assigned to Rahu Kaal. For example, on Sundays, it is the 8th segment of the day, while on Mondays, it is the 2nd segment. Because sunrise and sunset times change throughout the year and depend on your exact geographical coordinates, Rahu Kaal must be calculated specifically for your location.
          </p>
        </section>
      </div>
    </div>
  );
}
