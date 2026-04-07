import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export function DoAndDont() {
  useEffect(() => {
    document.title = "Rahu Kaal Do's and Don'ts - What to avoid and what is okay";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'A practical guide on what activities to avoid during Rahu Kaal and what routine tasks are perfectly fine to continue.');
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Tracker
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
        Rahu Kaal: Do's and Don'ts
      </h1>
      
      <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
        Rahu Kaal is a specific period of the day considered inauspicious for starting new ventures. However, it doesn't mean you have to stop all activities. Here is a practical guide on what to avoid and what is perfectly fine to continue during this time.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Don'ts Section */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400">
            <XCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">What to Avoid (Don'ts)</h2>
          </div>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Starting a new business or signing important contracts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Making significant financial investments or large purchases (like a house or car).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Beginning a long journey, especially for an important purpose.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Performing auspicious ceremonies like weddings, engagements, or housewarming (Griha Pravesh).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Starting a new job or attending a crucial job interview.</span>
            </li>
          </ul>
        </div>

        {/* Do's Section */}
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <h2 className="text-xl font-bold">What is Okay (Do's)</h2>
          </div>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Continuing routine, day-to-day work or ongoing projects.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Performing regular household chores and daily tasks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Engaging in spiritual practices, meditation, or chanting mantras.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Completing tasks that were already initiated before Rahu Kaal began.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Dealing with matters related to Rahu itself (e.g., studying foreign languages, dealing with electronics, or certain types of research).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
