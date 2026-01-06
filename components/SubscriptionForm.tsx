
import React, { useState } from 'react';
import { Coordinates } from '../types';
import { subscribeUser } from '../services/subscriptionService';
import { Smartphone, User, MapPin, CheckCircle, Loader2, Send } from 'lucide-react';

interface Props {
  currentCoords: Coordinates;
}

export const SubscriptionForm: React.FC<Props> = ({ currentCoords }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setStatus('LOADING');

    try {
      await subscribeUser({
        name,
        phone,
        location: currentCoords.label || 'Unknown',
        lat: currentCoords.lat,
        lng: currentCoords.lng
      });
      setStatus('SUCCESS');
      setName('');
      setPhone('');
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-xl text-white text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">You're Subscribed!</h3>
        <p className="text-indigo-100">
          We'll send daily Rahu Kaal alerts for <strong>{currentCoords.label || 'your location'}</strong> to your phone.
        </p>
        <button 
          onClick={() => setStatus('IDLE')}
          className="mt-6 text-sm font-medium text-white/80 hover:text-white underline"
        >
          Register another number
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl shrink-0">
             <Smartphone className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Get Daily SMS Alerts</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Don't miss a timing. Receive precise Rahu Kaal timings for your location directly to your phone every morning.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 px-1">
              <MapPin className="w-3 h-3" />
              <span>Registering for: <span className="font-medium text-slate-700 dark:text-slate-300">{currentCoords.label || 'Current Location'}</span></span>
            </div>

            <button
              type="submit"
              disabled={status === 'LOADING'}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'LOADING' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Subscribe Now
                </>
              )}
            </button>
            {status === 'ERROR' && (
              <p className="text-red-500 text-sm mt-2 text-center">Something went wrong. Please try again.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
