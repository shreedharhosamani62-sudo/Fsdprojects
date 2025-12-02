import React, { useState } from 'react';
import { MapPin, Calendar, Search, ArrowRightLeft } from 'lucide-react';
import { CITIES } from '../constants';
import { SearchParams } from '../types';

interface SearchWidgetProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: SearchParams;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, initialParams }) => {
  const [source, setSource] = useState(initialParams?.source || 'Bangalore');
  const [destination, setDestination] = useState(initialParams?.destination || 'Goa');
  const [date, setDate] = useState(initialParams?.date || new Date().toISOString().split('T')[0]);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ source, destination, date });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-5xl mx-auto -mt-16 relative z-10">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* Source */}
        <div className="flex-1 w-full relative group">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">From</label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
            <select 
              value={source} 
              onChange={(e) => setSource(e.target.value)}
              className="bg-transparent w-full outline-none font-medium text-gray-700 appearance-none cursor-pointer"
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <button 
          type="button" 
          onClick={handleSwap}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-brand-600 transition-colors mt-6 hidden md:block"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </button>

        {/* Destination */}
        <div className="flex-1 w-full relative">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">To</label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
            <select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent w-full outline-none font-medium text-gray-700 appearance-none cursor-pointer"
            >
              {CITIES.map(city => (
                <option key={city} value={city} disabled={city === source}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div className="flex-1 w-full relative">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Date</label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="date" 
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent w-full outline-none font-medium text-gray-700"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="w-full md:w-auto mt-6">
          <button 
            type="submit"
            className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Buses
          </button>
        </div>

      </form>
    </div>
  );
};