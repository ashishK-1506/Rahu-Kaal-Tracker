import React, { useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function RahuKaalChart({ onBack }: Props) {
  useEffect(() => {
    document.title = "Rahu Kaal Standard Chart - Weekly Timings Reference";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'View the standard, approximate Rahu Kaal timings chart for each day of the week. Learn the mnemonic to memorize the segments.');
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Tracker
      </button>
      
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
        Rahu Kaal Standard Chart
      </h1>
      
      <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        This chart provides the <strong>standard, approximate</strong> timings for Rahu Kaal for each day of the week. 
        <br/><br/>
        <strong>Important Note:</strong> These timings are based on a standard 6:00 AM sunrise and 6:00 PM sunset. Because actual sunrise and sunset times vary significantly based on your exact location and the time of year, <strong>you should always use the tracker on our homepage for precise, location-specific timings.</strong>
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-bold">
            <tr>
              <th scope="col" className="px-6 py-4 whitespace-nowrap">Day of the Week</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap">Standard Time (Approximate)</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap">Segment (out of 8)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Monday</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">07:30 AM - 09:00 AM</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">2nd Segment</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Tuesday</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">03:00 PM - 04:30 PM</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">7th Segment</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Wednesday</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">12:00 PM - 01:30 PM</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">5th Segment</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Thursday</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">01:30 PM - 03:00 PM</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">6th Segment</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Friday</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">10:30 AM - 12:00 PM</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">4th Segment</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Saturday</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">09:00 AM - 10:30 AM</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">3rd Segment</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Sunday</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">04:30 PM - 06:00 PM</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">8th Segment</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3">
        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-900 dark:text-indigo-200">
          <strong>Tip:</strong> To memorize the order of segments (from 2nd to 8th), you can use the mnemonic: <strong>M</strong>other <strong>S</strong>aw <strong>F</strong>ather <strong>W</strong>earing <strong>T</strong>he <strong>T</strong>urban <strong>S</strong>uddenly. (Monday=2, Saturday=3, Friday=4, Wednesday=5, Thursday=6, Tuesday=7, Sunday=8).
        </p>
      </div>
    </div>
  );
}
