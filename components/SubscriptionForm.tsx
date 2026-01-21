import React, { useState } from 'react';
import { Coordinates } from '../types';
import { subscribeUser } from '../services/subscriptionService';
import { Smartphone, User, MapPin, CheckCircle, Loader2, Send, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  currentCoords: Coordinates;
}

export const SubscriptionForm: React.FC<Props> = ({ currentCoords }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  // Validation state
  const [errors, setErrors] = useState<{name?: string, phone?: string}>({});
  const [touched, setTouched] = useState<{name?: boolean, phone?: boolean}>({});

  const validatePhone = (number: string) => {
    // Basic regex: allows +, spaces, dashes, parentheses, and 7-15 digits
    const cleaned = number.replace(/[\s\-()]/g, '');
    const isNumeric = /^[+]?[0-9]{7,15}$/.test(cleaned);
    return isNumeric;
  };

  const handleBlur = (field: 'name' | 'phone') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'name' ? name : phone);
  };

  const validateField = (field: 'name' | 'phone', value: string) => {
    let error = '';
    if (field === 'name') {
      if (!value.trim()) error = 'Name is required';
      else if (value.trim().length < 2) error = 'Name is too short';
    } else {
      if (!value.trim()) error = 'Phone number is required';
      else if (!validatePhone(value)) error = 'Please enter a valid mobile number';
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) newErrors[field] = error;
      else delete newErrors[field];
      return newErrors;
    });
    return !error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true });

    const isNameValid = validateField('name', name);
    const isPhoneValid = validateField('phone', phone);

    if (!isNameValid || !isPhoneValid) return;

    setStatus('LOADING');

    try {
      await subscribeUser({
        name: name.trim(),
        phone: phone.trim(),
        location: currentCoords.label || 'Unknown',
        lat: currentCoords.lat,
        lng: currentCoords.lng
      });
      setStatus('SUCCESS');
      setName('');
      setPhone('');
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9+\-\s()]*$/.test(val)) {
        setPhone(val);
        if (touched.phone) validateField('phone', val);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      if (touched.name) validateField('name', e.target.value);
  };

  const getInputClassName = (hasError: boolean) => {
    const base = "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all";
    const normal = "border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    const errorState = "border-red-300 dark:border-red-500/50 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50";
    
    return `${base} ${hasError ? errorState : normal}`;
  };

  const getIconClassName = (hasError: boolean, isGroupFocus: boolean = false) => {
    const base = "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors";
    if (hasError) return `${base} text-red-400`;
    return `${base} text-slate-400 group-focus-within:text-indigo-500`;
  };

  if (status === 'SUCCESS') {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-xl text-white text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">{t('successTitle')}</h3>
        <p className="text-indigo-100">
          {t('successDesc')} <strong>{currentCoords.label || 'your location'}</strong>.
        </p>
        <button 
          onClick={() => setStatus('IDLE')}
          className="mt-6 text-sm font-medium text-white/80 hover:text-white underline"
        >
          {t('registerAnother')}
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('subscribeTitle')}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t('subscribeDesc')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                {t('fullName')}
              </label>
              <div className="relative group">
                <User className={getIconClassName(!!(errors.name && touched.name))} />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. John Doe"
                  className={getInputClassName(!!(errors.name && touched.name))}
                />
              </div>
              {errors.name && touched.name && (
                <div className="flex items-center gap-1.5 ml-1 text-xs text-red-500 animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                {t('phoneNumber')}
              </label>
              <div className="relative group">
                <Smartphone className={getIconClassName(!!(errors.phone && touched.phone))} />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                  placeholder="e.g. +91 98765 43210"
                  className={getInputClassName(!!(errors.phone && touched.phone))}
                />
              </div>
              {errors.phone && touched.phone && (
                <div className="flex items-center gap-1.5 ml-1 text-xs text-red-500 animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 px-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{t('registeringFor')} <span className="font-medium text-slate-700 dark:text-slate-300">{currentCoords.label || t('currentLocation')}</span></span>
            </div>

            <button
              type="submit"
              disabled={status === 'LOADING'}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {status === 'LOADING' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('subscribing')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('subscribeBtn')}
                </>
              )}
            </button>
            {status === 'ERROR' && (
              <p className="text-red-500 text-sm mt-3 text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Connection failed. Please try again.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};