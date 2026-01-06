
import React, { useState, useEffect, useRef } from 'react';
import { Coordinates, CitySearchResult } from '../types';
import { getCityName, searchCities } from '../services/api';
import { MapPin, Navigation, Search, Loader2, X } from 'lucide-react';

interface Props {
  currentCoords: Coordinates;
  onLocationChange: (coords: Coordinates) => void;
}

export const LocationControl: React.FC<Props> = ({ currentCoords, onLocationChange }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeout = useRef<number | undefined>(undefined);

  const handleGeoLocation = () => {
    setLocLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let label = 'Current Location';
          
          try {
            label = await getCityName(lat, lng);
          } catch (e) {
            console.error(e);
          }

          onLocationChange({
            lat,
            lng,
            label,
          });
          setLocLoading(false);
          setIsSearching(false);
        },
        (error) => {
          alert('Could not detect location. Please search manually.');
          setLocLoading(false);
          setIsSearching(true);
        }
      );
    } else {
      alert('Geolocation not supported');
      setLocLoading(false);
      setIsSearching(true);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (val.length < 3) {
      setResults([]);
      return;
    }

    setSearchLoading(true);
    searchTimeout.current = window.setTimeout(async () => {
      const data = await searchCities(val);
      setResults(data);
      setSearchLoading(false);
    }, 500);
  };

  const selectCity = (city: CitySearchResult) => {
    onLocationChange({
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lon),
      label: city.display_name.split(',')[0], // Use first part of display name
    });
    setIsSearching(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg shrink-0">
            <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Current Location</div>
            <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2 truncate">
               {locLoading && <Loader2 className="w-3 h-3 animate-spin"/>}
               <span className="truncate">{currentCoords.label || `${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}`}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto min-w-[200px]">
          {isSearching ? (
            <div className="relative w-full">
               <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder="Search city..." 
                        autoFocus
                        value={query} 
                        onChange={handleSearchInput}
                        className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    {searchLoading && <Loader2 className="absolute right-2 top-2.5 w-4 h-4 animate-spin text-slate-400" />}
                </div>
                <button 
                  onClick={() => setIsSearching(false)} 
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
               </div>

               {/* Dropdown Results */}
               {results.length > 0 && (
                 <ul className="absolute z-50 top-full mt-2 left-0 w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                    {results.map((city) => (
                      <li key={city.place_id}>
                        <button 
                          onClick={() => selectCity(city)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 last:border-0"
                        >
                          {city.display_name}
                        </button>
                      </li>
                    ))}
                 </ul>
               )}
               {query.length >= 3 && !searchLoading && results.length === 0 && (
                   <div className="absolute z-50 top-full mt-2 left-0 w-full bg-white dark:bg-slate-800 p-2 text-sm text-slate-500 text-center border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
                       No results found
                   </div>
               )}
            </div>
          ) : (
            <>
               <button 
                onClick={handleGeoLocation}
                disabled={locLoading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {locLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Navigation className="w-4 h-4" />}
                <span>Detect</span>
              </button>
              <button 
                onClick={() => {
                  setIsSearching(true);
                  setQuery('');
                  setResults([]);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search City</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
