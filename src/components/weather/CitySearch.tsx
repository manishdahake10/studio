
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface CitySearchProps {
  onSearch: (city: string) => void;
  initialCity?: string;
  isLoading: boolean;
}

export function CitySearch({ onSearch, initialCity = '', isLoading }: CitySearchProps) {
  const [city, setCity] = useState(initialCity);

  useEffect(() => {
    // Update the internal city state if the initialCity prop changes
    // This is important for when WeatherDashboard loads the city from localStorage
    // after CitySearch has already mounted.
    setCity(initialCity);
  }, [initialCity]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2 mx-auto my-4">
      <Input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={isLoading}
        aria-label="City name"
      />
      <Button type="submit" disabled={isLoading || !city.trim()}>
        <Search className="mr-2 h-4 w-4" /> {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}
