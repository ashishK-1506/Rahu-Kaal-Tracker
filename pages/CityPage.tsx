import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Coordinates } from '../types';

interface Props {
  onCitySelect: (coords: Coordinates) => void;
  children: React.ReactNode;
}

export function CityPage({ onCitySelect, children }: Props) {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCity() {
      if (!city) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const name = data[0].display_name.split(',')[0];
          
          onCitySelect({ lat, lng, label: name });
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching city:", err);
        setError(true);
        setLoading(false);
      }
    }

    fetchCity();
  }, [city, navigate, onCitySelect]);

  useEffect(() => {
    if (!loading && !error && city) {
      const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
      document.title = `Rahu Kaal Today in ${formattedCity} - Accurate Timings`;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', `Check the exact Rahu Kaal, Yamagandam, and Gulika Kaal timings for today in ${formattedCity}. Plan your important activities with our accurate Vedic astrology calculator.`);
    }
  }, [city, loading, error]);

  if (error) {
    return (
      <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">City not found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">We couldn't find the city "{city}".</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go back home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500 dark:text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
        <p>Loading Rahu Kaal for {city}...</p>
      </div>
    );
  }

  return <>{children}</>;
}
