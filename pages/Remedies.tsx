import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Remedies() {
  useEffect(() => {
    document.title = "Rahu Kaal Remedies & Mantras - How to mitigate negative effects";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Discover powerful mantras, the Hanuman Chalisa, and practical remedies to mitigate the negative effects of Rahu Kaal.');
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Tracker
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
        Rahu Kaal Remedies & Mantras
      </h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          While it is generally advised to avoid starting new ventures during Rahu Kaal, sometimes it is unavoidable. In such cases, Vedic astrology suggests several remedies and mantras to mitigate the negative effects of Rahu.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Powerful Mantras</h2>
          <div className="bg-indigo-50 dark:bg-slate-900 p-6 rounded-xl border border-indigo-100 dark:border-slate-700 mb-4">
            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">Rahu Beej Mantra</h3>
            <p className="font-medium text-lg mb-1">"Om Bhraam Bhreem Bhraum Sah Rahave Namah"</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Chanting this mantra 108 times can help pacify Rahu and reduce its malefic effects.</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-slate-900 p-6 rounded-xl border border-orange-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">Hanuman Chalisa</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Lord Hanuman is known to protect his devotees from the negative influences of all planets, including Rahu. Reciting the Hanuman Chalisa before stepping out or starting a task during Rahu Kaal is highly recommended.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Practical Tips & Remedies</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Offerings:</strong> Donating black sesame seeds, black cloth, or mustard oil on Saturdays can help appease Rahu.</li>
            <li><strong>Worship Lord Shiva:</strong> Rahu is a devotee of Lord Shiva. Offering water or milk to a Shivling can bring peace and reduce Rahu's negative impact.</li>
            <li><strong>Avoid Clutter:</strong> Rahu thrives in confusion and clutter. Keeping your home and workspace clean and organized can help minimize its influence.</li>
            <li><strong>Wear Silver:</strong> Wearing a silver ring or chain can help balance the energies and provide a calming effect.</li>
            <li><strong>Eat Sweet Before Leaving:</strong> If you must leave the house during Rahu Kaal for an important task, eat a little jaggery (gud) or something sweet before stepping out.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
